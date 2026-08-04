"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";

export function ShareButton() {
  const [message, setMessage] = useState("");
  async function share() {
    const data = {
      title: "Torneo di Bocce Doppio Cogoleto 2K26",
      text: "Segui risultati, classifiche e fase finale del torneo.",
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(data);
        return;
      }
      const whatsapp = window.open(
        `https://wa.me/?text=${encodeURIComponent(`${data.text} ${data.url}`)}`,
        "_blank",
        "noopener,noreferrer",
      );
      if (whatsapp) {
        setMessage("Condivisione aperta su WhatsApp");
        return;
      }
      await navigator.clipboard.writeText(data.url);
      setMessage("Link copiato");
    } catch {
      setMessage("Condivisione annullata");
    }
  }
  return (
    <span className="share-wrap">
      <button className="button button--outline" type="button" onClick={share}>
        <Share2 size={18} aria-hidden="true" /> Condividi
      </button>
      <span className="sr-only" aria-live="polite">{message}</span>
    </span>
  );
}
