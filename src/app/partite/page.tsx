import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { MatchesExplorer } from "@/components/tournament/MatchesExplorer";
import { loadPublicTournamentData } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Calendario e risultati" };

export default async function MatchesPage({ searchParams }: { searchParams: Promise<{ stato?: string }> }) {
  const data = await loadPublicTournamentData();
  const { stato } = await searchParams;
  return (
    <>
      <PageHero eyebrow="Calendario ufficiale" title="Partite e risultati" description="Segui gli incontri programmati, i punteggi in corso e tutti i risultati." />
      <section className="section container"><MatchesExplorer matches={data.matches} teams={data.teams} initial={stato || "all"} /></section>
    </>
  );
}
