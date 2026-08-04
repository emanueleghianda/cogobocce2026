import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Torneo Bocce Cogoleto 2K26",
    short_name: "Bocce 2K26",
    description: "Risultati, classifiche e fase finale del torneo di Cogoleto.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFF8E8",
    theme_color: "#071B45",
    lang: "it",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
