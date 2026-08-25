import type { HistoricalRanking, Team, Tournament, TournamentSettings } from "@/types/tournament";

export const SINGLE_TOURNAMENT_ID = "50000000-0000-4000-8000-000000002026";
export const DOUBLE_TOURNAMENT_ID = "d0000000-0000-4000-8000-000000002026";
export const WAITING_TOURNAMENT_ID = "27000000-0000-4000-8000-000000002027";

export const INITIAL_TOURNAMENT: Tournament = {
  id: WAITING_TOURNAMENT_ID,
  slug: "aspettando-2k27",
  title: "ASPETTANDO IL TORNEO DI BOCCE 2K27",
  short_title: "Bocce Cogoleto 2K27",
  format: "double",
  season_label: "Prossimo appuntamento · Agosto 2027",
  logo_path: "/logo-attesa-2k27.png",
  is_active: true,
  is_archived: false,
  archived_at: null,
};

export const ARCHIVED_SINGLE_TOURNAMENT: Tournament = {
  id: SINGLE_TOURNAMENT_ID,
  slug: "singolo-2k26",
  title: "Torneo di Bocce Singolo Cogoleto 2K26",
  short_title: "Singolo 2K26",
  format: "single",
  season_label: "Cogoleto · Estate 2026",
  logo_path: "/logo-singolo-2k26.png",
  is_active: false,
  is_archived: true,
  archived_at: null,
};

export const ARCHIVED_DOUBLE_TOURNAMENT: Tournament = {
  id: DOUBLE_TOURNAMENT_ID,
  slug: "doppio-2k26",
  title: "Torneo di Bocce Doppio Cogoleto 2K26",
  short_title: "Doppio 2K26",
  format: "double",
  season_label: "Cogoleto · Estate 2026",
  logo_path: "/logo-doppio-2k26.png",
  is_active: false,
  is_archived: true,
  archived_at: null,
};

const globalRankingRows: Array<[number, string, number]> = [
  [1, "Cesare Ghianda", 58],
  [2, "Emanuele Ghianda", 50],
  [3, "Matteo Binda", 46],
  [4, "Luigi Ghianda", 40],
  [5, "Enzo Carena", 32],
  [6, "Marco Cantamessa", 26],
  [7, "Teresa Cantamessa", 20],
  [8, "Piera Ciccarelli", 16],
  [8, "Cristina", 16],
  [8, "Ilaria Bocelli", 16],
  [11, "Alessio Accetta", 14],
  [12, "Stefano Giannelli", 12],
  [13, "Katty Bussa", 10],
  [13, "Simone Imberti", 10],
  [13, "Luisa Cantamessa", 10],
  [13, "Barbara", 10],
  [17, "Andrea Binda", 8],
  [17, "Luigi Ciccarelli", 8],
  [19, "Marcello Sala", 6],
  [19, "Pierpaolo Scoccimarro", 6],
  [19, "Stefano Cracco", 6],
  [19, "Walter Cantamessa", 6],
  [19, "Davide Gaggino", 6],
  [19, "De Battistis", 6],
  [25, "Mary Gemme", 4],
  [25, "Susanna Grimaldi", 4],
  [25, "Luca Pulice", 4],
  [25, "Enzo Grimaldi", 4],
  [29, "Paolo Riva", 2],
  [29, "Edoardo Capurro", 2],
  [29, "Francesco Novarini", 2],
  [29, "Davide Novarini", 2],
  [29, "Elena Poretta", 2],
];

const triennialRankingRows: Array<[number, string, number]> = [
  [1, "Emanuele Ghianda", 28],
  [2, "Cesare Ghianda", 24],
  [2, "Luigi Ghianda", 24],
  [4, "Marco Cantamessa", 16],
  [5, "Matteo Binda", 14],
  [5, "Ilaria Bocelli", 14],
  [7, "Stefano Giannelli", 12],
  [8, "Teresa Cantamessa", 10],
  [8, "Simone Imberti", 10],
  [10, "Marcello Sala", 6],
  [10, "Pierpaolo Scoccimarro", 6],
  [10, "Luisa Cantamessa", 6],
  [13, "Stefano Cracco", 4],
  [13, "Mary Gemme", 4],
  [15, "Paolo Riva", 2],
  [15, "Edoardo Capurro", 2],
  [15, "Alessio Accetta", 2],
  [15, "Elena Poretta", 2],
];

export const INITIAL_GLOBAL_RANKING: HistoricalRanking[] = globalRankingRows.map(
  ([rank_position, participant_name, points], index) => ({
    id: `11000000-0000-4000-8000-${String(index + 1).padStart(12, "0")}`,
    ranking_period: "2020-2026",
    ranking_type: "global",
    rank_position,
    participant_name,
    points,
    display_order: index + 1,
  }),
);

export const INITIAL_TRIENNIAL_RANKING: HistoricalRanking[] = triennialRankingRows.map(
  ([rank_position, participant_name, points], index) => ({
    id: `12000000-0000-4000-8000-${String(index + 1).padStart(12, "0")}`,
    ranking_period: "2024-2026",
    ranking_type: "triennial",
    rank_position,
    participant_name,
    points,
    display_order: index + 1,
  }),
);

export const INITIAL_HISTORICAL_RANKING: HistoricalRanking[] = [
  ...INITIAL_GLOBAL_RANKING,
  ...INITIAL_TRIENNIAL_RANKING,
];

// Partecipanti di esempio usati anche dai test del tabellone.
export const INITIAL_TEAMS: Team[] = Array.from({ length: 16 }, (_, index) => ({
  id: `20000000-0000-4000-8000-${String(index + 1).padStart(12, "0")}`,
  tournament_id: SINGLE_TOURNAMENT_ID,
  name: `Giocatore ${index + 1}`,
  player_one: null,
  player_two: null,
  group_code: (["A", "B", "C", "D"] as const)[Math.floor(index / 4)],
  display_order: index + 1,
}));

export const INITIAL_SETTINGS: TournamentSettings = {
  id: 3,
  tournament_id: WAITING_TOURNAMENT_ID,
  tournament_status: "suspended",
  public_announcement:
    "Il Doppio e il Singolo torneranno ad agosto 2027.",
  group_matches_generated: false,
  finals_generated: false,
  last_public_update: null,
};

export const TOURNAMENT_STATUS_LABELS = {
  registrations: "Iscrizioni",
  groups_pending: "Gironi da definire",
  groups_live: "Gironi in corso",
  quarterfinals: "Quarti di finale",
  semifinals: "Semifinali",
  finals: "Finali",
  completed: "Torneo concluso",
  suspended: "Sospeso",
} as const;

export const MATCH_STATUS_LABELS = {
  scheduled: "Programmata",
  live: "In corso",
  completed: "Conclusa",
  postponed: "Rinviata",
  cancelled: "Annullata",
} as const;

export const STAGE_LABELS = {
  group: "Fase a gironi",
  quarterfinal: "Quarti",
  semifinal: "Semifinali",
  third_place_final: "Finale 3°/4°",
  championship_final: "Finale 1°/2°",
} as const;
