"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";
import { Logo } from "@/components/shared/Logo";

export function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || "Accesso non riuscito.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Accesso non riuscito.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="login-wrap">
      <form className="login-card" onSubmit={submit}>
        <Logo />
        <p className="eyebrow">Accesso riservato</p>
        <h1>Area amministratore</h1>
        <p>Inserisci la password dell’organizzazione. La sessione scade automaticamente dopo circa 12 ore.</p>
        <div className="field">
          <label htmlFor="admin-password">Password</label>
          <input id="admin-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required aria-describedby="login-message" />
        </div>
        <p id="login-message" className="form-message is-error" aria-live="polite">{message}</p>
        <button className="button button--navy" type="submit" disabled={busy}>{busy ? "Accesso…" : <><LogIn size={18} aria-hidden="true" /> Entra</>}</button>
      </form>
    </section>
  );
}
