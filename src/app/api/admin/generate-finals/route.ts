import { NextRequest, NextResponse } from "next/server";
import { apiError, auditAndTouch, requireAdminRequest } from "@/lib/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { generateFinalBracket } from "@/lib/tournament/bracket";
import { calculateAllStandings } from "@/lib/tournament/groups";
import type { Match, RankingOverride, Team } from "@/types/tournament";

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdminRequest(request);
  if (unauthorized) return unauthorized;
  try {
    const { confirmed = false } = (await request.json()) as { confirmed?: boolean };
    if (!confirmed) {
      return NextResponse.json(
        { confirmationRequired: true, error: "Conferma la generazione della fase finale." },
        { status: 409 },
      );
    }
    const client = createServerSupabaseClient();
    const [teamsResult, matchesResult, overridesResult] = await Promise.all([
      client.from("teams").select("*").order("display_order"),
      client.from("matches").select("*"),
      client.from("ranking_overrides").select("*"),
    ]);
    if (teamsResult.error || matchesResult.error || overridesResult.error) {
      throw new Error("Impossibile verificare le classifiche.");
    }
    const teams = (teamsResult.data ?? []) as Team[];
    const matches = (matchesResult.data ?? []) as Match[];
    const groupMatches = matches.filter((match) => match.stage === "group");
    if (matches.some((match) => match.stage !== "group")) {
      throw new Error("La fase finale è già stata generata.");
    }
    const standings = calculateAllStandings(
      teams,
      matches,
      (overridesResult.data ?? []) as RankingOverride[],
    );
    if (groupMatches.some((match) => match.status !== "completed") || standings.some((group) => !group.isComplete)) {
      throw new Error("La fase finale richiede tutti gli incontri dei gironi conclusi.");
    }
    if (standings.some((group) => group.unresolvedTie.length > 0 || group.isProvisional)) {
      throw new Error("Sono presenti parità o classifiche provvisorie da risolvere.");
    }
    const finalMatches = generateFinalBracket(standings);
    const { error: insertError } = await client.from("matches").insert(finalMatches);
    if (insertError) throw new Error("Non è stato possibile creare la fase finale.");
    await client
      .from("tournament_settings")
      .update({ finals_generated: true, tournament_status: "quarterfinals" })
      .eq("id", 1);
    await auditAndTouch("generazione_fase_finale", "matches", "Generate le 8 partite della fase finale");
    return NextResponse.json({ ok: true, count: finalMatches.length });
  } catch (error) {
    return apiError(error);
  }
}
