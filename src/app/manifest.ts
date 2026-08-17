import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Torneo Bocce Singolo Cogoleto 2K26",
    short_name: "Singolo 2K26",
    description: "Tutte le partite, tutti i risultati e il ranking del torneo singolo di Cogoleto.",
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#FFF8E8",
    theme_color: "#071B45",
    lang: "it",
    icons: [
      { src: "/icon-singolo-192.png?v=3", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-singolo-512.png?v=3", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-singolo-maskable-512.png?v=3", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
