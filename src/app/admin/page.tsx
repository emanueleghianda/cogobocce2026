import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { hasAdminSession } from "@/lib/auth";
import { getActiveTournament } from "@/lib/active-tournament";
import { INITIAL_HISTORICAL_RANKING, INITIAL_SETTINGS, INITIAL_TOURNAMENT } from "@/lib/constants";
import { createServerSupabaseClient, isServerSupabaseConfigured } from "@/lib/supabase/server";
import type { HistoricalRanking, Match, RankingOverride, Team, Tournament, TournamentSettings } from "@/types/tournament";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Area amministratore", robots: { index: false, follow: false } };

export default async function AdminPage() {
  if (!(await hasAdminSession())) return <LoginForm />;
  let teams: Team[] = [];
  let matches: Match[] = [];
  let ranking: HistoricalRanking[] = INITIAL_HISTORICAL_RANKING;
  let settings: TournamentSettings = INITIAL_SETTINGS;
  let overrides: RankingOverride[] = [];
  let tournament: Tournament = INITIAL_TOURNAMENT;
  const connected = isServerSupabaseConfigured();
  if (connected) {
    const client = createServerSupabaseClient();
    tournament = await getActiveTournament(client);
    const [teamsResult, matchesResult, rankingResult, settingsResult, overridesResult] = await Promise.all([
      client.from("teams").select("*").eq("tournament_id", tournament.id).order("display_order"),
      client.from("matches").select("*").eq("tournament_id", tournament.id).order("scheduled_at", { ascending: true, nullsFirst: false }),
      client.from("historical_ranking").select("*").order("display_order"),
      client.from("tournament_settings").select("*").eq("tournament_id", tournament.id).single(),
      client.from("ranking_overrides").select("*").eq("tournament_id", tournament.id),
    ]);
    if (!teamsResult.error) teams = (teamsResult.data ?? []) as Team[];
    if (!matchesResult.error) matches = (matchesResult.data ?? []) as Match[];
    if (!rankingResult.error) ranking = (rankingResult.data ?? []) as HistoricalRanking[];
    if (!settingsResult.error && settingsResult.data) settings = settingsResult.data as TournamentSettings;
    if (!overridesResult.error) overrides = (overridesResult.data ?? []) as RankingOverride[];
  }
  return <AdminDashboard tournament={tournament} teams={teams} matches={matches} ranking={ranking} settings={settings} overrides={overrides} connected={connected} />;
}
