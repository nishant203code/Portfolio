import { expect, test } from "@playwright/test";
import { monitoredProjects, type HealthStatus } from "../src/content/status";
import { GET } from "../src/app/api/status/route";

test("server checks fixed targets, classifies results, and shares cached checks", async () => {
  const originalFetch = globalThis.fetch;
  const calls: string[] = [];
  globalThis.fetch = async (input, options) => {
    const url = String(input);
    calls.push(url);
    expect(options?.redirect).toBe("manual");
    expect(options?.signal).toBeInstanceOf(AbortSignal);
    const index = monitoredProjects.findIndex((project) => project.url === url);
    if (index === 1) await new Promise((resolve) => setTimeout(resolve, 3_050));
    if (index === 3) throw new DOMException("Timeout", "TimeoutError");
    return new Response(null, { status: index === 2 ? 503 : 200 });
  };
  try {
    const request = new Request("http://localhost/api/status");
    expect((await GET(new Request("http://localhost/api/status?url=http://127.0.0.1"))).status).toBe(400);
    expect(calls).toHaveLength(0);
    const [first, simultaneous] = await Promise.all([GET(request), GET(request)]);
    const data = await first.json();
    expect(data.checks.map((check: { status: string }) => check.status)).toEqual(["operational", "degraded", "down", "unavailable"]);
    expect(data.checks[1].latency).toBeGreaterThanOrEqual(3_000);
    expect(data.checks[3].latency).toBeNull();
    expect(data.checks[3].detail).toContain("Timed out");
    expect(await simultaneous.json()).toEqual(data);
    expect(await (await GET(request)).json()).toEqual(data);
    expect(calls).toEqual(monitoredProjects.map(({ url }) => url));
  } finally { globalThis.fetch = originalFetch; }
});

test("visit history uses real samples, counts slow success, and excludes unknown checks", async ({ page }) => {
  await page.clock.install();
  let sample = 0;
  let requests = 0;
  let broken = false;
  const states: HealthStatus[][] = [
    ["operational", "degraded", "operational", "unavailable"],
    ["down", "operational", "operational", "operational"],
  ];
  await page.route("**/api/status", (route) => {
    requests++;
    if (broken) return route.fulfill({ status: 503, body: "Unavailable" });
    return route.fulfill({ json: { checks: monitoredProjects.map(({ slug }, index) => ({ slug, status: states[sample][index], latency: index === 1 ? 3500 : 100, checkedAt: new Date(1_800_000_000_000 + sample * 30_000).toISOString(), detail: "Test HTTP response" })) } });
  });
  await page.goto("/");
  const status = page.locator(".system-status");
  await expect(status.getByRole("status")).toHaveText("Status unavailable");
  await expect(status.locator(".status-percentage")).toHaveText(["100.0%", "100.0%", "100.0%", "—"]);
  await expect(status.locator(".status-row").first().locator(".status-bar.status-operational")).toHaveCount(1);
  await page.clock.runFor(30_000);
  await expect.poll(() => requests).toBe(2);
  await expect(status.locator(".status-row").first().locator(".status-bar.status-operational")).toHaveCount(1);
  sample = 1;
  await page.clock.runFor(30_000);
  await expect(status.getByRole("status")).toHaveText("One or more systems down");
  await expect(status.locator(".status-percentage")).toHaveText(["50.0%", "100.0%", "100.0%", "100.0%"]);
  broken = true;
  await page.clock.runFor(30_000);
  await expect(status.getByRole("status")).toHaveText("Status unavailable");
  await expect(status.locator(".status-result").first()).toHaveText("Unavailable—");
  await expect(status.locator(".status-percentage").first()).toHaveText("50.0%");
  await page.evaluate(() => { Object.defineProperty(document, "hidden", { configurable: true, value: true }); document.dispatchEvent(new Event("visibilitychange")); });
  const before = requests;
  await page.clock.runFor(60_000);
  expect(requests).toBe(before);
  await page.evaluate(() => { Object.defineProperty(document, "hidden", { configurable: true, value: false }); document.dispatchEvent(new Event("visibilitychange")); });
  await expect.poll(() => requests).toBe(before + 1);
  await page.getByRole("link", { name: "All 9 projects" }).click();
  await expect(page).toHaveURL("/projects");
  const after = requests;
  await page.clock.runFor(60_000);
  expect(requests).toBe(after);
});

test("pending checks do not claim success or overlap", async ({ page }) => {
  await page.clock.install();
  let requests = 0;
  await page.route("**/api/status", () => { requests++; });
  await page.goto("/");
  await expect(page.locator(".status-summary").getByRole("status")).toHaveText("Checking systems…");
  await expect(page.locator(".status-percentage")).toHaveText(["—", "—", "—", "—"]);
  await page.clock.runFor(24_000);
  expect(requests).toBe(1);
  await page.clock.runFor(2_000);
  await expect(page.locator(".status-summary").getByRole("status")).toHaveText("Status unavailable");
  expect(requests).toBe(1);
});

test("history stays bounded while percentages retain the full visit", async ({ page }) => {
  await page.clock.install();
  let sample = 0;
  await page.route("**/api/status", (route) => {
    const current = sample++;
    return route.fulfill({ json: { checks: monitoredProjects.map(({ slug }, index) => ({
      slug, status: index === 0 && current === 0 ? "down" : index === 0 && current === 1 ? "degraded" : "operational",
      latency: current === 1 ? 3500 : 100, checkedAt: new Date(1_800_000_000_000 + current * 30_000).toISOString(), detail: "Test HTTP response",
    })) } });
  });
  await page.goto("/");
  const summary = page.locator(".status-summary").getByRole("status");
  const first = page.locator(".status-row").first();
  await expect(summary).toHaveText("One or more systems down");
  await page.clock.runFor(30_000);
  await expect(summary).toHaveText("Some systems experiencing issues");
  for (let count = 3; count <= 25; count++) {
    await page.clock.runFor(30_000);
    await expect(first.locator(".status-percentage")).toHaveText(`${(100 * (count - 1) / count).toFixed(1)}%`);
  }
  await expect(summary).toHaveText("All systems operational");
  await expect(first.locator(".status-bar")).toHaveCount(24);
  await expect(first.locator(".status-bar.status-down")).toHaveCount(0);
  await expect(first.locator(".status-percentage")).toHaveText("96.0%");
});
