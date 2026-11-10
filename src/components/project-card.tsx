import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/content/projects";
import { ProjectVisual } from "./project-visual";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className={`surface project-card project-${project.slug}`}>
      <div className="project-card-copy">
        <p className="eyebrow">{project.category}</p>
        <h3><Link href={`/projects/${project.slug}`}>{project.title}</Link></h3>
        <p>{project.summary}</p>
      </div>
      <ProjectVisual project={project} />
      <div className="project-card-bottom">
        <ul className="tags" aria-label="Technologies">{project.stack.slice(0, 4).map((tag) => <li key={tag}>{tag}</li>)}</ul>
        <div className="project-card-links">
          {project.liveUrl && <a className="text-link" href={project.liveUrl} target="_blank" rel="noreferrer" aria-label={`Visit ${project.title} live site (opens in a new tab)`}>Live Site <ArrowUpRight size={17} aria-hidden="true" /></a>}
          <Link className="text-link" href={`/projects/${project.slug}`} aria-label={`Explore ${project.title} project`}> Explore Project <ArrowUpRight size={17} aria-hidden="true" /></Link>
        </div>
      </div>
    </article>
  );
}
