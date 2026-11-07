import Link from "next/link";

export default function NotFound() {
  return <div className="surface not-found"><p className="eyebrow">404</p><h1>That page isn’t here.</h1><p>You can find my work in the project index.</p><Link className="button button-primary" href="/projects">View projects</Link></div>;
}
