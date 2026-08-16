"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Download, Share2, Smartphone } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

interface NavigatorWithStandalone extends Navigator {
  standalone?: boolean;
}

interface WindowWithInstallPrompt extends Window {
  __bocceInstallPrompt?: BeforeInstallPromptEvent;
}

function isInstalled() {
  return window.matchMedia("(display-mode: standalone)").matches
    || Boolean((navigator as NavigatorWithStandalone).standalone);
}

function isAppleMobile() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

async function copyInstallLink() {
  const url = window.location.href;
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(url);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = url;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

export function InstallApp() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [appleMobile, setAppleMobile] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setAppleMobile(isAppleMobile());
      setInstalled(isInstalled());
      const savedPrompt = (window as WindowWithInstallPrompt).__bocceInstallPrompt;
      if (savedPrompt) setInstallPrompt(savedPrompt);
    });

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };
    const onInstallPromptReady = () => {
      const savedPrompt = (window as WindowWithInstallPrompt).__bocceInstallPrompt;
      if (savedPrompt) setInstallPrompt(savedPrompt);
    };
    const onInstalled = () => {
      setInstalled(true);
      setInstallPrompt(null);
      setMessage("App installata correttamente.");
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("bocceinstallpromptready", onInstallPromptReady);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("bocceinstallpromptready", onInstallPromptReady);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  async function install() {
    setMessage("");

    if (installed) {
      setMessage("L'app è già installata su questo dispositivo.");
      return;
    }

    if (!installPrompt) {
      setMessage(
        appleMobile
          ? "Su iPhone usa Condividi e poi Aggiungi alla schermata Home."
          : "Apri il menu del browser e scegli Installa app o Aggiungi alla schermata Home.",
      );
      return;
    }

    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    setInstallPrompt(null);
    setMessage(choice.outcome === "accepted" ? "Installazione avviata." : "Installazione annullata.");
  }

  async function shareInstallLink() {
    setMessage("");
    const data = {
      title: "Installa Bocce Singolo Cogoleto 2K26",
      text: "Installa sul telefono l'app del Torneo di Bocce Singolo Cogoleto 2K26.",
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(data);
        setMessage("Link condiviso.");
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }

    try {
      await copyInstallLink();
      setMessage("Link di installazione copiato.");
    } catch {
      setMessage("Non è stato possibile copiare il link.");
    }
  }

  return (
    <div className="install-card">
      <div className="install-card__icon" aria-hidden="true">
        {installed ? <CheckCircle2 size={42} /> : <Smartphone size={42} />}
      </div>
      <div>
        <p className="eyebrow">Sul tuo telefono</p>
        <h2>{installed ? "App già installata" : "Installa Bocce Singolo Cogoleto 2K26"}</h2>
        <p>
          Avrai l&apos;icona del torneo nella schermata Home e potrai aprire il sito come una vera app,
          senza cercare ogni volta il link.
        </p>
        <div className="button-row">
          <button className="button button--primary" type="button" onClick={install}>
            <Download size={19} aria-hidden="true" /> {installed ? "App installata" : "Installa l'app"}
          </button>
          <button className="button button--outline" type="button" onClick={shareInstallLink}>
            <Share2 size={19} aria-hidden="true" /> Condividi questo link
          </button>
        </div>
        {message && <p className="install-card__message" role="status">{message}</p>}
      </div>
    </div>
  );
}
