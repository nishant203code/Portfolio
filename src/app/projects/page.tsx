import type { Metadata } from "next";
import { projects } from "@/content/projects";
import { ProjectCard } from "@/components/project-card";

export const metadata: Metadata = { title: "Projects", description: "Six projects spanning real-time software, applied AI, retrieval systems, and geospatial research." };

export default function ProjectsPage() {
  return <><header className="page-heading"><p className="eyebrow">Software / Applied AI / Research</p><h1>Project Works</h1><p>Six explorations in building systems that work — from peer connections to grounded answers.</p></header><div className="project-index">{projects.map((project) => <ProjectCard key={project.slug} project={project} />)}</div></>;
}
