import type { HistoricalRanking, Team, TournamentSettings } from "@/types/tournament";

const officialRankingRows: Array<[number, string, number]> = [
  [1, "Cesare Ghianda", 48],
  [2, "Matteo Binda", 46],
  [3, "Luigi Ghianda", 36],
  [4, "Emanuele Ghianda", 34],
  [5, "Enzo Carena", 32],
  [6, "Marco", 16],
  [6, "Piera Ciccarelli", 16],
  [6, "Cristina", 16],
  [6, "Ilaria", 16],
  [10, "Alessio", 14],
  [11, "Stefano Giannelli", 10],
  [11, "Simone Imberti", 10],
  [11, "Luisa", 10],
  [11, "Teresa", 10],
  [11, "Barbara", 10],
  [16, "Andrea Binda", 8],
  [16, "Luigi Ciccarelli", 8],
  [18, "Pierpaolo Scoccimarro", 6],
  [18, "Stefano Cracco", 6],
  [18, "Walter", 6],
  [18, "Davide Gaggino", 6],
  [18, "De Battistis", 6],
  [18, "Ketty", 6],
  [24, "Susanna", 4],
  [24, "Luca Pulice", 4],
  [24, "Enzo", 4],
  [27, "Edoardo Capurro", 2],
  [27, "Francesco Novarini", 2],
  [27, "Davide Novarini", 2],
  [27, "Elena", 2],
];

export const INITIAL_HISTORICAL_RANKING: HistoricalRanking[] = officialRankingRows.map(
  ([rank_position, participant_name, points], index) => ({
    id: `10000000-0000-4000-8000-${String(index + 1).padStart(12, "0")}`,
    ranking_period: "2020-2025",
    rank_position,
    participant_name,
    points,
    display_order: index + 1,
  }),
);

export const INITIAL_TEAMS: Team[] = Array.from({ length: 16 }, (_, index) => ({
  id: `00000000-0000-4000-8000-${String(index + 1).padStart(12, "0")}`,
  name: `Coppia ${index + 1}`,
  player_one: "",
  player_two: "",
  group_code: (["A", "B", "C", "D"] as const)[Math.floor(index / 4)],
  display_order: index + 1,
}));

export const INITIAL_SETTINGS: TournamentSettings = {
  id: 1,
  tournament_status: "registrations",
  public_announcement:
    "Le iscrizioni e la composizione dei gironi saranno aggiornate dall’organizzazione.",
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
