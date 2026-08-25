import type { Metadata } from "next";
import { MatchesExplorer } from "@/components/tournament/MatchesExplorer";
import { PageHero } from "@/components/shared/PageHero";
import { loadArchivedTournamentData } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Partite e risultati" };

export default async function ArchivedMatchesPage({ params, searchParams }: PageProps<"/archivio/[slug]/partite">) {
  const { slug } = await params;
  const { stato } = await searchParams;
  const data = await loadArchivedTournamentData(slug);
  return (
    <>
      <PageHero eyebrow="Archivio · Calendario ufficiale" title="Partite e risultati" description={`Tutti gli incontri e tutti i punteggi definitivi del ${data.tournament.short_title}.`} />
      <section className="section container"><MatchesExplorer matches={data.matches} teams={data.teams} initial={typeof stato === "string" ? stato : "all"} /></section>
    </>
  );
}
