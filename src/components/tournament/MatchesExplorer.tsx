"use client";

import { useMemo, useState } from "react";
import { MatchCard } from "@/components/tournament/MatchCard";
import type { Match, Team } from "@/types/tournament";

const filters = [
  ["all", "Tutte"], ["scheduled", "Programmate"], ["live", "In corso"], ["completed", "Concluse"],
  ["A", "Girone A"], ["B", "Girone B"], ["C", "Girone C"], ["D", "Girone D"],
  ["quarterfinal", "Quarti"], ["semifinal", "Semifinali"],
  ["third_place_final", "Finale 3°/4°"], ["championship_final", "Finale 1°/2°"],
] as const;

export function MatchesExplorer({ matches, teams, initial = "all" }: { matches: Match[]; teams: Team[]; initial?: string }) {
  const [filter, setFilter] = useState(initial);
  const visible = useMemo(() => matches.filter((match) => {
    if (filter === "all") return true;
    if (["A","B","C","D"].includes(filter)) return match.group_code === filter;
    if (["scheduled","live","completed"].includes(filter)) return match.status === filter;
    return match.stage === filter;
  }), [filter, matches]);
  return (
    <>
      <div className="filter-bar" role="group" aria-label="Filtra le partite">
        {filters.map(([value,label]) => <button key={value} type="button" className={`filter-chip ${filter === value ? "is-active" : ""}`} aria-pressed={filter === value} onClick={() => setFilter(value)}>{label}</button>)}
      </div>
      <p className="sr-only" aria-live="polite">{visible.length} partite visibili</p>
      {visible.length ? <div className="match-grid">{visible.map((match) => <MatchCard key={match.id} match={match} teams={teams} />)}</div> : <div className="empty-state">Nessuna partita corrisponde al filtro selezionato.</div>}
    </>
  );
}
