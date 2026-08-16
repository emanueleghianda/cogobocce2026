import { NextRequest, NextResponse } from "next/server";
import { apiError, auditAndTouch, requireAdminRequest } from "@/lib/admin";
import { INITIAL_HISTORICAL_RANKING } from "@/lib/constants";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { rankingActionSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdminRequest(request);
  if (unauthorized) return unauthorized;
  try {
    const input = rankingActionSchema.parse(await request.json());
    const client = createServerSupabaseClient();
    if (input.action === "update") {
      const { id, ...entry } = input.entry;
      const { error } = await client.from("historical_ranking").update(entry).eq("id", id);
      if (error) throw new Error("Non è stato possibile aggiornare il partecipante.");
      await auditAndTouch("modifica_ranking", "historical_ranking", `Aggiornato ${entry.participant_name}`, id);
    } else if (input.action === "add") {
      const { error } = await client.from("historical_ranking").insert(input.entry);
      if (error) throw new Error("Non è stato possibile aggiungere il partecipante.");
      await auditAndTouch("aggiunta_ranking", "historical_ranking", `Aggiunto ${input.entry.participant_name}`);
    } else if (input.action === "delete") {
      const { error } = await client.from("historical_ranking").delete().eq("id", input.id);
      if (error) throw new Error("Non è stato possibile eliminare il partecipante.");
      await auditAndTouch("eliminazione_ranking", "historical_ranking", "Eliminato un partecipante", input.id);
    } else {
      const { error: deleteError } = await client.from("historical_ranking").delete().not("id", "is", null);
      if (deleteError) throw new Error("Non è stato possibile ripristinare il ranking.");
      const resetRows = INITIAL_HISTORICAL_RANKING.map(({ id, ...entry }) => ({ id, ...entry }));
      const { error: insertError } = await client.from("historical_ranking").insert(resetRows);
      if (insertError) throw new Error("Il ripristino del ranking non è stato completato.");
      await auditAndTouch("ripristino_ranking", "historical_ranking", "Ripristinati i 32 record ufficiali");
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}
