import { describe, expect, it } from "vitest";
import { getWinnerAndLoser, targetScoreForStage, validateMatchScore } from "./score";

describe("validazione punteggi", () => {
  it("usa 10 fino alle semifinali e 12 nelle due finali", () => {
    expect(targetScoreForStage("group")).toBe(10);
    expect(targetScoreForStage("quarterfinal")).toBe(10);
    expect(targetScoreForStage("semifinal")).toBe(10);
    expect(targetScoreForStage("third_place_final")).toBe(12);
    expect(targetScoreForStage("championship_final")).toBe(12);
  });

  it.each([[10, 0], [10, 9], [7, 10]])("accetta un risultato valido dei gironi: %s-%s", (one, two) => {
    expect(validateMatchScore("group", "completed", one, two).valid).toBe(true);
  });

  it.each([[9, 7], [10, 10], [11, 5], [8, 8], [-1, 10]])("rifiuta un risultato non valido dei gironi: %s-%s", (one, two) => {
    expect(validateMatchScore("group", "completed", one, two).valid).toBe(false);
  });

  it.each([[10, 0], [10, 9], [8, 10]])("accetta un risultato valido di quarti e semifinali: %s-%s", (one, two) => {
    expect(validateMatchScore("semifinal", "completed", one, two).valid).toBe(true);
  });

  it.each([[12, 0], [12, 11], [8, 12]])("accetta un risultato valido delle finali: %s-%s", (one, two) => {
    expect(validateMatchScore("championship_final", "completed", one, two).valid).toBe(true);
  });

  it("consente punteggi parziali entro il limite", () => {
    expect(validateMatchScore("group", "live", 9, 9).valid).toBe(true);
    expect(validateMatchScore("championship_final", "live", 12, 11).valid).toBe(true);
  });

  it("rifiuta anche un solo punteggio oltre il limite", () => {
    expect(validateMatchScore("group", "scheduled", 11, null).valid).toBe(false);
    expect(validateMatchScore("semifinal", "postponed", null, 11).valid).toBe(false);
  });

  it("trova vincitore e perdente solo a partita conclusa", () => {
    expect(getWinnerAndLoser({ status: "completed", team_one_id: "a", team_two_id: "b", score_one: 12, score_two: 6 })).toEqual({ winnerId: "a", loserId: "b" });
    expect(getWinnerAndLoser({ status: "live", team_one_id: "a", team_two_id: "b", score_one: 8, score_two: 6 })).toBeNull();
  });
});
