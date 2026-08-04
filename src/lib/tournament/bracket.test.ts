import { describe, expect, it } from "vitest";
import { INITIAL_TEAMS } from "@/lib/constants";
import type { GroupStandings, Match } from "@/types/tournament";
import { generateFinalBracket, propagateBracketResults } from "./bracket";

function standing(groupCode: "A"|"B"|"C"|"D", offset:number): GroupStandings {
  const teams=INITIAL_TEAMS.slice(offset,offset+4);
  return { groupCode, completedMatches:6, isComplete:true, isProvisional:false, unresolvedTie:[], rows:teams.map((team,index)=>({rank:index+1,team,played:3,wins:3-index,losses:index,pointsFor:30,pointsAgainst:10,difference:20,qualified:index<2,provisionalTie:false,manualOverride:false})) };
}

describe("tabellone",()=>{
  it("crea i quarti nell’ordine A1-B2, C1-D2, B1-A2, D1-C2",()=>{
    const bracket=generateFinalBracket([standing("A",0),standing("B",4),standing("C",8),standing("D",12)]);
    expect(bracket.slice(0,4).map(match=>[match.bracket_slot,match.team_one_id,match.team_two_id])).toEqual([
      ["QF1",INITIAL_TEAMS[0].id,INITIAL_TEAMS[5].id], ["QF2",INITIAL_TEAMS[8].id,INITIAL_TEAMS[13].id],
      ["QF3",INITIAL_TEAMS[4].id,INITIAL_TEAMS[1].id], ["QF4",INITIAL_TEAMS[12].id,INITIAL_TEAMS[9].id],
    ]);
  });

  it("propaga vincitori dei quarti e vincitori/perdenti delle semifinali",()=>{
    const base=generateFinalBracket([standing("A",0),standing("B",4),standing("C",8),standing("D",12)]).map((match,index)=>({id:String(index),...match})) as Match[];
    const qf=base.map(match=>match.bracket_slot==="QF1"||match.bracket_slot==="QF2"?{...match,status:"completed" as const,score_one:12,score_two:4}:match);
    const afterQf=propagateBracketResults(qf);
    expect(afterQf.find(match=>match.bracket_slot==="SF1")?.team_one_id).toBe(INITIAL_TEAMS[0].id);
    const withSf=afterQf.map(match=>match.bracket_slot==="SF1"?{...match,status:"completed" as const,score_one:7,score_two:12}:match);
    const afterSf=propagateBracketResults(withSf);
    expect(afterSf.find(match=>match.bracket_slot==="F1")?.team_one_id).toBe(INITIAL_TEAMS[8].id);
    expect(afterSf.find(match=>match.bracket_slot==="F3")?.team_one_id).toBe(INITIAL_TEAMS[0].id);
  });
});
