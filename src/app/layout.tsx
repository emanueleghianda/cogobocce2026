import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { RealtimeRefresh } from "@/components/shared/RealtimeRefresh";
import { loadPublicTournamentData } from "@/lib/data";

const displayFont = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-display" });
const bodyFont = Inter({ subsets: ["latin"], variable: "--font-body" });
const publicBaseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(publicBaseUrl),
  title: { default: "Torneo di Bocce Doppio Cogoleto 2K26", template: "%s · Bocce Cogoleto 2K26" },
  description: "Tutte le partite, tutti i risultati, il ranking e la fase finale del Torneo di Bocce Doppio Cogoleto 2K26.",
  applicationName: "Torneo Bocce Cogoleto 2K26",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    locale: "it_IT",
    title: "Torneo di Bocce Doppio Cogoleto 2K26",
    description: "Tutte le partite e tutti i risultati in tempo reale.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Logo e informazioni del Torneo di Bocce Doppio Cogoleto 2K26" }],
  },
  twitter: { card: "summary_large_image", title: "Torneo di Bocce Doppio Cogoleto 2K26", description: "Risultati e classifiche in tempo reale.", images: ["/og.png"] },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#071B45",
  colorScheme: "light",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { settings } = await loadPublicTournamentData();
  return (
    <html lang="it">
      <body className={`${displayFont.variable} ${bodyFont.variable}`}>
        <a className="skip-link" href="#contenuto">Vai al contenuto</a>
        <Header status={settings.tournament_status} />
        <main id="contenuto" className="site-main">{children}</main>
        <div className="container live-bar"><RealtimeRefresh lastUpdate={settings.last_public_update} /></div>
        <Footer />
      </body>
    </html>
  );
}
