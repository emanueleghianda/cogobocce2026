"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="login-wrap">
      <div className="login-card" style={{ textAlign: "center" }}>
        <p className="eyebrow">Imprevisto</p>
        <h1>Il campo è momentaneamente indisponibile.</h1>
        <p>Riprova tra poco. Nessun dato è stato modificato.</p>
        <button type="button" className="button button--navy" onClick={reset}>Riprova</button>
      </div>
    </section>
  );
}
