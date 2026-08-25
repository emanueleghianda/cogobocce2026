import type { Metadata } from "next";
import { Crown, Trophy } from "lucide-react";
import { MatchCard } from "@/components/tournament/MatchCard";
import { PageHero } from "@/components/shared/PageHero";
import { loadArchivedTournamentData } from "@/lib/data";
import { determineFinalRanking } from "@/lib/tournament/bracket";
import type { MatchStage } from "@/types/tournament";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Fase finale" };

const rounds: Array<{ stage: MatchStage; title: string }> = [
  { stage: "quarterfinal", title: "Quarti" },
  { stage: "semifinal", title: "Semifinali" },
  { stage: "third_place_final", title: "Finale 3°/4°" },
  { stage: "championship_final", title: "Finale 1°/2°" },
];

export default async function ArchivedFinalsPage({ params }: PageProps<"/archivio/[slug]/fase-finale">) {
  const { slug } = await params;
  const data = await loadArchivedTournamentData(slug);
  const finalRanking = determineFinalRanking(data.matches, data.teams);
  const participants = data.tournament.format === "double" ? "coppie" : "giocatori";
  return (
    <>
      <PageHero eyebrow={`Archivio · Otto ${participants}, un titolo`} title="Fase finale" description={`Il tabellone definitivo del ${data.tournament.short_title}.`} logo logoSrc={data.tournament.logo_path} logoAlt={`Logo ${data.tournament.title}`} />
      <section className="section container"><div className="bracket">{rounds.map((round) => <section className="bracket-round" key={round.stage}><h2>{round.title}</h2>{data.matches.filter((match) => match.stage === round.stage).map((match) => <MatchCard key={match.id} match={match} teams={data.teams} />)}</section>)}</div></section>
      <section className="section container">
        <div className="section-heading"><div><p className="eyebrow">Podio del torneo</p><h2>Classifica finale</h2></div></div>
        {finalRanking.length === 4 ? <><div className="champion-banner"><Crown size={42} color="#F5B800" aria-hidden="true" /><p>Campioni Cogoleto 2K26</p><h2>{finalRanking[0].name}</h2></div><div className="final-ranking">{finalRanking.map((team, index) => <div className="final-rank" key={team.id}><Trophy color={index === 0 ? "#F5B800" : "#071B45"} aria-hidden="true" /><span>{index + 1}° posto</span><strong>{team.name}</strong></div>)}</div></> : <div className="empty-state">Classifica finale non disponibile.</div>}
      </section>
    </>
  );
}
