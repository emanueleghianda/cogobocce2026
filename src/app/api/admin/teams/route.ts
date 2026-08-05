import { NextRequest, NextResponse } from "next/server";
import { apiError, auditAndTouch, requireAdminRequest } from "@/lib/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { teamDeleteSchema, teamUpdateSchema } from "@/lib/validation";
import type { Team } from "@/types/tournament";

export async function PUT(request: NextRequest) {
  const unauthorized = await requireAdminRequest(request);
  if (unauthorized) return unauthorized;
  try {
    const input = teamUpdateSchema.parse(await request.json());
    const { data, error } = await createServerSupabaseClient()
      .from("teams")
      .update({
        name: input.name,
        player_one: input.player_one ?? null,
        player_two: input.player_two ?? null,
        group_code: input.group_code,
        display_order: input.display_order,
      })
      .eq("id", input.id)
      .select()
      .single();
    if (error) throw new Error("Non è stato possibile salvare la coppia.");
    await auditAndTouch("modifica_coppia", "team", `Aggiornata ${input.name}`, input.id);
    return NextResponse.json({ data });
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(request: NextRequest) {
  const unauthorized = await requireAdminRequest(request);
  if (unauthorized) return unauthorized;
  try {
    const input = teamDeleteSchema.parse(await request.json());
    const client = createServerSupabaseClient();
    const { data: teamData, error: teamError } = await client
      .from("teams")
      .select("*")
      .eq("id", input.id)
      .single();
    if (teamError || !teamData) throw new Error("La coppia selezionata non esiste.");
    const team = teamData as Team;

    const [{ count: groupSize, error: countError }, { count: finalsCount, error: finalsError }] = await Promise.all([
      client.from("teams").select("id", { count: "exact", head: true }).eq("group_code", team.group_code),
      client.from("matches").select("id", { count: "exact", head: true }).neq("stage", "group"),
    ]);
    if (countError || finalsError) throw new Error("Non è stato possibile verificare il girone.");
    if ((groupSize ?? 0) <= 3) {
      throw new Error(`Il Girone ${team.group_code} deve conservare almeno tre coppie.`);
    }
    if ((finalsCount ?? 0) > 0) {
      throw new Error("Non è possibile rimuovere coppie dopo la generazione della fase finale.");
    }

    const { data: linkedMatches, error: linkedError } = await client
      .from("matches")
      .select("id")
      .or(`team_one_id.eq.${input.id},team_two_id.eq.${input.id}`);
    if (linkedError) throw new Error("Non è stato possibile verificare gli incontri collegati.");
    const linkedIds = (linkedMatches ?? []).map((match) => match.id as string);
    if (linkedIds.length > 0) {
      const { error: matchesError } = await client.from("matches").delete().in("id", linkedIds);
      if (matchesError) throw new Error("Non è stato possibile eliminare gli incontri collegati.");
    }

    const { error: overridesError } = await client
      .from("ranking_overrides")
      .delete()
      .eq("group_code", team.group_code);
    if (overridesError) throw new Error("Non è stato possibile aggiornare la classifica del girone.");

    const { error: deleteError } = await client.from("teams").delete().eq("id", input.id);
    if (deleteError) throw new Error("Non è stato possibile rimuovere la coppia.");

    await auditAndTouch(
      "rimozione_coppia",
      "team",
      `Rimossa ${team.name} dal Girone ${team.group_code}; eliminati ${linkedIds.length} incontri collegati`,
      input.id,
    );
    return NextResponse.json({ ok: true, count: linkedIds.length });
  } catch (error) {
    return apiError(error);
  }
}
