import { ArrowUpRight, CodeXml, BriefcaseBusiness, Mail } from "lucide-react";
import { profile } from "@/content/profile";

export function SocialLinks() {
  return (
    <div className="social-links">
      <a href={profile.github} target="_blank" rel="noreferrer"><CodeXml size={17} aria-hidden="true" /> GitHub<span className="sr-only"> (opens in a new tab)</span></a>
      <a href={profile.linkedin} target="_blank" rel="noreferrer"><BriefcaseBusiness size={17} aria-hidden="true" /> LinkedIn<span className="sr-only"> (opens in a new tab)</span></a>
      <a href={`mailto:${profile.email}`}><Mail size={17} aria-hidden="true" /> Email</a>
    </div>
  );
}

export function ContactCTA() {
  return (
    <section id="contact" className="surface contact-card" aria-labelledby="contact-heading">
      <p className="eyebrow">Get in touch</p>
      <h2 id="contact-heading">Let’s build something<br className="desktop-break" /> worth thinking about.</h2>
      <p>Have a role, a research idea, or an interesting engineering problem? I’d love to hear about it.</p>
      <a className="contact-email" href={`mailto:${profile.email}`}>{profile.email}<ArrowUpRight size={23} aria-hidden="true" /></a>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="site-footer container">
      <p>© {new Date().getFullYear()} {profile.name}</p>
      <SocialLinks />
    </footer>
  );
}
