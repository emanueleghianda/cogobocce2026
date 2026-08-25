import type { Metadata } from "next";
import { Crown } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { TOURNAMENT_HONOURS } from "@/lib/honours";

export const metadata: Metadata = {
  title: "Albo d'oro",
  description: "Tutte le prime quattro posizioni dei Tornei di Bocce di Cogoleto dal 2020.",
};

export default function HallOfFamePage() {
  return (
    <>
      <PageHero eyebrow="Dal 2020 a oggi" title="ALBO D’ORO" description="Campioni, finalisti e protagonisti di ogni torneo Doppio e Singolo." logo logoSrc="/logo-attesa-2k27.png" logoAlt="Logo Torneo di Bocce Cogoleto" />
      <section className="section container honours-grid">
        {TOURNAMENT_HONOURS.map((tournament) => (
          <article className="honour-card" key={`${tournament.year}-${tournament.format}`}>
            <header><span>{tournament.year}</span><strong>{tournament.format}</strong></header>
            <ol>
              {tournament.topFour.map((name, index) => (
                <li key={name}><span aria-hidden="true">{["🥇", "🥈", "🥉", "4°"][index]}</span><strong>{name}</strong></li>
              ))}
            </ol>
            {tournament.year === 2026 && <Crown className="honour-card__mark" aria-hidden="true" />}
          </article>
        ))}
      </section>
    </>
  );
}
