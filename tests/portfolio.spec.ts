import { expect, test } from "@playwright/test";
import { projects } from "../src/content/projects";
import { profile } from "../src/content/profile";

test.beforeEach(async ({ page }) => {
  await page.route("**/api/status", (route) => route.fulfill({ json: { checks: projects.filter(({ liveUrl }) => liveUrl).map(({ slug }) => ({ slug, status: "operational", latency: 100, checkedAt: "2026-11-11T12:00:00.000Z", detail: "HTTP 200" })) } }));
});

for (const theme of ["dark", "light"] as const) {
  for (const width of [320, 360, 768, 1440]) {
    test(`${theme} layout at ${width}px`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
      await page.setViewportSize({ width, height: 1000 });
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto("/");
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      await expect(page.getByRole("heading", { name: "Nishant Porwal", exact: true })).toBeVisible();
      await expect(page.locator("main h2")).toHaveText(["Curious about how things work.", "Experience", "Project Works", "Research", "System Status", /Let’s build something/]);
      await expect(page.locator("#work .project-card h3")).toHaveText(projects.slice(0, 4).map((project) => project.title));
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
      if (width === 1440) {
        const edges = await page.locator(".brand, .hero, .about-card").evaluateAll((els) => els.map((el) => el.getBoundingClientRect().left));
        expect(new Set(edges).size).toBe(1);
        await expect(page.getByRole("navigation", { name: "Main navigation" })).toBeVisible();
      } else {
        await expect(page.getByRole("button", { name: "Open navigation" })).toBeVisible();
      }
      for (const img of await page.locator("main img").all()) {
        await img.scrollIntoViewIfNeeded();
        await expect(img).toHaveJSProperty("complete", true);
      }
      expect(errors).toEqual([]);
    });
  }
}

test("theme preference survives reloads and route changes", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  await page.getByRole("button", { name: "Switch to light mode" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.getByRole("link", { name: `All ${projects.length} projects` }).click();
  await expect(page).toHaveURL("/projects");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

test("mobile menu supports keyboard, escape, and anchor navigation", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/");
  const menu = page.getByRole("button", { name: "Open navigation" });
  await menu.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("button", { name: "Close navigation" })).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "About", exact: true })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(menu).toBeFocused();
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await menu.click();
  await page.getByRole("navigation").getByRole("link", { name: "Projects", exact: true }).click();
  await expect(page).toHaveURL(/#work$/);
  await expect(menu).toHaveAttribute("aria-expanded", "false");
});

test("touch navigation and case-study links work without hover", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, viewport: { width: 360, height: 800 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await page.goto("/");
  await page.getByRole("button", { name: "Open navigation" }).tap();
  await page.getByRole("navigation").getByRole("link", { name: "Projects", exact: true }).tap();
  await page.getByRole("link", { name: "Explore PeerLink project" }).tap();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("PeerLink");
  await context.close();
});

test("all routes, repository links, and resume are real destinations", async ({ page, request }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: /View resume/ }))
    .toHaveAttribute("href", profile.resumeUrl);
  await expect(page.getByRole("navigation").getByRole("link", { name: /Resume/ }))
    .toHaveAttribute("href", profile.resumeUrl);
  await page.goto("/projects");
  await expect(page.locator(".project-card")).toHaveCount(9);
  expect(new Set(projects.map(({ slug }) => slug)).size).toBe(9);
  expect(new Set(projects.map(({ repo }) => repo)).size).toBe(9);
  for (const project of projects) {
    const card = page.locator(`.project-card.project-${project.slug}`);
    const liveLink = card.getByRole("link", { name: /live site/ });
    if (project.liveUrl) await expect(liveLink).toHaveAttribute("href", project.liveUrl);
    else await expect(liveLink).toHaveCount(0);
  }
  for (const project of projects) {
    await page.goto(`/projects/${project.slug}`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(project.title);
    await expect(page.getByRole("link", { name: /GitHub/ }).first()).toHaveAttribute("href", project.repo);
    await expect(page.locator(".case-section")).toHaveCount(6);
    await expect(page).toHaveTitle(new RegExp(project.title));
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", project.summary);
  }
  await page.goto("/about");
  await expect(page.getByRole("heading", { name: "Beyond the code" })).toBeVisible();
  await expect(page.locator('.social-links a[href="mailto:nishantporwal203@gmail.com"]')).toBeVisible();
  expect((await request.get("/projects/not-a-project")).status()).toBe(404);
  expect((await request.get("/opengraph-image")).headers()["content-type"]).toContain("image/png");
});

test("case studies and index do not overflow on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  for (const path of ["/about", "/projects", ...projects.map(({ slug }) => `/projects/${slug}`)]) {
    await page.goto(path);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), path).toBeTruthy();
    for (const img of await page.locator("main img").all()) {
      await img.scrollIntoViewIfNeeded();
      await expect(img).toHaveJSProperty("complete", true);
      expect(await img.evaluate((el) => (el as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    }
  }
});

test("reduced motion, skip link, and JavaScript-free content", async ({ page, browser }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  expect(await page.locator("html").evaluate((el) => getComputedStyle(el).scrollBehavior)).toBe("auto");
  await page.locator("#work").scrollIntoViewIfNeeded();
  expect(await page.locator(".project-cell").first().evaluate((el) => getComputedStyle(el).transform)).toBe("none");
  const context = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await context.newPage();
  await staticPage.goto("/");
  await expect(staticPage.getByRole("heading", { level: 1 })).toHaveText("Nishant Porwal");
  await expect(staticPage.locator(".project-card")).toHaveCount(4);
  await context.close();
});
