import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { ADMIN_COOKIE_NAME, verifyAdminToken } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function requireAdminRequest(request: NextRequest): Promise<NextResponse | null> {
  const valid = await verifyAdminToken(request.cookies.get(ADMIN_COOKIE_NAME)?.value);
  return valid ? null : NextResponse.json({ error: "Sessione amministratore non valida." }, { status: 401 });
}

export async function auditAndTouch(
  action: string,
  entityType: string,
  summary: string,
  entityId?: string,
) {
  const client = createServerSupabaseClient();
  const now = new Date().toISOString();
  const [auditResult, settingsResult] = await Promise.all([
    client.from("admin_audit_log").insert({
      action,
      entity_type: entityType,
      entity_id: entityId ?? null,
      summary,
      created_at: now,
    }),
    client
      .from("tournament_settings")
      .update({ last_public_update: now, updated_at: now })
      .eq("id", 1),
  ]);
  if (auditResult.error || settingsResult.error) {
    throw new Error("Aggiornamento registrato, ma non è stato possibile completare il registro attività.");
  }
}

export function apiError(error: unknown, fallback = "Operazione non riuscita."): NextResponse {
  if (error instanceof ZodError) {
    const first = error.issues[0]?.message;
    const message = first && !first.startsWith("Invalid") ? first : "I dati inviati non sono validi.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
  const message = error instanceof Error ? error.message : fallback;
  return NextResponse.json({ error: message }, { status: 400 });
}
