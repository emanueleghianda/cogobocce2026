import { NextRequest, NextResponse } from "next/server";
import { apiError, auditAndTouch, requireAdminRequest } from "@/lib/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { settingsUpdateSchema } from "@/lib/validation";

export async function PUT(request: NextRequest) {
  const unauthorized = await requireAdminRequest(request);
  if (unauthorized) return unauthorized;
  try {
    const input = settingsUpdateSchema.parse(await request.json());
    const { data, error } = await createServerSupabaseClient()
      .from("tournament_settings")
      .update(input)
      .eq("id", 1)
      .select()
      .single();
    if (error) throw new Error("Non è stato possibile aggiornare le impostazioni del torneo.");
    await auditAndTouch(
      "modifica_stato_comunicazione",
      "tournament_settings",
      "Aggiornati stato e comunicazione pubblica",
      "1",
    );
    return NextResponse.json({ data });
  } catch (error) {
    return apiError(error);
  }
}
