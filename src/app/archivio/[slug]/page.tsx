import Link from "next/link";
import { CalendarDays, ListChecks, Trophy } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { MatchCard } from "@/components/tournament/MatchCard";
import { loadArchivedTournamentData } from "@/lib/data";
import { determineFinalRanking } from "@/lib/tournament/bracket";
import { getExpectedGroupMatchCount } from "@/lib/tournament/groups";

export const dynamic = "force-dynamic";

export default async function ArchivedTournamentHomePage({ params }: PageProps<"/archivio/[slug]">) {
  const { slug } = await params;
  const data = await loadArchivedTournamentData(slug);
  const completed = data.matches.filter((match) => match.status === "completed").slice(-3).reverse();
  const finalRanking = determineFinalRanking(data.matches, data.teams);
  const expectedMatches = getExpectedGroupMatchCount(data.teams) + 8;
  const basePath = `/archivio/${slug}`;
  return (
    <>
      <PageHero eyebrow={`${data.tournament.season_label} · Archivio`} title={data.tournament.title} description="Edizione conclusa: tutti i dati ufficiali restano consultabili." logo logoSrc={data.tournament.logo_path} logoAlt={`Logo ${data.tournament.title}`}>
        <div className="hero-actions">
          <Link className="button button--primary" href={`${basePath}/gironi`}><ListChecks size={19} aria-hidden="true" /> Gironi e classifiche</Link>
          <Link className="button button--outline" href={`${basePath}/partite`}><CalendarDays size={19} aria-hidden="true" /> Tutte le partite</Link>
          <Link className="button button--outline" href={`${basePath}/fase-finale`}><Trophy size={19} aria-hidden="true" /> Fase finale</Link>
        </div>
      </PageHero>
      <section className="section container">
        <div className="grid grid--2">
          <div className="metric"><strong>Torneo concluso</strong><span>Stato definitivo</span></div>
          <div className="metric"><strong>{data.matches.filter((match) => match.status === "completed").length}/{expectedMatches}</strong><span>Partite concluse</span></div>
        </div>
      </section>
      <section className="section container">
        <div className="section-heading"><div><p className="eyebrow">Risultati definitivi</p><h2>Ultime partite</h2></div><Link className="button button--outline" href={`${basePath}/partite`}>Calendario completo</Link></div>
        {completed.length ? <div className="match-grid">{completed.map((match) => <MatchCard key={match.id} match={match} teams={data.teams} />)}</div> : <div className="empty-state">Nessun risultato disponibile.</div>}
      </section>
      <section className="section container">
        <div className="section-heading"><div><p className="eyebrow">Podio del {data.tournament.short_title}</p><h2>Classifica finale</h2></div></div>
        {finalRanking.length === 4 ? <div className="final-ranking">{finalRanking.map((team, index) => <div className="final-rank" key={team.id}><Trophy color={index === 0 ? "#F5B800" : "#071B45"} aria-hidden="true" /><span>{index + 1}° posto</span><strong>{team.name}</strong></div>)}</div> : <div className="empty-state">Classifica finale non disponibile.</div>}
      </section>
    </>
  );
}
