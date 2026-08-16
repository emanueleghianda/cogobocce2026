import Link from "next/link";
import { Archive, Home, ListChecks, Trophy, CalendarDays, Medal, ScrollText, LockKeyhole } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { TOURNAMENT_STATUS_LABELS } from "@/lib/constants";
import type { Tournament, TournamentStatus } from "@/types/tournament";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/gironi", label: "Gironi", icon: ListChecks },
  { href: "/partite", label: "Partite", icon: CalendarDays },
  { href: "/fase-finale", label: "Fase finale", icon: Trophy },
  { href: "/ranking", label: "Ranking", icon: Medal },
  { href: "/regole", label: "Regole", icon: ScrollText },
  { href: "/archivio", label: "Archivio", icon: Archive },
] as const;

export function Header({ status, tournament }: { status: TournamentStatus; tournament: Tournament }) {
  return (
    <>
      <header className="site-header">
        <div className="site-header__inner">
          <Link href="/" className="brand-link" aria-label="Torna alla home del torneo">
            <Logo compact src={tournament.logo_path} alt={`Logo ${tournament.title}`} />
          </Link>
          <div className="status-ribbon">
            <span className="status-dot" aria-hidden="true" />
            {TOURNAMENT_STATUS_LABELS[status]}
          </div>
          <nav className="desktop-nav" aria-label="Navigazione principale">
            {navItems.map((item) => (
              <Link href={item.href} key={item.href}>{item.label}</Link>
            ))}
          </nav>
          <Link href="/admin" className="admin-link" aria-label="Area amministratore">
            <LockKeyhole size={16} aria-hidden="true" /> Admin
          </Link>
        </div>
      </header>
      <nav className="mobile-nav" aria-label="Navigazione mobile">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          return (
            <Link href={item.href} key={item.href}>
              <Icon size={20} aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
