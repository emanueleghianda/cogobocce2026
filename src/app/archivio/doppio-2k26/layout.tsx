import type { Metadata } from "next";
import { ArchiveNavigation } from "@/components/archive/ArchiveNavigation";
import { loadArchivedTournamentData } from "@/lib/data";

export const metadata: Metadata = {
  title: { default: "Archivio Doppio 2K26", template: "%s · Archivio Doppio 2K26" },
  description: "Archivio definitivo del Torneo di Bocce Doppio Cogoleto 2K26.",
};

export default async function DoubleArchiveLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { tournament } = await loadArchivedTournamentData("doppio-2k26");
  return (
    <>
      <ArchiveNavigation tournament={tournament} />
      {children}
    </>
  );
}
