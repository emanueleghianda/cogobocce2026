import type { HistoricalRanking } from "@/types/tournament";

export function selectRanking(
  entries: HistoricalRanking[],
  type: "global" | "triennial",
): HistoricalRanking[] {
  return entries
    .filter((entry) => (entry.ranking_type ?? "global") === type)
    .sort((a, b) => a.display_order - b.display_order);
}
