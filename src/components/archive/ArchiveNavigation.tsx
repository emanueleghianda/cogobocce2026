import Link from "next/link";
import { Archive, CalendarDays, Home, ListChecks, ScrollText, Trophy } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import type { Tournament } from "@/types/tournament";

const archiveLinks = [
  ["", "Home", Home],
  ["/gironi", "Gironi", ListChecks],
  ["/partite", "Partite", CalendarDays],
  ["/fase-finale", "Fase finale", Trophy],
  ["/regole", "Regole", ScrollText],
] as const;

export function ArchiveNavigation({ tournament }: { tournament: Tournament }) {
  const basePath = `/archivio/${tournament.slug}`;
  return (
    <section className="archive-nav container" aria-label={`Archivio ${tournament.short_title}`}>
      <Logo compact src={tournament.logo_path} alt={`Logo ${tournament.title}`} />
      <div className="archive-nav__copy">
        <p className="eyebrow"><Archive size={15} aria-hidden="true" /> Archivio definitivo</p>
        <strong>{tournament.short_title}</strong>
        <span>Tutti i dati sono conclusi e non modificabili.</span>
      </div>
      <nav aria-label={`Navigazione ${tournament.short_title}`}>
        {archiveLinks.map(([suffix, label, Icon]) => (
          <Link href={`${basePath}${suffix}`} key={suffix || "home"}>
            <Icon size={17} aria-hidden="true" /> {label}
          </Link>
        ))}
      </nav>
    </section>
  );
}
