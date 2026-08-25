import type { Metadata } from "next";
import { Download, MoreHorizontal, Share2 } from "lucide-react";
import { InstallApp } from "@/components/install/InstallApp";
import { PageHero } from "@/components/shared/PageHero";

export const metadata: Metadata = {
  title: "Installa l'app",
  description: "Installa sul telefono l'app dei Tornei di Bocce di Cogoleto.",
};

export default function InstallPage() {
  return (
    <>
      <PageHero
        eyebrow="Sempre a portata di mano"
        title="Installa l'app del torneo"
        description="Aggiungi Bocce Cogoleto alla schermata Home del telefono. È gratuita e non richiede App Store o Google Play."
      />

      <section className="section container install-page">
        <InstallApp />

        <div className="grid grid--2 install-guides">
          <article className="panel panel--cream">
            <p className="eyebrow">iPhone e iPad</p>
            <h2>Installa da Safari</h2>
            <ol className="install-steps">
              <li><Share2 size={22} aria-hidden="true" /><span>Tocca il pulsante <strong>Condividi</strong> in Safari.</span></li>
              <li><Download size={22} aria-hidden="true" /><span>Scegli <strong>Aggiungi alla schermata Home</strong>.</span></li>
              <li><span className="install-step-number">3</span><span>Attiva <strong>Apri come app web</strong> e tocca <strong>Aggiungi</strong>.</span></li>
            </ol>
          </article>

          <article className="panel">
            <p className="eyebrow">Android</p>
            <h2>Installa dal browser</h2>
            <ol className="install-steps">
              <li><Download size={22} aria-hidden="true" /><span>Tocca <strong>Installa l&apos;app</strong> qui sopra.</span></li>
              <li><MoreHorizontal size={22} aria-hidden="true" /><span>Se il pulsante non appare, apri il menu del browser.</span></li>
              <li><span className="install-step-number">3</span><span>Scegli <strong>Installa app</strong> o <strong>Aggiungi alla schermata Home</strong>.</span></li>
            </ol>
          </article>
        </div>
      </section>
    </>
  );
}
