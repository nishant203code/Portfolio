import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, CodeXml } from "lucide-react";
import { projects } from "@/content/projects";
import { Architecture, ProjectVisual } from "@/components/project-visual";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return projects.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) return {};
  return { title: project.title, description: project.summary, openGraph: { title: project.title, description: project.summary } };
}

export default async function CaseStudy({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();
  const next = projects[(projects.indexOf(project) + 1) % projects.length];

  return (
    <article className="case-study">
      <Link href="/projects" className="text-link back-link"><ArrowLeft size={17} aria-hidden="true" /> All projects</Link>
      <header className="page-heading case-heading">
        <p className="eyebrow">{project.category}</p><h1>{project.title}</h1><p>{project.summary}</p>
        <div className="case-meta">
          <span>{project.role}</span>
          {project.liveUrl && <a className="text-link" href={project.liveUrl} target="_blank" rel="noreferrer">Live Site <ArrowUpRight size={16} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>}
          <a className="text-link" href={project.repo} target="_blank" rel="noreferrer"><CodeXml size={17} aria-hidden="true" /> GitHub <ArrowUpRight size={16} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>
        </div>
        <ul className="tags" aria-label="Technology stack">{project.stack.map((tech) => <li key={tech}>{tech}</li>)}</ul>
      </header>
      <div className="surface case-visual"><ProjectVisual project={project} large /></div>
      <div className="case-body">
        <section className="case-section"><span className="section-number">01 / Context</span><div><h2>The problem & constraints</h2><p>{project.problem}</p></div></section>
        <section className="case-section"><span className="section-number">02 / Contribution</span><div><h2>What I worked on</h2><ul className="prose-list">{project.contributions.map((item) => <li key={item}>{item}</li>)}</ul></div></section>
        <section className="case-section"><span className="section-number">03 / Architecture</span><div><h2>How the pieces connect</h2><Architecture project={project} /><div className="decisions">{project.decisions.map((decision) => <div key={decision.title}><h3>{decision.title}</h3><p>{decision.detail}</p></div>)}</div></div></section>
        <section className="case-section"><span className="section-number">04 / Engineering</span><div><h2>Edge cases & trade-offs</h2><p>{project.challenges}</p></div></section>
        {project.gallery && <figure className="case-gallery"><Image src={project.gallery.src} alt={project.gallery.alt} width={project.gallery.width} height={project.gallery.height} sizes="(max-width: 768px) 90vw, 1000px" /><figcaption>{project.gallery.caption}</figcaption></figure>}
        <section className="case-section"><span className="section-number">05 / Outcome</span><div><h2>Results & limitations</h2><p>{project.results}</p><p>{project.limitations}</p><h3>Next steps</h3><p>{project.nextSteps}</p></div></section>
        <section className="case-section"><span className="section-number">06 / Source</span><div><h2>Explore the implementation</h2><p>Selected source files behind this case study.</p><ul className="source-links">{project.sourceFiles.map((file) => <li key={file.path}><a href={`${project.repo}/blob/${project.revision}/${file.path.split("/").map(encodeURIComponent).join("/")}`} target="_blank" rel="noreferrer">{file.label}<ArrowUpRight size={16} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a></li>)}</ul></div></section>
      </div>
      <Link className="surface next-project" href={`/projects/${next.slug}`}><span><span className="eyebrow">Next project</span><span className="next-project-title">{next.title}</span></span><ArrowRight size={26} aria-hidden="true" /></Link>
    </article>
  );
}
