import Link from "next/link";
import { Archive, BellRing, BookOpen, CalendarDays, Download, ListChecks, Medal, Radio, Trophy } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { ShareButton } from "@/components/shared/ShareButton";
import { MatchCard } from "@/components/tournament/MatchCard";
import { TOURNAMENT_STATUS_LABELS } from "@/lib/constants";
import { loadPublicTournamentData } from "@/lib/data";
import { calculateAllStandings, getExpectedGroupMatchCount } from "@/lib/tournament/groups";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await loadPublicTournamentData();
  const standings = calculateAllStandings(data.teams, data.matches, data.overrides);
  const live = data.matches.filter((match) => match.status === "live");
  const completed = data.matches.filter((match) => match.status === "completed").slice(-3).reverse();
  const upcoming = data.matches
    .filter((match) => match.status === "scheduled")
    .sort((a, b) => (a.scheduled_at ?? "9999").localeCompare(b.scheduled_at ?? "9999"))
    .slice(0, 3);
  const qualified = standings.flatMap((group) => group.rows.filter((row) => row.qualified));
  const expectedMatches = getExpectedGroupMatchCount(data.teams) + 8;

  return (
    <>
      <PageHero
        eyebrow={data.tournament.season_label}
        title={data.tournament.title}
        description="Tutte le partite e tutti i risultati in tempo reale"
        logo
        logoSrc={data.tournament.logo_path}
        logoAlt={`Logo ${data.tournament.title}`}
      >
        <div className="hero-actions">
          <Link className="button button--primary" href="/gironi"><ListChecks size={19} aria-hidden="true" /> Vedi i gironi</Link>
          <Link className="button button--outline" href="/partite?stato=live"><Radio size={19} aria-hidden="true" /> PARTITA IN CORSO</Link>
          <Link className="button button--outline" href="/ranking"><Medal size={19} aria-hidden="true" /> Ranking</Link>
          <Link className="button button--outline" href="/installa"><Download size={19} aria-hidden="true" /> Installa l&apos;app</Link>
          <ShareButton />
        </div>
        {!data.connected && (
          <p className="connection-notice" role="status">I dati iniziali ufficiali sono pronti; gli aggiornamenti live saranno visibili alla pubblicazione del torneo.</p>
        )}
      </PageHero>

      <section className="section container">
        <div className="grid grid--2">
          <div className="metric"><strong>{TOURNAMENT_STATUS_LABELS[data.settings.tournament_status]}</strong><span>Stato del torneo</span></div>
          <div className="metric"><strong>{data.matches.filter((m) => m.status === "completed").length}/{expectedMatches}</strong><span>Partite concluse</span></div>
        </div>
      </section>

      <section className="section--tight container">
        <div className="announcement">
          <BellRing size={23} aria-hidden="true" />
          <div><strong>Comunicazione dell’organizzazione</strong><p>{data.settings.public_announcement || "Nessuna comunicazione pubblicata."}</p></div>
        </div>
      </section>

      <section className="section container">
        <div className="section-heading"><div><p className="eyebrow">Sul campo</p><h2>PARTITA IN CORSO</h2></div><Link className="button button--outline" href="/partite">Tutte le partite</Link></div>
        {live.length ? <div className="match-grid">{live.map((match) => <MatchCard key={match.id} match={match} teams={data.teams} />)}</div> : <div className="empty-state">Nessuna partita è in corso in questo momento.</div>}
      </section>

      <section className="section container">
        <div className="grid grid--2">
          <div>
            <div className="section-heading"><div><p className="eyebrow">Appena concluse</p><h2>Ultimi risultati</h2></div></div>
            {completed.length ? <div className="grid">{completed.map((match) => <MatchCard key={match.id} match={match} teams={data.teams} />)}</div> : <div className="empty-state">I risultati compariranno qui appena disponibili.</div>}
          </div>
          <div>
            <div className="section-heading"><div><p className="eyebrow">In calendario</p><h2>Prossime partite</h2></div></div>
            {upcoming.length ? <div className="grid">{upcoming.map((match) => <MatchCard key={match.id} match={match} teams={data.teams} />)}</div> : <div className="empty-state">Il calendario sarà pubblicato dall’organizzazione.</div>}
          </div>
        </div>
      </section>

      {qualified.length > 0 && (
        <section className="section container">
          <div className="section-heading"><div><p className="eyebrow">Verso le finali</p><h2>Giocatori qualificati</h2></div></div>
          <div className="grid grid--4">{qualified.map((row) => <div className="panel panel--gold" key={row.team.id}><Trophy color="#F5B800" aria-hidden="true" /><h3>{row.team.name}</h3><p>Girone {row.team.group_code} · {row.rank}° classificato</p></div>)}</div>
        </section>
      )}

      <section className="section container">
        <div className="grid grid--2">
          <div className="panel panel--navy podium-panel">
            <p className="eyebrow">RANKING ANNI &apos;20</p><h2>Il podio del ranking</h2>
            <div className="podium-cards">
              {data.historicalRanking.slice(0, 3).map((entry, index) => <div className="podium-card" key={entry.id}><span>{["🥇", "🥈", "🥉"][index]} {entry.rank_position}° posto</span><strong>{entry.participant_name}</strong><b>{entry.points} pt</b></div>)}
            </div>
            <Link className="button button--primary" href="/ranking">Consulta il ranking completo</Link>
          </div>
          <div className="panel panel--cream">
            <p className="eyebrow">SCOPRI IL TORNEO</p><h2>Il torneo, partita dopo partita</h2>
            <p>Consulta il regolamento, il calendario, i gironi e il tabellone della fase finale.</p>
            <div className="button-row">
              <Link className="button button--outline" href="/regole"><BookOpen size={18} aria-hidden="true" /> Leggi le regole</Link>
              <Link className="button button--outline" href="/partite"><CalendarDays size={18} aria-hidden="true" /> Partite</Link>
              <Link className="button button--outline" href="/gironi"><ListChecks size={18} aria-hidden="true" /> Gironi</Link>
              <Link className="button button--navy" href="/fase-finale"><Trophy size={18} aria-hidden="true" /> Fase finale</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section--tight container">
        <div className="archive-callout">
          <Archive size={34} aria-hidden="true" />
          <div><p className="eyebrow">Archivio tornei</p><h2>Rivivi il Doppio 2K26</h2><p>Tutte le coppie, le partite, i punteggi, i gironi e la fase finale restano consultabili.</p></div>
          <Link className="button button--primary" href="/archivio/doppio-2k26">Apri Doppio 2K26</Link>
        </div>
      </section>
    </>
  );
}
