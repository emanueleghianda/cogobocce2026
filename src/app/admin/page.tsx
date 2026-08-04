import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { hasAdminSession } from "@/lib/auth";
import { INITIAL_HISTORICAL_RANKING, INITIAL_SETTINGS, INITIAL_TEAMS } from "@/lib/constants";
import { createServerSupabaseClient, isServerSupabaseConfigured } from "@/lib/supabase/server";
import type { HistoricalRanking, Match, RankingOverride, Team, TournamentSettings } from "@/types/tournament";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Area amministratore", robots: { index: false, follow: false } };

export default async function AdminPage() {
  if (!(await hasAdminSession())) return <LoginForm />;
  let teams: Team[] = INITIAL_TEAMS;
  let matches: Match[] = [];
  let ranking: HistoricalRanking[] = INITIAL_HISTORICAL_RANKING;
  let settings: TournamentSettings = INITIAL_SETTINGS;
  let overrides: RankingOverride[] = [];
  const connected = isServerSupabaseConfigured();
  if (connected) {
    const client = createServerSupabaseClient();
    const [teamsResult, matchesResult, rankingResult, settingsResult, overridesResult] = await Promise.all([
      client.from("teams").select("*").order("display_order"),
      client.from("matches").select("*").order("scheduled_at", { ascending: true, nullsFirst: false }),
      client.from("historical_ranking").select("*").order("display_order"),
      client.from("tournament_settings").select("*").eq("id", 1).single(),
      client.from("ranking_overrides").select("*"),
    ]);
    if (!teamsResult.error) teams = (teamsResult.data ?? []) as Team[];
    if (!matchesResult.error) matches = (matchesResult.data ?? []) as Match[];
    if (!rankingResult.error) ranking = (rankingResult.data ?? []) as HistoricalRanking[];
    if (!settingsResult.error && settingsResult.data) settings = settingsResult.data as TournamentSettings;
    if (!overridesResult.error) overrides = (overridesResult.data ?? []) as RankingOverride[];
  }
  return <AdminDashboard teams={teams} matches={matches} ranking={ranking} settings={settings} overrides={overrides} connected={connected} />;
}
