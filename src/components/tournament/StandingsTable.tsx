import { CheckCircle2, TriangleAlert } from "lucide-react";
import { formatDifference } from "@/lib/tournament/groups";
import type { GroupStandings } from "@/types/tournament";

export function StandingsTable({ standings }: { standings: GroupStandings }) {
  return (
    <div className="standings-wrap">
      {(standings.isProvisional || standings.unresolvedTie.length > 0) && (
        <div className="tie-alert" role="status">
          <TriangleAlert size={18} aria-hidden="true" />
          {standings.unresolvedTie.length > 0 ? "Parità da risolvere" : "Classifica provvisoria"}
        </div>
      )}
      <div className="table-scroll" tabIndex={0} aria-label={`Classifica Girone ${standings.groupCode}`}>
        <table className="standings-table">
          <thead><tr><th>Pos.</th><th>Coppia</th><th>PG</th><th>V</th><th>S</th><th>PF</th><th>PS</th><th>Diff.</th><th>Stato</th></tr></thead>
          <tbody>
            {standings.rows.map((row) => (
              <tr key={row.team.id} className={row.qualified ? "is-qualified" : ""}>
                <td>{row.rank}ª</td>
                <th scope="row">{row.team.name}</th>
                <td>{row.played}</td><td>{row.wins}</td><td>{row.losses}</td>
                <td>{row.pointsFor}</td><td>{row.pointsAgainst}</td>
                <td className={row.difference >= 0 ? "positive" : "negative"}>{formatDifference(row.difference)}</td>
                <td>{row.qualified ? <span className="qualified-label"><CheckCircle2 size={15} aria-hidden="true" /> Qualificata</span> : row.provisionalTie ? "Pari merito" : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
