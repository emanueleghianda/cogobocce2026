import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000";
  return [
    "", "/ranking", "/ranking-triennale", "/albo-d-oro", "/regole", "/installa", "/archivio",
    "/archivio/doppio-2k26", "/archivio/doppio-2k26/gironi", "/archivio/doppio-2k26/partite",
    "/archivio/doppio-2k26/fase-finale", "/archivio/doppio-2k26/regole",
    "/archivio/singolo-2k26", "/archivio/singolo-2k26/gironi", "/archivio/singolo-2k26/partite",
    "/archivio/singolo-2k26/fase-finale", "/archivio/singolo-2k26/regole",
  ].map((path) => ({
    url: `${base}${path}`,
    changeFrequency: path.startsWith("/archivio/") ? "yearly" : "monthly",
    priority: path === "" ? 1 : 0.8,
  }));
}
