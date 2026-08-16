import type { Metadata } from "next";
import { Crown, Trophy } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { MatchCard } from "@/components/tournament/MatchCard";
import { determineFinalRanking } from "@/lib/tournament/bracket";
import { loadPublicTournamentData } from "@/lib/data";
import type { MatchStage } from "@/types/tournament";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Fase finale" };

const rounds: Array<{ stage: MatchStage; title: string }> = [
  { stage: "quarterfinal", title: "Quarti" }, { stage: "semifinal", title: "Semifinali" },
  { stage: "third_place_final", title: "Finale 3°/4°" }, { stage: "championship_final", title: "Finale 1°/2°" },
];

export default async function FinalsPage() {
  const data = await loadPublicTournamentData();
  const finalRanking = determineFinalRanking(data.matches, data.teams);
  return (
    <>
      <PageHero eyebrow="Otto giocatori, un titolo" title="Fase finale" description="Il tabellone ufficiale dai quarti alla finale per il titolo di Campione Cogoleto 2K26." logo logoSrc={data.tournament.logo_path} logoAlt={`Logo ${data.tournament.title}`} />
      <section className="section container">
        {data.matches.some((match) => match.stage !== "group") ? (
          <div className="bracket">{rounds.map((round) => <section className="bracket-round" key={round.stage}><h2>{round.title}</h2>{data.matches.filter((match) => match.stage === round.stage).map((match) => <MatchCard key={match.id} match={match} teams={data.teams} />)}</section>)}</div>
        ) : <div className="empty-state">La fase finale sarà generata quando tutti gli incontri dei gironi saranno conclusi e le classifiche definitive.</div>}
      </section>
      <section className="section container">
        <div className="section-heading"><div><p className="eyebrow">Podio del torneo</p><h2>Classifica finale</h2></div></div>
        {finalRanking.length === 4 ? <><div className="champion-banner"><Crown size={42} color="#F5B800" aria-hidden="true" /><p>Campione Cogoleto 2K26</p><h2>{finalRanking[0].name}</h2></div><div className="final-ranking">{finalRanking.map((team,index) => <div className="final-rank" key={team.id}><Trophy color={index === 0 ? "#F5B800" : "#071B45"} aria-hidden="true" /><span>{index + 1}° posto</span><strong>{team.name}</strong></div>)}</div></> : <div className="empty-state">La classifica conclusiva apparirà dopo entrambe le finali.</div>}
      </section>
    </>
  );
}
