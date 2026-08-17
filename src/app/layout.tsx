import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { RealtimeRefresh } from "@/components/shared/RealtimeRefresh";
import { PwaRegistration } from "@/components/shared/PwaRegistration";
import { AppLaunchSplash } from "@/components/shared/AppLaunchSplash";
import { loadPublicTournamentData } from "@/lib/data";

const displayFont = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-display" });
const bodyFont = Inter({ subsets: ["latin"], variable: "--font-body" });
const publicBaseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(publicBaseUrl),
  title: { default: "Torneo di Bocce Singolo Cogoleto 2K26", template: "%s · Bocce Singolo Cogoleto 2K26" },
  description: "Tutte le partite, tutti i risultati, il ranking e la fase finale del Torneo di Bocce Singolo Cogoleto 2K26.",
  applicationName: "Bocce Singolo Cogoleto 2K26",
  manifest: "/manifest.webmanifest?v=3",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-singolo-192.png?v=3", type: "image/png", sizes: "192x192" },
      { url: "/icon-singolo-512.png?v=3", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-touch-icon-singolo.png?v=3", type: "image/png", sizes: "180x180" }],
  },
  appleWebApp: {
    capable: true,
    title: "Singolo 2K26",
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    type: "website",
    locale: "it_IT",
    title: "Torneo di Bocce Singolo Cogoleto 2K26",
    description: "Tutte le partite e tutti i risultati in tempo reale.",
    images: [{ url: "/og-singolo-2k26.png", width: 1200, height: 630, alt: "Tutte le partite, tutti i risultati e tutti i ranking del Torneo di Bocce Singolo Cogoleto 2K26" }],
  },
  twitter: { card: "summary_large_image", title: "Torneo di Bocce Singolo Cogoleto 2K26", description: "Risultati e classifiche in tempo reale.", images: ["/og-singolo-2k26.png"] },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#071B45",
  colorScheme: "light",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { settings, tournament } = await loadPublicTournamentData();
  return (
    <html lang="it">
      <body className={`${displayFont.variable} ${bodyFont.variable}`}>
        <AppLaunchSplash />
        <PwaRegistration />
        <a className="skip-link" href="#contenuto">Vai al contenuto</a>
        <Header status={settings.tournament_status} tournament={tournament} />
        <main id="contenuto" className="site-main">{children}</main>
        <div className="container live-bar"><RealtimeRefresh lastUpdate={settings.last_public_update} /></div>
        <Footer tournament={tournament} />
      </body>
    </html>
  );
}
