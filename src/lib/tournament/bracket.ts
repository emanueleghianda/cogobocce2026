import type { BracketSlot, GroupStandings, Match, Team } from "@/types/tournament";
import type { NewMatch } from "./groups";
import { getWinnerAndLoser } from "./score";

const emptyFinalMatch = (
  stage: NewMatch["stage"],
  bracketSlot: BracketSlot,
  teamOneId: string | null = null,
  teamTwoId: string | null = null,
): NewMatch => ({
  stage,
  group_code: null,
  match_day: null,
  bracket_slot: bracketSlot,
  team_one_id: teamOneId,
  team_two_id: teamTwoId,
  score_one: null,
  score_two: null,
  status: "scheduled",
  scheduled_at: null,
  court: null,
  note: null,
});

export function generateFinalBracket(standings: GroupStandings[]): NewMatch[] {
  const byGroup = new Map(standings.map((standing) => [standing.groupCode, standing]));
  const pick = (group: "A" | "B" | "C" | "D", rank: 1 | 2): string => {
    const standing = byGroup.get(group);
    if (!standing?.isComplete || standing.isProvisional || standing.unresolvedTie.length > 0) {
      throw new Error(`La classifica del Girone ${group} non è definitiva.`);
    }
    const row = standing.rows[rank - 1];
    if (!row) throw new Error(`Manca la ${rank}ª classificata del Girone ${group}.`);
    return row.team.id;
  };

  return [
    emptyFinalMatch("quarterfinal", "QF1", pick("A", 1), pick("B", 2)),
    emptyFinalMatch("quarterfinal", "QF2", pick("C", 1), pick("D", 2)),
    emptyFinalMatch("quarterfinal", "QF3", pick("B", 1), pick("A", 2)),
    emptyFinalMatch("quarterfinal", "QF4", pick("D", 1), pick("C", 2)),
    emptyFinalMatch("semifinal", "SF1"),
    emptyFinalMatch("semifinal", "SF2"),
    emptyFinalMatch("third_place_final", "F3"),
    emptyFinalMatch("championship_final", "F1"),
  ];
}

type MutableMatch = Match & { participantChanged?: boolean };

export function propagateBracketResults(matches: Match[]): MutableMatch[] {
  const output: MutableMatch[] = matches.map((match) => ({ ...match }));
  const bySlot = new Map(output.filter((match) => match.bracket_slot).map((match) => [match.bracket_slot!, match]));

  const setParticipant = (slot: BracketSlot, side: "one" | "two", teamId: string | null) => {
    const target = bySlot.get(slot);
    if (!target) return;
    const key = side === "one" ? "team_one_id" : "team_two_id";
    if (target[key] !== teamId) {
      target[key] = teamId;
      target.score_one = null;
      target.score_two = null;
      target.status = "scheduled";
      target.participantChanged = true;
    }
  };

  const qfMappings: Array<[BracketSlot, BracketSlot, "one" | "two"]> = [
    ["QF1", "SF1", "one"],
    ["QF2", "SF1", "two"],
    ["QF3", "SF2", "one"],
    ["QF4", "SF2", "two"],
  ];
  for (const [source, target, side] of qfMappings) {
    const result = bySlot.get(source) ? getWinnerAndLoser(bySlot.get(source)!) : null;
    setParticipant(target, side, result?.winnerId ?? null);
  }

  const sfMappings: Array<[BracketSlot, "one" | "two"]> = [
    ["SF1", "one"],
    ["SF2", "two"],
  ];
  for (const [source, side] of sfMappings) {
    const result = bySlot.get(source) ? getWinnerAndLoser(bySlot.get(source)!) : null;
    setParticipant("F1", side, result?.winnerId ?? null);
    setParticipant("F3", side, result?.loserId ?? null);
  }

  return output;
}

export function determineFinalRanking(matches: Match[], teams: Team[]): Team[] {
  const bySlot = new Map(matches.filter((match) => match.bracket_slot).map((match) => [match.bracket_slot!, match]));
  const championship = bySlot.get("F1");
  const thirdPlace = bySlot.get("F3");
  if (!championship || !thirdPlace) return [];
  const firstTwo = getWinnerAndLoser(championship);
  const thirdFour = getWinnerAndLoser(thirdPlace);
  if (!firstTwo || !thirdFour) return [];
  const byId = new Map(teams.map((team) => [team.id, team]));
  return [firstTwo.winnerId, firstTwo.loserId, thirdFour.winnerId, thirdFour.loserId]
    .map((id) => byId.get(id))
    .filter((team): team is Team => Boolean(team));
}
