import "server-only";
import { cache } from "react";
import {
  INITIAL_HISTORICAL_RANKING,
  INITIAL_SETTINGS,
  INITIAL_TEAMS,
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
  TournamentSettings,
} from "@/types/tournament";

export const loadPublicTournamentData = cache(async (): Promise<PublicTournamentData> => {
  const client = isServerSupabaseConfigured()
    ? createServerSupabaseClient()
    : createPublicSupabaseClient();
  if (!client) {
    return {
      teams: INITIAL_TEAMS,
      matches: [],
      settings: INITIAL_SETTINGS,
      historicalRanking: INITIAL_HISTORICAL_RANKING,
      overrides: [],
      connected: false,
    };
  }

  try {
    const [teamsResult, matchesResult, settingsResult, rankingResult, overridesResult] = await Promise.all([
      client.from("teams").select("*").order("display_order"),
      client.from("matches").select("*").order("scheduled_at", { ascending: true, nullsFirst: false }),
      client.from("tournament_settings").select("*").eq("id", 1).single(),
      client.from("historical_ranking").select("*").order("display_order"),
      isServerSupabaseConfigured()
        ? client.from("ranking_overrides").select("*")
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
      teams: (teamsResult.data ?? []) as Team[],
      matches: (matchesResult.data ?? []) as Match[],
      settings: settingsResult.data as TournamentSettings,
      historicalRanking: (rankingResult.data ?? []) as HistoricalRanking[],
      overrides: (overridesResult.data ?? []) as RankingOverride[],
      connected: true,
    };
  } catch {
    return {
      teams: INITIAL_TEAMS,
      matches: [],
      settings: INITIAL_SETTINGS,
      historicalRanking: INITIAL_HISTORICAL_RANKING,
      overrides: [],
      connected: false,
    };
  }
});
