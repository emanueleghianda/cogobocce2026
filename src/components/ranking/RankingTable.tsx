import type { HistoricalRanking } from "@/types/tournament";

const medals = ["🥇", "🥈", "🥉"] as const;

export function RankingTable({ entries, label }: { entries: HistoricalRanking[]; label: string }) {
  return (
    <div className="table-scroll table-scroll--ranking" tabIndex={0} aria-label={label}>
      <table className="ranking-table">
        <thead><tr><th>Posizione</th><th>Partecipante</th><th>Punti</th></tr></thead>
        <tbody>
          {entries.map((entry) => {
            const podium = entry.rank_position <= 3 ? `podium-${entry.rank_position}` : "";
            return (
              <tr key={entry.id} className={podium}>
                <td aria-label={`${entry.rank_position}° posizione`}>
                  <span className="medal">
                    {entry.rank_position <= 3 ? <span aria-hidden="true">{medals[entry.rank_position - 1]}</span> : <span>{entry.rank_position}°</span>}
                  </span>
                </td>
                <th scope="row">{entry.participant_name}</th>
                <td>{entry.points} pt</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
