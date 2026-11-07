"use client";

import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { navigation, profile } from "@/content/profile";
import { ThemeToggle } from "./theme-toggle";

export function NavBar() {
  const [open, setOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;
    function dismiss(event: PointerEvent) {
      if (!container.current?.contains(event.target as Node)) setOpen(false);
    }
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape") { setOpen(false); trigger.current?.focus(); }
    }
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  return (
    <header className="site-header container">
      <Link className="brand" href="/" onClick={() => setOpen(false)} aria-label={`${profile.name} — home`}>{profile.name}</Link>
      <div className="header-controls" ref={container}>
        <button className="icon-button glass menu-toggle" type="button" ref={trigger}
          aria-label={open ? "Close navigation" : "Open navigation"} aria-controls="main-navigation"
          aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
        </button>
        <nav id="main-navigation" className={`navigation glass${open ? " is-open" : ""}`} aria-label="Main navigation">
          {navigation.map(({ label, href }) => (
            <Link key={label} href={pathname === "/" ? href.slice(1) : href} onClick={() => setOpen(false)}>{label}</Link>
          ))}
          <a href="/resume.pdf" className="button button-small glass" target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>
            Resume <ArrowUpRight size={14} aria-hidden="true" /><span className="sr-only"> (PDF, opens in a new tab)</span>
          </a>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
