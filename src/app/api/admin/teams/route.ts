import { NextRequest, NextResponse } from "next/server";
import { apiError, auditAndTouch, requireAdminRequest } from "@/lib/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { teamUpdateSchema } from "@/lib/validation";

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
