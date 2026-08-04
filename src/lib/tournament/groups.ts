import type {
  GroupCode,
  GroupStandings,
  Match,
  RankingOverride,
  StandingRow,
  Team,
} from "@/types/tournament";
import { GROUP_CODES } from "@/types/tournament";
import { getWinnerAndLoser } from "./score";

export type NewMatch = Omit<Match, "id" | "created_at" | "updated_at">;

const roundRobinPairs = [
  [[0, 3], [1, 2]],
  [[0, 2], [3, 1]],
  [[0, 1], [2, 3]],
] as const;

export function generateGroupMatches(teams: Team[]): NewMatch[] {
  const matches: NewMatch[] = [];
  for (const groupCode of GROUP_CODES) {
    const groupTeams = teams
      .filter((team) => team.group_code === groupCode)
      .sort((a, b) => a.display_order - b.display_order);
    if (groupTeams.length !== 4) {
      throw new Error(
        `Il Girone ${groupCode} contiene ${groupTeams.length} coppie. Ogni girone deve contenere esattamente 4 coppie.`,
      );
    }
    roundRobinPairs.forEach((pairs, dayIndex) => {
      pairs.forEach(([one, two]) => {
        matches.push({
          stage: "group",
          group_code: groupCode,
          match_day: dayIndex + 1,
          bracket_slot: null,
          team_one_id: groupTeams[one].id,
          team_two_id: groupTeams[two].id,
          score_one: null,
          score_two: null,
          status: "scheduled",
          scheduled_at: null,
          court: null,
          note: null,
        });
      });
    });
  }
  return matches;
}

export function findHeadToHead(matches: Match[], teamOneId: string, teamTwoId: string): Match | null {
  return (
    matches.find(
      (match) =>
        match.status === "completed" &&
        ((match.team_one_id === teamOneId && match.team_two_id === teamTwoId) ||
          (match.team_one_id === teamTwoId && match.team_two_id === teamOneId)),
    ) ?? null
  );
}

export function calculateGroupStandings(
  groupCode: GroupCode,
  teams: Team[],
  matches: Match[],
  overrides: RankingOverride[] = [],
): GroupStandings {
  const groupTeams = teams
    .filter((team) => team.group_code === groupCode)
    .sort((a, b) => a.display_order - b.display_order);
  const groupMatches = matches.filter((match) => match.stage === "group" && match.group_code === groupCode);
  const completed = groupMatches.filter(
    (match) =>
      match.status === "completed" && match.score_one !== null && match.score_two !== null,
  );
  const stats = new Map<string, Omit<StandingRow, "rank" | "qualified" | "provisionalTie" | "manualOverride">>();

  groupTeams.forEach((team) =>
    stats.set(team.id, {
      team,
      played: 0,
      wins: 0,
      losses: 0,
      pointsFor: 0,
      pointsAgainst: 0,
      difference: 0,
    }),
  );

  for (const match of completed) {
    if (!match.team_one_id || !match.team_two_id || match.score_one === null || match.score_two === null) continue;
    const one = stats.get(match.team_one_id);
    const two = stats.get(match.team_two_id);
    if (!one || !two) continue;
    one.played += 1;
    two.played += 1;
    one.pointsFor += match.score_one;
    one.pointsAgainst += match.score_two;
    two.pointsFor += match.score_two;
    two.pointsAgainst += match.score_one;
    if (match.score_one > match.score_two) {
      one.wins += 1;
      two.losses += 1;
    } else {
      two.wins += 1;
      one.losses += 1;
    }
  }

  const rows = [...stats.values()];
  rows.forEach((row) => {
    row.difference = row.pointsFor - row.pointsAgainst;
  });
  rows.sort(
    (a, b) =>
      b.wins - a.wins ||
      b.difference - a.difference ||
      a.team.display_order - b.team.display_order,
  );

  const provisionalTeams = new Set<string>();
  const manualTeams = new Set<string>();
  const unresolvedTie: Team[] = [];

  let cursor = 0;
  while (cursor < rows.length) {
    let end = cursor + 1;
    while (
      end < rows.length &&
      rows[end].wins === rows[cursor].wins &&
      rows[end].difference === rows[cursor].difference
    ) {
      end += 1;
    }
    const tied = rows.slice(cursor, end);
    if (tied.length === 2) {
      const headToHead = findHeadToHead(completed, tied[0].team.id, tied[1].team.id);
      const result = headToHead ? getWinnerAndLoser(headToHead) : null;
      if (result && tied[1].team.id === result.winnerId) {
        [rows[cursor], rows[cursor + 1]] = [rows[cursor + 1], rows[cursor]];
      } else if (!result) {
        tied.forEach((row) => provisionalTeams.add(row.team.id));
      }
    } else if (tied.length >= 3) {
      const tiedIds = new Set(tied.map((row) => row.team.id));
      const relevantOverrides = overrides.filter(
        (item) => item.group_code === groupCode && tiedIds.has(item.team_id),
      );
      const hasCompleteOverride =
        relevantOverrides.length === tied.length &&
        new Set(relevantOverrides.map((item) => item.manual_rank)).size === tied.length;
      if (hasCompleteOverride) {
        const rankByTeam = new Map(relevantOverrides.map((item) => [item.team_id, item.manual_rank]));
        rows.splice(
          cursor,
          tied.length,
          ...tied.sort(
            (a, b) => (rankByTeam.get(a.team.id) ?? 999) - (rankByTeam.get(b.team.id) ?? 999),
          ),
        );
        tied.forEach((row) => manualTeams.add(row.team.id));
      } else {
        unresolvedTie.push(...tied.map((row) => row.team));
      }
    }
    cursor = end;
  }

  const isComplete = groupMatches.length === 6 && completed.length === 6;
  const isProvisional = provisionalTeams.size > 0;
  return {
    groupCode,
    completedMatches: completed.length,
    isComplete,
    isProvisional,
    unresolvedTie,
    rows: rows.map((row, index) => ({
      ...row,
      rank: index + 1,
      qualified: isComplete && unresolvedTie.length === 0 && !isProvisional && index < 2,
      provisionalTie: provisionalTeams.has(row.team.id),
      manualOverride: manualTeams.has(row.team.id),
    })),
  };
}

export function calculateAllStandings(
  teams: Team[],
  matches: Match[],
  overrides: RankingOverride[] = [],
): GroupStandings[] {
  return GROUP_CODES.map((groupCode) => calculateGroupStandings(groupCode, teams, matches, overrides));
}

export function formatDifference(value: number): string {
  if (value > 0) return `+${value}`;
  if (value < 0) return `−${Math.abs(value)}`;
  return "0";
}
