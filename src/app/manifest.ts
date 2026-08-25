import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ASPETTANDO IL TORNEO DI BOCCE 2K27",
    short_name: "Bocce Cogoleto",
    description: "Ranking, albo d'oro e archivi dei Tornei di Bocce di Cogoleto.",
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#FFF8E8",
    theme_color: "#071B45",
    lang: "it",
    icons: [
      { src: "/logo-attesa-2k27.png?v=4", sizes: "1254x1254", type: "image/png", purpose: "any" },
      { src: "/logo-attesa-2k27.png?v=4", sizes: "1254x1254", type: "image/png", purpose: "maskable" },
    ],
  };
}
