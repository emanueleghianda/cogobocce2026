import Link from "next/link";
import { BellRing, CalendarDays, ListChecks, Medal, Radio, Trophy } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { ShareButton } from "@/components/shared/ShareButton";
import { MatchCard } from "@/components/tournament/MatchCard";
import { TOURNAMENT_STATUS_LABELS } from "@/lib/constants";
import { loadPublicTournamentData } from "@/lib/data";
import { calculateAllStandings } from "@/lib/tournament/groups";

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

  return (
    <>
      <PageHero
        eyebrow="Cogoleto · Estate 2026"
        title="Torneo di Bocce Doppio – Cogoleto 2K26"
        description="Risultati, classifiche e fase finale in tempo reale"
        logo
      >
        <div className="hero-actions">
          <Link className="button button--primary" href="/gironi"><ListChecks size={19} aria-hidden="true" /> Vedi i gironi</Link>
          <Link className="button button--outline" href="/partite?stato=live"><Radio size={19} aria-hidden="true" /> Partite in corso</Link>
          <Link className="button button--outline" href="/ranking"><Medal size={19} aria-hidden="true" /> Ranking storico</Link>
          <ShareButton />
        </div>
        {!data.connected && (
          <p className="connection-notice" role="status">I dati iniziali ufficiali sono pronti; gli aggiornamenti live saranno visibili alla pubblicazione del torneo.</p>
        )}
      </PageHero>

      <section className="section container">
        <div className="grid grid--4">
          <div className="metric"><strong>{TOURNAMENT_STATUS_LABELS[data.settings.tournament_status]}</strong><span>Stato del torneo</span></div>
          <div className="metric"><strong>{data.matches.filter((m) => m.status === "completed").length}/32</strong><span>Partite concluse</span></div>
          <div className="metric"><strong>{live.length}</strong><span>Partite in corso</span></div>
          <div className="metric"><strong>{qualified.length}/8</strong><span>Coppie qualificate</span></div>
        </div>
      </section>

      <section className="section--tight container">
        <div className="announcement">
          <BellRing size={23} aria-hidden="true" />
          <div><strong>Comunicazione dell’organizzazione</strong><p>{data.settings.public_announcement || "Nessuna comunicazione pubblicata."}</p></div>
        </div>
      </section>

      <section className="section container">
        <div className="section-heading"><div><p className="eyebrow">Sul campo</p><h2>Partite in corso</h2></div><Link className="button button--outline" href="/partite">Tutte le partite</Link></div>
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
          <div className="section-heading"><div><p className="eyebrow">Verso le finali</p><h2>Coppie qualificate</h2></div></div>
          <div className="grid grid--4">{qualified.map((row) => <div className="panel panel--gold" key={row.team.id}><Trophy color="#F5B800" aria-hidden="true" /><h3>{row.team.name}</h3><p>Girone {row.team.group_code} · {row.rank}ª classificata</p></div>)}</div>
        </section>
      )}

      <section className="section container">
        <div className="grid grid--2">
          <div className="panel panel--navy">
            <p className="eyebrow">Albo storico 2020–2025</p><h2>Il podio del ranking</h2>
            <div className="podium-cards">
              {data.historicalRanking.slice(0, 3).map((entry, index) => <div className="podium-card" key={entry.id}><span>{["🥇", "🥈", "🥉"][index]} {entry.rank_position}° posto</span><strong>{entry.participant_name}</strong><b>{entry.points} pt</b></div>)}
            </div>
            <Link className="button button--primary" href="/ranking">Consulta il ranking completo</Link>
          </div>
          <div className="panel panel--cream">
            <p className="eyebrow">Formato ufficiale</p><h2>32 partite, un solo titolo</h2>
            <p>16 coppie divise in quattro gironi. Le migliori otto accedono ai quarti, poi semifinali e due finali.</p>
            <div className="button-row"><Link className="button button--navy" href="/fase-finale"><Trophy size={18} aria-hidden="true" /> Fase finale</Link><Link className="button button--outline" href="/regole"><CalendarDays size={18} aria-hidden="true" /> Leggi le regole</Link></div>
          </div>
        </div>
      </section>
    </>
  );
}
