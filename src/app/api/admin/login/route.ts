import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  createAdminToken,
  hashIpAddress,
  SESSION_DURATION_SECONDS,
  verifyAdminPassword,
} from "@/lib/auth";
import {
  createServerSupabaseClient,
  isServerSupabaseConfigured,
} from "@/lib/supabase/server";

const localFailedAttempts = new Map<string, number[]>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILED_ATTEMPTS = 5;

function requestIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "ip-non-disponibile"
  );
}

async function failedAttemptCount(ipHash: string): Promise<number> {
  const cutoff = new Date(Date.now() - WINDOW_MS).toISOString();
  if (isServerSupabaseConfigured()) {
    const { count, error } = await createServerSupabaseClient()
      .from("admin_login_attempts")
      .select("id", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .eq("success", false)
      .gte("attempted_at", cutoff);
    if (!error) return count ?? 0;
  }
  const recent = (localFailedAttempts.get(ipHash) ?? []).filter((time) => time > Date.now() - WINDOW_MS);
  localFailedAttempts.set(ipHash, recent);
  return recent.length;
}

async function recordAttempt(ipHash: string, success: boolean) {
  if (isServerSupabaseConfigured()) {
    await createServerSupabaseClient().from("admin_login_attempts").insert({
      ip_hash: ipHash,
      success,
      attempted_at: new Date().toISOString(),
    });
    return;
  }
  if (!success) {
    localFailedAttempts.set(ipHash, [...(localFailedAttempts.get(ipHash) ?? []), Date.now()]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { password?: unknown };
    const password = typeof body.password === "string" ? body.password : "";
    const ipHash = hashIpAddress(requestIp(request));
    if ((await failedAttemptCount(ipHash)) >= MAX_FAILED_ATTEMPTS) {
      return NextResponse.json(
        { error: "Troppi tentativi. Riprova tra qualche minuto." },
        { status: 429 },
      );
    }
    if (!verifyAdminPassword(password)) {
      await recordAttempt(ipHash, false);
      return NextResponse.json({ error: "Password non valida." }, { status: 401 });
    }
    await recordAttempt(ipHash, true);
    const token = await createAdminToken();
    const response = NextResponse.json({ ok: true });
    response.cookies.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: SESSION_DURATION_SECONDS,
    });
    return response;
  } catch {
    return NextResponse.json(
      { error: "Accesso temporaneamente non disponibile." },
      { status: 500 },
    );
  }
}
