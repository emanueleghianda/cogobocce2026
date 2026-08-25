"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";

async function copyToClipboard(value: string): Promise<boolean> {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch {
      // Prova il metodo compatibile con i browser meno recenti.
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  try {
    textarea.select();
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    textarea.remove();
  }
}

export function ShareButton() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  function shareData() {
    return {
      title: "ASPETTANDO IL TORNEO DI BOCCE 2K27",
      text: "Doppio e Singolo tornano ad agosto 2027. Scopri ranking, albo d’oro e archivi.",
      url: window.location.origin,
    };
  }

  async function shareWithDevice() {
    setOpen(false);
    setMessage("");
    const data = shareData();

    if (navigator.share && (!navigator.canShare || navigator.canShare(data))) {
      try {
        await navigator.share(data);
        setMessage("Condivisione completata");
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          setMessage("Condivisione annullata");
          return;
        }
      }
    }

    await copyLink();
  }

  function shareOnWhatsApp() {
    const data = shareData();
    setOpen(false);
    const whatsapp = window.open(
      `https://wa.me/?text=${encodeURIComponent(`${data.text} ${data.url}`)}`,
      "_blank",
      "noopener,noreferrer",
    );
    setMessage(whatsapp ? "Apertura di WhatsApp" : "Impossibile aprire WhatsApp");
  }

  async function copyLink() {
    setOpen(false);
    const copied = await copyToClipboard(shareData().url);
    setMessage(copied ? "Link copiato negli appunti" : "Impossibile copiare il link");
  }

  return (
    <span className="share-wrap">
      <button
        className="button button--outline"
        type="button"
        aria-expanded={open}
        aria-controls="share-options"
        onClick={() => {
          setMessage("");
          setOpen((value) => !value);
        }}
      >
        <Share2 size={18} aria-hidden="true" /> Condividi
      </button>
      {open && (
        <span className="share-menu" id="share-options">
          <button type="button" onClick={shareWithDevice}>Altre app</button>
          <button type="button" onClick={shareOnWhatsApp}>WhatsApp</button>
          <button type="button" onClick={copyLink}>Copia link</button>
        </span>
      )}
      {message && <span className="share-feedback" role="status">{message}</span>}
    </span>
  );
}
