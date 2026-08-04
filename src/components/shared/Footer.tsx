import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <strong>Torneo di Bocce Doppio · Cogoleto 2K26</strong>
        <p>Risultati e classifiche ufficiali dell’organizzazione.</p>
      </div>
      <div className="footer-links">
        <Link href="/regole">Regolamento</Link>
        <Link href="/admin">Area amministratore</Link>
      </div>
    </footer>
  );
}
