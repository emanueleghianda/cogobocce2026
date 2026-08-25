import "server-only";
import { cache } from "react";
import {
  ARCHIVED_DOUBLE_TOURNAMENT,
  ARCHIVED_SINGLE_TOURNAMENT,
  INITIAL_HISTORICAL_RANKING,
  INITIAL_TRIENNIAL_RANKING,
  INITIAL_SETTINGS,
  INITIAL_TOURNAMENT,
} from "@/lib/constants";
import { createPublicSupabaseClient } from "@/lib/supabase/public";
import {
  createServerSupabaseClient,
  isServerSupabaseConfigured,
} from "@/lib/supabase/server";
import type {
  HistoricalRanking,
  Match,
  PublicTournamentData,
  RankingOverride,
  Team,
  Tournament,
  TournamentSettings,
} from "@/types/tournament";

function fallbackTournamentForSlug(slug?: string): Tournament {
  if (slug === ARCHIVED_DOUBLE_TOURNAMENT.slug) return ARCHIVED_DOUBLE_TOURNAMENT;
  if (slug === ARCHIVED_SINGLE_TOURNAMENT.slug) return ARCHIVED_SINGLE_TOURNAMENT;
  return INITIAL_TOURNAMENT;
}

function normalizeRankings(rows: HistoricalRanking[]): HistoricalRanking[] {
  if (rows.some((entry) => entry.ranking_type === "triennial")) return rows;
  return [
    ...rows.map((entry) => ({ ...entry, ranking_type: "global" as const })),
    ...INITIAL_TRIENNIAL_RANKING,
  ];
}

async function loadTournamentData(slug?: string): Promise<PublicTournamentData> {
  const client = isServerSupabaseConfigured()
    ? createServerSupabaseClient()
    : createPublicSupabaseClient();
  const fallbackTournament = fallbackTournamentForSlug(slug);
  if (!client) {
    return {
      tournament: fallbackTournament,
      teams: [],
      matches: [],
      settings: INITIAL_SETTINGS,
      historicalRanking: INITIAL_HISTORICAL_RANKING,
      overrides: [],
      connected: false,
    };
  }

  try {
    const tournamentQuery = client.from("tournaments").select("*");
    const tournamentResult = slug
      ? await tournamentQuery.eq("slug", slug).eq("is_archived", true).single()
      : await tournamentQuery.eq("is_active", true).single();
    if (tournamentResult.error || !tournamentResult.data) {
      throw new Error("Torneo non disponibile");
    }
    const tournament = tournamentResult.data as Tournament;
    const [teamsResult, matchesResult, settingsResult, rankingResult, overridesResult] = await Promise.all([
      client.from("teams").select("*").eq("tournament_id", tournament.id).order("display_order"),
      client.from("matches").select("*").eq("tournament_id", tournament.id).order("scheduled_at", { ascending: true, nullsFirst: false }),
      client.from("tournament_settings").select("*").eq("tournament_id", tournament.id).single(),
      client.from("historical_ranking").select("*").order("display_order"),
      isServerSupabaseConfigured()
        ? client.from("ranking_overrides").select("*").eq("tournament_id", tournament.id)
        : Promise.resolve({ data: [], error: null }),
    ]);
    if (
      teamsResult.error ||
      matchesResult.error ||
      settingsResult.error ||
      rankingResult.error ||
      overridesResult.error
    ) {
      throw new Error("Dati pubblici non disponibili");
    }
    return {
      tournament,
      teams: (teamsResult.data ?? []) as Team[],
      matches: (matchesResult.data ?? []) as Match[],
      settings: settingsResult.data as TournamentSettings,
      historicalRanking: normalizeRankings((rankingResult.data ?? []) as HistoricalRanking[]),
      overrides: (overridesResult.data ?? []) as RankingOverride[],
      connected: true,
    };
  } catch {
    return {
      tournament: fallbackTournament,
      teams: [],
      matches: [],
      settings: INITIAL_SETTINGS,
      historicalRanking: INITIAL_HISTORICAL_RANKING,
      overrides: [],
      connected: false,
    };
  }
}

export const loadPublicTournamentData = cache(async (): Promise<PublicTournamentData> =>
  loadTournamentData(),
);

export const loadArchivedTournamentData = cache(async (slug: string): Promise<PublicTournamentData> =>
  loadTournamentData(slug),
);

export const loadArchivedTournaments = cache(async (): Promise<Tournament[]> => {
  const client = isServerSupabaseConfigured()
    ? createServerSupabaseClient()
    : createPublicSupabaseClient();
  const fallback = [ARCHIVED_SINGLE_TOURNAMENT, ARCHIVED_DOUBLE_TOURNAMENT];
  if (!client) return fallback;
  const { data, error } = await client
    .from("tournaments")
    .select("*")
    .eq("is_archived", true)
    .order("archived_at", { ascending: false, nullsFirst: false });
  return error ? fallback : (data as Tournament[]);
});
