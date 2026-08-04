import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000";
  return ["", "/gironi", "/partite", "/fase-finale", "/ranking", "/regole"].map((path) => ({
    url: `${base}${path}`,
    changeFrequency: path === "" || path === "/partite" ? "hourly" : "daily",
    priority: path === "" ? 1 : 0.8,
  }));
}
