import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { leadership, profile, skills } from "@/content/profile";
import { ContactCTA } from "@/components/footer";

export const metadata: Metadata = { title: "About", description: "About Nishant Porwal: Computer Science at NIT Delhi, software development, applied machine learning, and campus leadership." };

export default function AboutPage() {
  return <div className="about-page"><header className="page-heading"><p className="eyebrow">A little more about me</p><h1>Curiosity, put to work.</h1><p>I’m {profile.name}, a B.Tech Computer Science and Engineering student at the National Institute of Technology Delhi, graduating in 2027.</p></header><section className="surface about-story"><div><h2>Across software and AI.</h2><p>My projects span real-time communication, document workflows, and geospatial machine learning. They bring me to different versions of the same question: how do the pieces fit together well enough to be useful?</p><p>At NIT Delhi, I’ve worked on web applications and conducted research at DAViSE Lab. Building interfaces and APIs has shaped how I approach applied AI: the model matters, and so do the data flow, failure states, and the person using the result.</p><Link className="text-link" href="/projects">Explore my projects <ArrowUpRight size={17} aria-hidden="true" /></Link></div><dl className="skill-list">{skills.map((skill) => <div key={skill.title}><dt>{skill.title}</dt><dd>{skill.detail}</dd></div>)}</dl></section><section aria-labelledby="leadership-heading"><div className="section-heading"><h2 id="leadership-heading">Beyond the code</h2></div><div className="surface leadership-list">{leadership.map((item) => <div key={item.organization}><h3>{item.role}</h3><p>{item.organization}</p></div>)}</div></section><ContactCTA /></div>;
}
