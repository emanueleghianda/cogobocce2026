import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArchiveNavigation } from "@/components/archive/ArchiveNavigation";
import { loadArchivedTournamentData } from "@/lib/data";

const archiveSlugs = ["doppio-2k26", "singolo-2k26"];

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (!archiveSlugs.includes(slug)) notFound();
  const { tournament } = await loadArchivedTournamentData(slug);
  return {
    title: { default: `Archivio ${tournament.short_title}`, template: `%s · Archivio ${tournament.short_title}` },
    description: `Archivio definitivo del ${tournament.title}.`,
  };
}

export default async function TournamentArchiveLayout({ children, params }: LayoutProps<"/archivio/[slug]">) {
  const { slug } = await params;
  if (!archiveSlugs.includes(slug)) notFound();
  const { tournament } = await loadArchivedTournamentData(slug);
  return <><ArchiveNavigation tournament={tournament} />{children}</>;
}
