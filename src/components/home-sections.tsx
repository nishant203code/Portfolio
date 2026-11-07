import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import { experience, profile, skills } from "@/content/profile";
import { projects } from "@/content/projects";
import { MotionWrapper } from "./motion-wrapper";
import { ProjectCard } from "./project-card";

export function Hero() {
  return (
    <section className="surface hero" aria-labelledby="hero-heading">
      <p className="eyebrow">Portfolio / Engineering & applied AI</p>
      <h1 id="hero-heading">{profile.name}</h1>
      <p className="hero-role">{profile.role}</p>
      <div className="hero-introduction"><p>{profile.introduction}</p><p>{profile.education}</p></div>
      <div className="hero-actions">
        <a href="#work" className="button button-primary">View projects <ArrowDown size={19} aria-hidden="true" /></a>
        <a href="/resume.pdf" className="button glass" target="_blank" rel="noreferrer">View resume <ArrowUpRight size={18} aria-hidden="true" /><span className="sr-only"> (PDF, opens in a new tab)</span></a>
      </div>
    </section>
  );
}

export function CredibilityStrip() {
  return <div className="credibility surface"><p><strong>NIT Delhi</strong> · Computer Science</p><p><strong>Class of 2027</strong></p><p>Backend & real-time systems</p><p>Applied ML & research</p></div>;
}

export function AboutSkills() {
  return (
    <section id="about" className="surface about-card" aria-labelledby="about-heading">
      <div className="about-copy">
        <p className="eyebrow blue-label">A little about me</p>
        <h2 id="about-heading">Curious about how<br /> things work.</h2>
        {profile.about.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        <Link href="/about" className="text-link">More about me <ArrowUpRight size={16} aria-hidden="true" /></Link>
      </div>
      <dl className="skill-list">{skills.map((skill) => <div key={skill.title}><dt>{skill.title}</dt><dd>{skill.detail}</dd></div>)}</dl>
    </section>
  );
}

export function ExperienceCards() {
  return (
    <section id="experience" aria-labelledby="experience-heading">
      <div className="section-heading"><h2 id="experience-heading">Experience</h2><span>Research & engineering</span></div>
      <div className="experience-grid">{experience.map((item) => (
        <article className="surface experience-card" key={item.role}>
          <p className="experience-date">{item.date}</p>
          <h3>{item.role}</h3>
          <p className="organization">{item.organization}</p>
          <p>{item.description}</p>
          <ul className="tags" aria-label="Technologies">{item.technologies.map((tech) => <li key={tech}>{tech}</li>)}</ul>
        </article>
      ))}</div>
    </section>
  );
}

export function ProjectWorks() {
  return (
    <section id="work" aria-labelledby="work-heading">
      <div className="section-heading"><h2 id="work-heading">Project Works</h2><Link href="/projects" className="text-link">All six projects <ArrowRight size={17} aria-hidden="true" /></Link></div>
      <div className="project-grid">{projects.slice(0, 4).map((project) => <MotionWrapper key={project.slug} className={`project-cell project-${project.slug}`}><ProjectCard project={project} /></MotionWrapper>)}</div>
    </section>
  );
}

export function ResearchList() {
  return (
    <section id="research" aria-labelledby="research-heading">
      <div className="section-heading"><h2 id="research-heading">Research</h2><span>Questions I’m exploring</span></div>
      <div className="surface research-card">
        <div><p className="eyebrow">Applied ML / Geospatial systems</p><h3>From a prediction<br /> to a useful decision.</h3><p>My work on TerraAlert connects computer vision with geographic context: where a detection is, what it affects, and how that information can support a response.</p><Link href="/projects/terraalert" className="text-link">Explore TerraAlert <ArrowUpRight size={17} aria-hidden="true" /></Link></div>
        <ul className="research-themes">
          <li><span>01</span><div><h4>Geospatial segmentation</h4><p>Connecting pixel-level detections to real-world coordinates.</p></div></li>
          <li><span>02</span><div><h4>Hazard-aware routing</h4><p>Bringing affected zones into route-planning decisions.</p></div></li>
          <li><span>03</span><div><h4>Evaluation & uncertainty</h4><p>Understanding data coverage, failure modes, and model limits.</p></div></li>
        </ul>
      </div>
    </section>
  );
}
