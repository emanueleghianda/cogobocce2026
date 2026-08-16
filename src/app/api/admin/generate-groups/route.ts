import { NextRequest, NextResponse } from "next/server";
import { apiError, auditAndTouch, requireAdminRequest } from "@/lib/admin";
import { getActiveTournament } from "@/lib/active-tournament";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { generateGroupMatches } from "@/lib/tournament/groups";
import type { Team } from "@/types/tournament";

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdminRequest(request);
  if (unauthorized) return unauthorized;
  try {
    const { confirmed = false } = (await request.json()) as { confirmed?: boolean };
    const client = createServerSupabaseClient();
    const tournament = await getActiveTournament(client);
    const [teamsResult, matchesResult] = await Promise.all([
      client.from("teams").select("*").eq("tournament_id", tournament.id).order("display_order"),
      client.from("matches").select("id,status").eq("tournament_id", tournament.id),
    ]);
    if (teamsResult.error || matchesResult.error) throw new Error("Impossibile verificare i dati del torneo.");
    const existingCount = matchesResult.data?.length ?? 0;
    if (existingCount > 0 && !confirmed) {
      return NextResponse.json(
        {
          confirmationRequired: true,
          count: existingCount,
          error: `${existingCount} partite saranno sostituite. I risultati esistenti verranno cancellati.`,
        },
        { status: 409 },
      );
    }
    const generated = generateGroupMatches((teamsResult.data ?? []) as Team[]);
    if (existingCount > 0) {
      const { error } = await client.from("matches").delete().eq("tournament_id", tournament.id).not("id", "is", null);
      if (error) throw new Error("Non è stato possibile sostituire gli incontri esistenti.");
    }
    const { error: insertError } = await client.from("matches").insert(
      generated.map((match) => ({ ...match, tournament_id: tournament.id })),
    );
    if (insertError) throw new Error("Non è stato possibile creare gli incontri dei gironi.");
    const { error: settingsError } = await client
      .from("tournament_settings")
      .update({ group_matches_generated: true, finals_generated: false, tournament_status: "groups_pending" })
      .eq("tournament_id", tournament.id);
    if (settingsError) throw new Error("Gli incontri sono stati creati, ma lo stato non è stato aggiornato.");
    await auditAndTouch(
      "generazione_incontri",
      "matches",
      `Generati ${generated.length} incontri dei gironi`,
    );
    return NextResponse.json({ ok: true, count: generated.length });
  } catch (error) {
    return apiError(error);
  }
}
