import Link from "next/link";
import type { Tournament } from "@/types/tournament";

export function Footer({ tournament }: { tournament: Tournament }) {
  return (
    <footer className="site-footer">
      <div>
        <strong>{tournament.title}</strong>
        <p>Risultati e classifiche ufficiali dell’organizzazione.</p>
      </div>
      <div className="footer-links">
        <Link href="/installa">Installa l&apos;app</Link>
        <Link href="/regole">Regolamento</Link>
        <Link href="/archivio">Archivio tornei</Link>
        <Link href="/admin">Area amministratore</Link>
      </div>
    </footer>
  );
}
