import type { Metadata } from "next";
import { CircleDot, ShieldCheck, Trophy } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { loadArchivedTournamentData } from "@/lib/data";

export const metadata: Metadata = { title: "Regolamento" };

export default async function ArchivedRulesPage({ params }: PageProps<"/archivio/[slug]/regole">) {
  const { slug } = await params;
  const data = await loadArchivedTournamentData(slug);
  const isDouble = data.tournament.format === "double";
  const participants = isDouble ? "coppie" : "giocatori";
  const participant = isDouble ? "coppia" : "giocatore";
  return (
    <>
      <PageHero eyebrow="Archivio · Regolamento ufficiale" title="Come si giocava" description={`Formato, punteggi e criteri di qualificazione del ${data.tournament.short_title}.`} />
      <section className="section container rules-grid">
        <article className="panel panel--gold"><CircleDot color="#D71920" aria-hidden="true" /><h2>Fase a gironi</h2><ul className="rules-list"><li>4 gironi da 4 {participants}.</li><li>Ogni {participant} affronta tutti gli altri del girone.</li><li>Le partite si giocano ai 10 punti.</li><li>Passano i primi 2 di ogni girone.</li></ul></article>
        <article className="panel panel--gold"><ShieldCheck color="#008F45" aria-hidden="true" /><h2>Criteri di classifica</h2><ol className="rules-list"><li>Maggior numero di vittorie.</li><li>Migliore differenza punti.</li><li>Scontro diretto.</li></ol><p>Le parità fra tre o più {participants} con vittorie e differenza identiche vengono risolte ufficialmente dall&apos;organizzazione.</p></article>
        <article className="panel panel--navy"><Trophy color="#F5B800" aria-hidden="true" /><h2>Fase finale</h2><ul className="rules-list"><li>Quarti ai 10 punti.</li><li>Semifinali ai 10 punti.</li><li>Finale 3°/4° ai 12 punti.</li><li>Finale 1°/2° ai 12 punti.</li></ul></article>
        <article className="panel panel--cream"><h2>Incroci dei quarti</h2><ol className="crossing-list"><li>1ª Girone A contro 2ª Girone B</li><li>1ª Girone C contro 2ª Girone D</li><li>1ª Girone B contro 2ª Girone A</li><li>1ª Girone D contro 2ª Girone C</li></ol></article>
      </section>
    </>
  );
}
