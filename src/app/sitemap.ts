import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (!url) return [];
  return ["", "/about", "/projects", ...projects.map(({ slug }) => `/projects/${slug}`)].map((path) => ({ url: `${url}${path}` }));
}
