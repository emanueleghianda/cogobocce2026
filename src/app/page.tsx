import Link from "next/link";
import { Archive, CalendarDays, Crown, Download, History, Medal, Trophy } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { ShareButton } from "@/components/shared/ShareButton";
import { loadPublicTournamentData } from "@/lib/data";
import { selectRanking } from "@/lib/ranking";

export const dynamic = "force-dynamic";

function RankingPodium({ title, entries, href }: { title: string; entries: ReturnType<typeof selectRanking>; href: string }) {
  return (
    <article className="panel panel--navy podium-panel">
      <p className="eyebrow">Classifica ufficiale</p>
      <h2>{title}</h2>
      <div className="podium-cards">
        {entries.slice(0, 3).map((entry, index) => (
          <div className="podium-card" key={entry.id}>
            <span aria-hidden="true">{["🥇", "🥈", "🥉"][index]}</span>
            <strong>{entry.participant_name}</strong>
            <b>{entry.points} pt</b>
          </div>
        ))}
      </div>
      <Link className="button button--primary" href={href}>Consulta la classifica</Link>
    </article>
  );
}

export default async function HomePage() {
  const data = await loadPublicTournamentData();
  const globalRanking = selectRanking(data.historicalRanking, "global");
  const triennialRanking = selectRanking(data.historicalRanking, "triennial");

  return (
    <>
      <PageHero
        eyebrow="Cogoleto · Prossimo appuntamento: agosto 2027"
        title="ASPETTANDO IL TORNEO DI BOCCE 2K27"
        description="Doppio e Singolo torneranno ad agosto 2027. Nell’attesa, rivivi i tornei conclusi e consulta ranking e albo d’oro."
        logo
        logoSrc="/logo-attesa-2k27.png"
        logoAlt="Logo Torneo di Bocce Cogoleto"
      >
        <div className="hero-actions">
          <Link className="button button--primary" href="/ranking"><Medal size={19} aria-hidden="true" /> Ranking Globale</Link>
          <Link className="button button--outline" href="/ranking-triennale"><Trophy size={19} aria-hidden="true" /> Ranking Triennale</Link>
          <Link className="button button--outline" href="/albo-d-oro"><Crown size={19} aria-hidden="true" /> Albo d&apos;oro</Link>
          <Link className="button button--outline" href="/installa"><Download size={19} aria-hidden="true" /> Installa l&apos;app</Link>
          <ShareButton />
        </div>
      </PageHero>

      <section className="section container waiting-banner">
        <CalendarDays size={42} aria-hidden="true" />
        <div>
          <p className="eyebrow">Segna il periodo</p>
          <h2>Ci vediamo ad agosto 2027</h2>
          <p>Due tornei, la stessa tradizione: torneranno sia il Doppio sia il Singolo.</p>
        </div>
      </section>

      <section className="section container">
        <div className="section-heading">
          <div><p className="eyebrow">La storia continua</p><h2>Nel frattempo, scopri tutti i risultati</h2></div>
        </div>
        <div className="season-links">
          <Link className="season-link" href="/ranking"><Medal aria-hidden="true" /><span><strong>Ranking Globale</strong><small>Tutti i tornei dal 2020</small></span></Link>
          <Link className="season-link" href="/ranking-triennale"><Trophy aria-hidden="true" /><span><strong>Ranking Triennale</strong><small>Gli ultimi tre anni di tornei</small></span></Link>
          <Link className="season-link" href="/albo-d-oro"><History aria-hidden="true" /><span><strong>Albo d&apos;oro</strong><small>Tutti i podi dal 2020</small></span></Link>
        </div>
      </section>

      <section className="section container">
        <div className="grid grid--2">
          <RankingPodium title="Ranking Globale" entries={globalRanking} href="/ranking" />
          <RankingPodium title="Ranking Triennale" entries={triennialRanking} href="/ranking-triennale" />
        </div>
      </section>

      <section className="section--tight container">
        <div className="archive-callout">
          <Archive size={34} aria-hidden="true" />
          <div>
            <p className="eyebrow">Archivio 2K26</p>
            <h2>Rivivi Doppio e Singolo</h2>
            <p>Partecipanti, gironi, classifiche, tutte le partite, tutti i punteggi e le fasi finali sono conservati integralmente.</p>
          </div>
          <div className="button-row">
            <Link className="button button--primary" href="/archivio/doppio-2k26">Doppio 2K26</Link>
            <Link className="button button--primary" href="/archivio/singolo-2k26">Singolo 2K26</Link>
          </div>
        </div>
      </section>
    </>
  );
}
