import { describe, expect, it } from "vitest";
import { INITIAL_TEAMS } from "@/lib/constants";
import type { Match } from "@/types/tournament";
import { calculateGroupStandings, generateGroupMatches, getExpectedGroupMatchCount } from "./groups";

function completed(id: string, one: string, two: string, scoreOne: number, scoreTwo: number): Match {
  return { id, stage: "group", group_code: "A", match_day: 1, bracket_slot: null, team_one_id: one, team_two_id: two, score_one: scoreOne, score_two: scoreTwo, status: "completed", scheduled_at: null, court: null, note: null };
}

describe("gironi", () => {
  it("genera esattamente 24 partite, sei per girone e due per giornata", () => {
    const matches = generateGroupMatches(INITIAL_TEAMS);
    expect(matches).toHaveLength(24);
    for (const group of ["A", "B", "C", "D"]) {
      expect(matches.filter((match) => match.group_code === group)).toHaveLength(6);
      for (const day of [1, 2, 3]) expect(matches.filter((match) => match.group_code === group && match.match_day === day)).toHaveLength(2);
    }
  });

  it("rispetta lo schema 1-4, 2-3 nella prima giornata", () => {
    const firstDay = generateGroupMatches(INITIAL_TEAMS).filter((match) => match.group_code === "A" && match.match_day === 1);
    expect(firstDay.map((match) => [match.team_one_id, match.team_two_id])).toEqual([
      [INITIAL_TEAMS[0].id, INITIAL_TEAMS[3].id], [INITIAL_TEAMS[1].id, INITIAL_TEAMS[2].id],
    ]);
  });

  it("genera correttamente gli incontri quando un girone contiene tre coppie", () => {
    const fifteenTeams = INITIAL_TEAMS.slice(0, 15);
    const matches = generateGroupMatches(fifteenTeams);

    expect(getExpectedGroupMatchCount(fifteenTeams)).toBe(21);
    expect(matches).toHaveLength(21);
    expect(matches.filter((match) => match.group_code === "D")).toHaveLength(3);
    expect(new Set(matches.filter((match) => match.group_code === "D").flatMap((match) => [match.team_one_id, match.team_two_id]))).toEqual(
      new Set(fifteenTeams.filter((team) => team.group_code === "D").map((team) => team.id)),
    );
  });

  it("usa lo scontro diretto per due coppie con vittorie e differenza uguali", () => {
    const [a,b,c,d] = INITIAL_TEAMS.slice(0,4);
    const standings = calculateGroupStandings("A", [a,b,c,d], [
      completed("1", a.id, b.id, 10, 5),
      completed("2", c.id, a.id, 10, 5),
      completed("3", b.id, d.id, 10, 5),
    ]);
    expect(standings.rows.findIndex((row) => row.team.id === a.id)).toBeLessThan(standings.rows.findIndex((row) => row.team.id === b.id));
  });

  it("segnala una parità tra tre coppie senza inventare altri criteri", () => {
    const [a,b,c,d] = INITIAL_TEAMS.slice(0,4);
    const standings = calculateGroupStandings("A", [a,b,c,d], [
      completed("1", a.id, b.id, 10, 0), completed("2", b.id, c.id, 10, 0), completed("3", c.id, a.id, 10, 0),
    ]);
    expect(standings.unresolvedTie.map((team) => team.id).sort()).toEqual([a.id,b.id,c.id].sort());
  });
});
