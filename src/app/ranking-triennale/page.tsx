import type { Metadata } from "next";
import { Trophy } from "lucide-react";
import { RankingTable } from "@/components/ranking/RankingTable";
import { PageHero } from "@/components/shared/PageHero";
import { loadPublicTournamentData } from "@/lib/data";
import { selectRanking } from "@/lib/ranking";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Ranking Triennale",
  description: "Ranking triennale ufficiale dei Tornei di Bocce di Cogoleto.",
};

export default async function TriennialRankingPage() {
  const data = await loadPublicTournamentData();
  const ranking = selectRanking(data.historicalRanking, "triennial");
  return (
    <>
      <PageHero eyebrow="Classifica ufficiale" title="RANKING TRIENNALE" description="I risultati ottenuti negli ultimi tre anni di tornei." logo logoSrc="/logo-attesa-2k27.png" logoAlt="Logo Torneo di Bocce Cogoleto" />
      <section className="section container">
        <div className="announcement announcement--ranking">
          <Trophy size={23} aria-hidden="true" />
          <div className="announcement__copy">
            <p>Il Ranking Triennale valorizza la continuità dei risultati più recenti e considera gli ultimi tre anni di torneo.</p>
            <p>Dopo ogni torneo (doppio o singolo) i punti vengono così distribuiti: 10 punti al primo, 6 punti al secondo, 4 punti al terzo, 2 punti al quarto.</p>
          </div>
        </div>
      </section>
      <section className="section--tight container">
        <RankingTable entries={ranking} label="Ranking Triennale" />
      </section>
    </>
  );
}
