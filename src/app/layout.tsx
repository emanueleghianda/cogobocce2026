import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { PwaRegistration } from "@/components/shared/PwaRegistration";
import { AppLaunchSplash } from "@/components/shared/AppLaunchSplash";

const displayFont = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-display" });
const bodyFont = Inter({ subsets: ["latin"], variable: "--font-body" });
const publicBaseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(publicBaseUrl),
  title: { default: "ASPETTANDO IL TORNEO DI BOCCE 2K27", template: "%s · Bocce Cogoleto" },
  description: "Doppio e Singolo torneranno ad agosto 2027. Consulta ranking, albo d'oro e archivi dei Tornei di Bocce di Cogoleto.",
  applicationName: "Bocce Cogoleto",
  icons: {
    icon: [{ url: "/logo-attesa-2k27.png?v=4", type: "image/png", sizes: "1254x1254" }],
    apple: [{ url: "/logo-attesa-2k27.png?v=4", type: "image/png", sizes: "1254x1254" }],
  },
  appleWebApp: {
    capable: true,
    title: "Bocce Cogoleto",
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    type: "website",
    locale: "it_IT",
    title: "ASPETTANDO IL TORNEO DI BOCCE 2K27",
    description: "Doppio e Singolo tornano ad agosto 2027.",
    images: [{ url: "/logo-attesa-2k27.png?v=4", width: 1254, height: 1254, alt: "Logo Torneo di Bocce Cogoleto" }],
  },
  twitter: { card: "summary_large_image", title: "ASPETTANDO IL TORNEO DI BOCCE 2K27", description: "Doppio e Singolo tornano ad agosto 2027.", images: ["/logo-attesa-2k27.png?v=4"] },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#071B45",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it">
      <head>
        <link rel="manifest" href="/manifest.webmanifest?v=4" />
      </head>
      <body className={`${displayFont.variable} ${bodyFont.variable}`}>
        <AppLaunchSplash />
        <PwaRegistration />
        <a className="skip-link" href="#contenuto">Vai al contenuto</a>
        <Header />
        <main id="contenuto" className="site-main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
