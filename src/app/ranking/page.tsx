import type { Metadata } from "next";
import { Medal } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { loadPublicTournamentData } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Ranking Ufficiale Bocce 2020–2025",
  description: "Classifica storica ufficiale precedente al Torneo di Bocce Doppio Cogoleto 2K26.",
};

export default async function RankingPage() {
  const { historicalRanking } = await loadPublicTournamentData();
  return (
    <>
      <PageHero eyebrow="Albo storico" title="Ranking Ufficiale Bocce 2020–2025" description="Classifica storica precedente al Torneo di Bocce Doppio Cogoleto 2K26" logo />
      <section className="section container">
        <div className="announcement"><Medal size={23} aria-hidden="true" /><p>Il ranking riporta i risultati ufficiali maturati nel periodo 2020–2025.</p></div>
      </section>
      <section className="section--tight container">
        <div className="table-scroll" tabIndex={0} aria-label="Ranking storico ufficiale 2020–2025">
          <table className="ranking-table">
            <thead><tr><th>Posizione</th><th>Partecipante</th><th>Punti</th></tr></thead>
            <tbody>{historicalRanking.map((entry) => {
              const podium = entry.rank_position <= 3 ? `podium-${entry.rank_position}` : "";
              const medal = entry.rank_position === 1 ? "🥇" : entry.rank_position === 2 ? "🥈" : entry.rank_position === 3 ? "🥉" : null;
              return <tr key={entry.id} className={podium}><td><span className="medal">{medal && <span aria-hidden="true">{medal}</span>}<span>{entry.rank_position}°{medal ? ` posto, medaglia ${entry.rank_position === 1 ? "d’oro" : entry.rank_position === 2 ? "d’argento" : "di bronzo"}` : ""}</span></span></td><th scope="row">{entry.participant_name}</th><td>{entry.points} pt</td></tr>;
            })}</tbody>
          </table>
        </div>
      </section>
    </>
  );
}
