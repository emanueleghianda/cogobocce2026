import type { Metadata } from "next";
import { Medal } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { loadPublicTournamentData } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Ranking Ufficiale Bocce Anni '20",
  description: "Classifica ufficiale di bocce degli anni '20 precedente al Torneo di Bocce Doppio Cogoleto 2K26.",
};

export default async function RankingPage() {
  const { historicalRanking } = await loadPublicTournamentData();
  return (
    <>
      <PageHero eyebrow="Albo storico" title="RANKING UFFICIALE BOCCE ANNI '20" description="Classifica ufficiale precedente al Torneo di Bocce Doppio Cogoleto 2K26" logo />
      <section className="section container">
        <div className="announcement announcement--ranking">
          <Medal size={23} aria-hidden="true" />
          <div className="announcement__copy">
            <p>Il ranking riporta i risultati ufficiali maturati nei tornei a partire dall&apos;estate 2020.</p>
            <p>Dopo ogni torneo (doppio o singolo) i punti vengono così distribuiti: 10 punti al primo, 6 punti al secondo, 4 punti al terzo, 2 punti al quarto.</p>
          </div>
        </div>
      </section>
      <section className="section--tight container">
        <div className="table-scroll table-scroll--ranking" tabIndex={0} aria-label="Ranking ufficiale bocce anni '20">
          <table className="ranking-table">
            <thead><tr><th>Posizione</th><th>Partecipante</th><th>Punti</th></tr></thead>
            <tbody>{historicalRanking.map((entry) => {
              const podium = entry.rank_position <= 3 ? `podium-${entry.rank_position}` : "";
              const medal = entry.rank_position === 1 ? "🥇" : entry.rank_position === 2 ? "🥈" : entry.rank_position === 3 ? "🥉" : null;
              return <tr key={entry.id} className={podium}><td aria-label={`${entry.rank_position}° posizione`}><span className="medal">{medal ? <span aria-hidden="true">{medal}</span> : <span>{entry.rank_position}°</span>}</span></td><th scope="row">{entry.participant_name}</th><td>{entry.points} pt</td></tr>;
            })}</tbody>
          </table>
        </div>
      </section>
    </>
  );
}
