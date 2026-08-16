import type { Metadata } from "next";
import { MatchesExplorer } from "@/components/tournament/MatchesExplorer";
import { PageHero } from "@/components/shared/PageHero";
import { loadArchivedTournamentData } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Partite e risultati" };

export default async function ArchivedMatchesPage({ searchParams }: { searchParams: Promise<{ stato?: string }> }) {
  const data = await loadArchivedTournamentData("doppio-2k26");
  const { stato } = await searchParams;
  return (
    <>
      <PageHero eyebrow="Archivio · Calendario ufficiale" title="Partite e risultati" description="Tutti gli incontri e tutti i punteggi definitivi del Doppio 2K26." />
      <section className="section container"><MatchesExplorer matches={data.matches} teams={data.teams} initial={stato || "all"} /></section>
    </>
  );
}
