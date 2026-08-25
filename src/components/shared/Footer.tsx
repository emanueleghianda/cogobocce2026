import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <strong>Torneo di Bocce Cogoleto</strong>
        <p>Ranking, albo d&apos;oro e archivi ufficiali dell&apos;organizzazione.</p>
      </div>
      <div className="footer-links">
        <Link href="/installa">Installa l&apos;app</Link>
        <Link href="/ranking">Ranking Globale</Link>
        <Link href="/ranking-triennale">Ranking Triennale</Link>
        <Link href="/regole">Regolamento</Link>
        <Link href="/archivio">Archivio tornei</Link>
        <Link href="/admin">Area amministratore</Link>
      </div>
    </footer>
  );
}
