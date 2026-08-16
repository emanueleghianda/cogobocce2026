import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Tournament } from "@/types/tournament";

export async function getActiveTournament(client: SupabaseClient): Promise<Tournament> {
  const { data, error } = await client
    .from("tournaments")
    .select("*")
    .eq("is_active", true)
    .single();
  if (error || !data) throw new Error("Il torneo attivo non è disponibile.");
  return data as Tournament;
}
