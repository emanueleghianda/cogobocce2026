import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/shared/Logo";

export default function NotFound() {
  return (
    <section className="login-wrap">
      <div className="login-card" style={{ textAlign: "center" }}>
        <Logo />
        <p className="eyebrow">Errore 404</p>
        <h1>Questa partita non è in calendario.</h1>
        <p>La pagina richiesta non esiste oppure è stata spostata.</p>
        <Link href="/" className="button button--navy"><ArrowLeft size={18} aria-hidden="true" /> Torna al torneo</Link>
      </div>
    </section>
  );
}
