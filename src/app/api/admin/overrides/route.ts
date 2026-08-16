import { NextRequest, NextResponse } from "next/server";
import { apiError, auditAndTouch, requireAdminRequest } from "@/lib/admin";
import { getActiveTournament } from "@/lib/active-tournament";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { overridesSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdminRequest(request);
  if (unauthorized) return unauthorized;
  try {
    const input = overridesSchema.parse(await request.json());
    if (new Set(input.entries.map((entry) => entry.manual_rank)).size !== input.entries.length) {
      throw new Error("Ogni partecipante coinvolto deve avere una posizione manuale diversa.");
    }
    const client = createServerSupabaseClient();
    const tournament = await getActiveTournament(client);
    const { error: deleteError } = await client
      .from("ranking_overrides")
      .delete()
      .eq("tournament_id", tournament.id)
      .eq("group_code", input.group_code);
    if (deleteError) throw new Error("Non è stato possibile sostituire l’ordine precedente.");
    const { error: insertError } = await client.from("ranking_overrides").insert(
      input.entries.map((entry) => ({
        ...entry,
        tournament_id: tournament.id,
        group_code: input.group_code,
        reason: input.reason,
      })),
    );
    if (insertError) throw new Error("Non è stato possibile salvare l’ordine manuale.");
    await auditAndTouch(
      "override_classifica",
      "ranking_overrides",
      `Risolta parità nel Girone ${input.group_code}`,
    );
    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}
