import Image from "next/image";
import { ArrowDown, ArrowRight } from "lucide-react";
import type { Project } from "@/content/projects";

export function Architecture({ project }: { project: Project }) {
  return (
    <figure className="architecture">
      <figcaption className="visual-label">Conceptual architecture</figcaption>
      <ol className="flow">
        {project.flow.map((step, index) => (
          <li key={step.title}>
            <span className="flow-number">0{index + 1}</span>
            <strong>{step.title}</strong>
            <span>{step.detail}</span>
            {index < project.flow.length - 1 && <span className="flow-arrow" aria-hidden="true"><ArrowRight size={17} /><ArrowDown size={17} /></span>}
          </li>
        ))}
      </ol>
    </figure>
  );
}

export function ProjectVisual({ project, large = false }: { project: Project; large?: boolean }) {
  if (!project.screenshot) return <Architecture project={project} />;
  const { src, width, height, alt, caption } = project.screenshot;
  return (
    <figure className={`project-image${large ? " project-image-large" : ""}`}>
      <div className="screenshot-frame">
        <Image src={src} alt={alt} width={width} height={height}
          sizes={large ? "(max-width: 768px) 90vw, 1120px" : "(max-width: 768px) 90vw, 700px"} />
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
