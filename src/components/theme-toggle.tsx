"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  window.addEventListener("portfolio-theme", callback);
  return () => window.removeEventListener("portfolio-theme", callback);
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, () => document.documentElement.dataset.theme, () => undefined);

  function toggle() {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("portfolio-theme", next); } catch { /* Private browsing may disable storage. */ }
    window.dispatchEvent(new Event("portfolio-theme"));
  }

  return (
    <button type="button" className="icon-button glass theme-toggle" onClick={toggle}
      aria-label={theme ? `Switch to ${theme === "dark" ? "light" : "dark"} mode` : "Switch color theme"}>
      <Sun className="sun-icon" size={19} aria-hidden="true" />
      <Moon className="moon-icon" size={19} aria-hidden="true" />
    </button>
  );
}
