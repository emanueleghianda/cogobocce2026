import Link from "next/link";
import { Archive, Crown, Home, Medal, ScrollText, LockKeyhole, Trophy } from "lucide-react";
import { Logo } from "@/components/shared/Logo";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/ranking", label: "Ranking Globale", icon: Medal },
  { href: "/ranking-triennale", label: "Ranking Triennale", icon: Trophy },
  { href: "/albo-d-oro", label: "Albo d'oro", icon: Crown },
  { href: "/archivio", label: "Archivio", icon: Archive },
  { href: "/regole", label: "Regolamento", icon: ScrollText },
] as const;

const mobileNavItems = [navItems[0], navItems[2], navItems[1], navItems[3], navItems[4]];

export function Header() {
  return (
    <>
      <header className="site-header">
        <div className="site-header__inner">
          <Link href="/" className="brand-link" aria-label="Torna alla home del torneo">
            <Logo compact src="/logo-attesa-2k27.png" alt="Logo Torneo di Bocce Cogoleto" />
          </Link>
          <div className="status-ribbon">
            <span className="status-dot" aria-hidden="true" />
            Agosto 2027
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
        {mobileNavItems.map((item) => {
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
