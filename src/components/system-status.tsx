"use client";

import { useEffect, useState } from "react";
import { checkInterval, monitoredProjects, type HealthCheck, type HealthStatus } from "@/content/status";

type Visit = { history: HealthCheck[]; passed: number; completed: number };
const labels: Record<HealthStatus, string> = { operational: "Operational", degraded: "Slow response", down: "Down", unavailable: "Unavailable" };

export function SystemStatus() {
  const [visits, setVisits] = useState<Record<string, Visit>>({});
  const [unavailable, setUnavailable] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let controller: AbortController | undefined;
    const visits: Record<string, Visit> = {};

    async function check() {
      if (!active || document.hidden || controller) return;
      const started = Date.now();
      const current = new AbortController();
      controller = current;
      const timeout = setTimeout(() => current.abort(), 25_000);
      setChecking(true);
      try {
        const response = await fetch("/api/status", { cache: "no-store", signal: current.signal });
        if (!response.ok) throw new Error("Status endpoint unavailable");
        const data: { checks: HealthCheck[] } = await response.json();
        if (!Array.isArray(data.checks) || data.checks.length !== monitoredProjects.length || !monitoredProjects.every(({ slug }) => data.checks.some((result) => result.slug === slug && Object.hasOwn(labels, result.status) && Number.isFinite(Date.parse(result.checkedAt)) && (result.latency === null || Number.isFinite(result.latency))))) throw new Error("Invalid status response");
        if (!active || current.signal.aborted) return;
        for (const result of data.checks) {
          const visit = visits[result.slug] ?? { history: [], passed: 0, completed: 0 };
          if (visit.history.at(-1)?.checkedAt === result.checkedAt) continue;
          visits[result.slug] = {
            history: [...visit.history, result].slice(-24),
            passed: visit.passed + Number(result.status === "operational" || result.status === "degraded"),
            completed: visit.completed + Number(result.status !== "unavailable"),
          };
        }
        setVisits({ ...visits });
        setUnavailable(false);
      } catch {
        if (active && !document.hidden) setUnavailable(true);
      } finally {
        clearTimeout(timeout);
        if (controller === current) controller = undefined;
        if (active && !document.hidden) {
          setChecking(false);
          timer = setTimeout(check, Math.max(0, checkInterval - (Date.now() - started)));
        }
      }
    }

    function visibilityChanged() {
      clearTimeout(timer);
      if (document.hidden) controller?.abort();
      else if (!controller) void check();
    }
    document.addEventListener("visibilitychange", visibilityChanged);
    void check();
    return () => {
      active = false;
      clearTimeout(timer);
      controller?.abort();
      document.removeEventListener("visibilitychange", visibilityChanged);
    };
  }, []);

  const latest = monitoredProjects.map(({ slug }) => visits[slug]?.history.at(-1));
  const unknown = unavailable || latest.some((check) => !check || check.status === "unavailable");
  const overall = unavailable ? "unavailable" : latest.some((check) => check?.status === "down") ? "down" : unknown ? "unavailable" : latest.some((check) => check?.status === "degraded") ? "degraded" : "operational";
  const summary = { operational: "All systems operational", degraded: "Some systems experiencing issues", down: "One or more systems down", unavailable: "Status unavailable" }[overall];
  const lastCheck = latest.filter((check): check is HealthCheck => Boolean(check)).map((check) => check.checkedAt).sort().at(-1);

  return (
    <section className="system-status" aria-labelledby="status-heading">
      <div className="section-heading"><h2 id="status-heading">System Status</h2></div>
      <p className="status-intro">Public website reachability, checked every 30 seconds while this page is visible. This checks HTTP responses, not every application feature.</p>
      <div className="surface status-panel">
        <div className="status-summary">
          <strong role="status"><span className={`status-dot status-${overall}`} aria-hidden="true" />{!lastCheck && checking ? "Checking systems…" : summary}</strong>
          <span>{checking ? "Checking… · " : ""}Last check: {lastCheck ? <time dateTime={lastCheck}>{new Date(lastCheck).toLocaleTimeString()}</time> : "—"}</span>
        </div>
        <ul className="status-list">
          {monitoredProjects.map(({ slug, title, url }) => {
            const visit = visits[slug];
            const result = visit?.history.at(-1);
            const status = unavailable ? "unavailable" : result?.status;
            const history = visit?.history ?? [];
            return <li className="status-row" key={slug}>
              <div className="status-site"><div><span className={`status-dot status-${status ?? "unavailable"}`} aria-hidden="true" /><h3>{title}</h3></div><a href={url} target="_blank" rel="noreferrer">{new URL(url).hostname}<span className="sr-only"> (opens in a new tab)</span></a></div>
              <div className="status-result" title={unavailable ? "Monitoring service unavailable" : result?.detail}><span>{status ? labels[status] : "Checking"}</span><span>{!unavailable && result?.latency != null ? `${result.latency} ms` : "—"}</span></div>
              <div className="status-history" role="img" aria-label={`${title}: ${history.length} recent checks; ${history.map((check) => labels[check.status]).join(", ") || "no completed checks"}`}>
                {Array.from({ length: 24 - history.length }, (_, index) => <span className="status-bar" key={`empty-${index}`} aria-hidden="true" />)}
                {history.map((check) => <span key={check.checkedAt} className={`status-bar status-${check.status}`} title={`${new Date(check.checkedAt).toLocaleTimeString()}: ${labels[check.status]} — ${check.detail}`} aria-hidden="true" />)}
              </div>
              <span className="status-percentage" aria-label={`${title} successful checks this visit`}>{visit?.completed ? `${(100 * visit.passed / visit.completed).toFixed(1)}%` : "—"}</span>
            </li>;
          })}
        </ul>
        <p className="status-note">Percentage = successful checks this page visit, including slow responses. Unknown checks are excluded. Slow: 3 seconds or more; timeout: 20 seconds. Times are measured from the monitoring server. Neutral bars have no result or an unavailable result.</p>
      </div>
      <noscript><p>Enable JavaScript to run availability checks.</p></noscript>
    </section>
  );
}
