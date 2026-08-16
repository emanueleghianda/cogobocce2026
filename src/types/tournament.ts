export const GROUP_CODES = ["A", "B", "C", "D"] as const;
export const MATCH_STAGES = [
  "group",
  "quarterfinal",
  "semifinal",
  "third_place_final",
  "championship_final",
] as const;
export const MATCH_STATUSES = [
  "scheduled",
  "live",
  "completed",
  "postponed",
  "cancelled",
] as const;
export const BRACKET_SLOTS = ["QF1", "QF2", "QF3", "QF4", "SF1", "SF2", "F3", "F1"] as const;

export type GroupCode = (typeof GROUP_CODES)[number];
export type MatchStage = (typeof MATCH_STAGES)[number];
export type MatchStatus = (typeof MATCH_STATUSES)[number];
export type BracketSlot = (typeof BRACKET_SLOTS)[number];

export type TournamentFormat = "double" | "single";

export type Tournament = {
  id: string;
  slug: string;
  title: string;
  short_title: string;
  format: TournamentFormat;
  season_label: string;
  logo_path: string;
  is_active: boolean;
  is_archived: boolean;
  archived_at: string | null;
  created_at?: string;
  updated_at?: string;
};

export type Team = {
  id: string;
  tournament_id: string;
  name: string;
  player_one: string | null;
  player_two: string | null;
  group_code: GroupCode;
  display_order: number;
  created_at?: string;
  updated_at?: string;
};

export type Match = {
  id: string;
  tournament_id: string;
  stage: MatchStage;
  group_code: GroupCode | null;
  match_day: number | null;
  bracket_slot: BracketSlot | null;
  team_one_id: string | null;
  team_two_id: string | null;
  score_one: number | null;
  score_two: number | null;
  status: MatchStatus;
  scheduled_at: string | null;
  court: string | null;
  note: string | null;
  created_at?: string;
  updated_at?: string;
};

export type TournamentStatus =
  | "registrations"
  | "groups_pending"
  | "groups_live"
  | "quarterfinals"
  | "semifinals"
  | "finals"
  | "completed"
  | "suspended";

export type TournamentSettings = {
  id: number;
  tournament_id: string;
  tournament_status: TournamentStatus;
  public_announcement: string | null;
  group_matches_generated: boolean;
  finals_generated: boolean;
  last_public_update: string | null;
  created_at?: string;
  updated_at?: string;
};

export type RankingOverride = {
  id?: string;
  tournament_id: string;
  group_code: GroupCode;
  team_id: string;
  manual_rank: number;
  reason: string | null;
  created_at?: string;
  updated_at?: string;
};

export type HistoricalRanking = {
  id: string;
  ranking_period: string;
  rank_position: number;
  participant_name: string;
  points: number;
  display_order: number;
  created_at?: string;
  updated_at?: string;
};

export type StandingRow = {
  rank: number;
  team: Team;
  played: number;
  wins: number;
  losses: number;
  pointsFor: number;
  pointsAgainst: number;
  difference: number;
  qualified: boolean;
  provisionalTie: boolean;
  manualOverride: boolean;
};

export type GroupStandings = {
  groupCode: GroupCode;
  rows: StandingRow[];
  completedMatches: number;
  isComplete: boolean;
  isProvisional: boolean;
  unresolvedTie: Team[];
};

export type PublicTournamentData = {
  tournament: Tournament;
  teams: Team[];
  matches: Match[];
  settings: TournamentSettings;
  historicalRanking: HistoricalRanking[];
  overrides: RankingOverride[];
  connected: boolean;
};
