import type { MatchStage, MatchStatus } from "@/types/tournament";

export type ScoreValidation = { valid: true } | { valid: false; message: string };

export function targetScoreForStage(stage: MatchStage): 10 | 12 {
  return stage === "group" ? 10 : 12;
}

export function validateMatchScore(
  stage: MatchStage,
  status: MatchStatus,
  scoreOne: number | null,
  scoreTwo: number | null,
): ScoreValidation {
  const target = targetScoreForStage(stage);
  const phaseLabel = stage === "group" ? "Una partita dei gironi" : "Una partita della fase finale";

  for (const score of [scoreOne, scoreTwo]) {
    if (score !== null && (!Number.isInteger(score) || score < 0)) {
      return { valid: false, message: "I punteggi devono essere numeri interi non negativi." };
    }
    if (score !== null && score > target) {
      return { valid: false, message: `I punteggi non possono superare ${target}.` };
    }
  }

  if (scoreOne === null || scoreTwo === null) {
    if (status === "completed" || status === "live") {
      return { valid: false, message: `${phaseLabel} deve avere entrambi i punteggi.` };
    }
    return { valid: true };
  }

  if (status !== "completed") return { valid: true };

  const oneWins = scoreOne === target && scoreTwo < target;
  const twoWins = scoreTwo === target && scoreOne < target;
  if (!oneWins && !twoWins) {
    return {
      valid: false,
      message: `${phaseLabel} può essere conclusa solo con una coppia a ${target} punti e l’altra tra 0 e ${target - 1}.`,
    };
  }
  return { valid: true };
}

export function getWinnerAndLoser(match: {
  status: MatchStatus;
  team_one_id: string | null;
  team_two_id: string | null;
  score_one: number | null;
  score_two: number | null;
}): { winnerId: string; loserId: string } | null {
  if (
    match.status !== "completed" ||
    !match.team_one_id ||
    !match.team_two_id ||
    match.score_one === null ||
    match.score_two === null ||
    match.score_one === match.score_two
  ) {
    return null;
  }
  return match.score_one > match.score_two
    ? { winnerId: match.team_one_id, loserId: match.team_two_id }
    : { winnerId: match.team_two_id, loserId: match.team_one_id };
}
