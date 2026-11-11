import { checkTimeout, monitoredProjects, slowThreshold, type HealthCheck } from "@/content/status";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

let cached: { expires: number; checks: HealthCheck[] } | undefined;
let pending: Promise<HealthCheck[]> | undefined;

async function checkSite({ slug, url }: (typeof monitoredProjects)[number]): Promise<HealthCheck> {
  const start = performance.now();
  try {
    // Targets come only from project content. Never follow redirects to other hosts.
    const response = await fetch(url, {
      method: "GET", redirect: "manual", cache: "no-store",
      signal: AbortSignal.timeout(checkTimeout),
    });
    const latency = Math.round(performance.now() - start);
    await response.body?.cancel();
    const status = response.ok ? (latency >= slowThreshold ? "degraded" : "operational")
      : response.status >= 300 && response.status < 400 || [401, 403, 429].includes(response.status) ? "unavailable" : "down";
    return { slug, status, latency, checkedAt: new Date().toISOString(), detail: `HTTP ${response.status}` };
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "TimeoutError";
    return { slug, status: "unavailable", latency: null, checkedAt: new Date().toISOString(), detail: timedOut ? "Timed out after 20 seconds; a cold start may be responsible" : "Could not establish reachability from the monitoring server" };
  }
}

export async function GET(request: Request) {
  if (new URL(request.url).search) return Response.json({ error: "Query parameters are not supported" }, { status: 400 });
  if (!cached || cached.expires <= Date.now()) {
    if (!pending) {
      pending = Promise.all(monitoredProjects.map(checkSite)).then((checks) => {
        cached = { checks, expires: Date.now() + 25_000 };
        return checks;
      }).finally(() => { pending = undefined; });
    }
    await pending;
  }
  return Response.json({ checks: cached!.checks }, { headers: { "Cache-Control": "no-store" } });
}
