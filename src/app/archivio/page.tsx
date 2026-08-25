import type { Metadata } from "next";
import Link from "next/link";
import { Archive, ArrowRight } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { PageHero } from "@/components/shared/PageHero";
import { loadArchivedTournaments } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Archivio tornei",
  description: "Consulta le edizioni concluse del Torneo di Bocce di Cogoleto.",
};

export default async function ArchivePage() {
  const tournaments = await loadArchivedTournaments();
  return (
    <>
      <PageHero eyebrow="La storia del torneo" title="Archivio tornei" description="Ogni edizione conclusa resta consultabile con partecipanti, gironi, partite, punteggi e fase finale." />
      <section className="section container">
        <div className="archive-grid">
          {tournaments.map((tournament) => (
            <article className="archive-card" key={tournament.id}>
              <Logo src={tournament.logo_path} alt={`Logo ${tournament.title}`} />
              <div>
                <p className="eyebrow"><Archive size={15} aria-hidden="true" /> Torneo concluso</p>
                <h2>{tournament.short_title}</h2>
                <p>{tournament.format === "double" ? "Coppie" : "Giocatori"}, gironi, tutte le partite, tutti i risultati e il podio finale.</p>
                <Link className="button button--navy" href={`/archivio/${tournament.slug}`}>
                  Apri l&apos;archivio <ArrowRight size={18} aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
