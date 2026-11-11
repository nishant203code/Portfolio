import { projects } from "./projects";

export const monitoredProjects = projects.filter((project) => project.liveUrl).map((project) => ({
  slug: project.slug, title: project.title, url: project.liveUrl!,
}));

export const checkInterval = 30_000;
export const slowThreshold = 3_000;
export const checkTimeout = 20_000;
export type HealthStatus = "operational" | "degraded" | "down" | "unavailable";
export type HealthCheck = {
  slug: string;
  status: HealthStatus;
  latency: number | null;
  checkedAt: string;
  detail: string;
};
