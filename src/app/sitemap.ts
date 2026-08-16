import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000";
  return [
    "", "/gironi", "/partite", "/fase-finale", "/ranking", "/regole", "/installa", "/archivio",
    "/archivio/doppio-2k26", "/archivio/doppio-2k26/gironi", "/archivio/doppio-2k26/partite",
    "/archivio/doppio-2k26/fase-finale", "/archivio/doppio-2k26/regole",
  ].map((path) => ({
    url: `${base}${path}`,
    changeFrequency: path.startsWith("/archivio/") ? "yearly" : path === "" || path === "/partite" ? "hourly" : "daily",
    priority: path === "" ? 1 : 0.8,
  }));
}
