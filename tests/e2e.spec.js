// End-to-end tests for the Livigno website (Playwright).
// Each test is one acceptance criterion from PRD.md, written as "When … then …".
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const BASE_PAGES = ["index.html", "summer.html", "winter.html", "food.html", "plan.html", "sources.html", "accessibility.html"];
// English (default) + Italian + German versions of every page
const PAGES = BASE_PAGES.flatMap((f) => [f, f.replace(".html", "-it.html"), f.replace(".html", "-de.html")]);
const AUTHORS = ["Magadeline Ndlovu", "Sobin Karakkunnummel", "Gayathri Devi Shalini Dileep", "Monika Tasheva"];

// The tests must not depend on outside services: answer the weather API and the map ourselves.
test.beforeEach(async ({ page }) => {
  await page.route("https://api.open-meteo.com/**", (route) => route.fulfill({
    contentType: "application/json",
    body: JSON.stringify({
      current: { time: "2026-11-12T10:00", temperature_2m: -3.2, snowfall: 0.4, snow_depth: 0.42, wind_speed_10m: 6.1 },
      current_units: { temperature_2m: "°C", snowfall: "cm", wind_speed_10m: "km/h" },
    }),
  }));
  await page.route("https://www.openstreetmap.org/**", (route) => route.fulfill({ contentType: "text/html", body: "<!doctype html><title>map</title>" }));
});

test.describe("Every page", () => {
  for (const file of PAGES) {
    test(`${file}: when it opens, then there are no console errors, one h1 and the student notice`, async ({ page }) => {
      const errors = [];
      page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
      page.on("pageerror", (e) => errors.push(e.message));
      await page.goto(file);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("header .notice")).toContainText(file.includes("-it.") ? "Progetto studentesco" : file.includes("-de.") ? "Studentenprojekt" : "Student project");
      expect(errors).toEqual([]);
    });

    test(`${file}: when checked with axe, then there are 0 WCAG 2.2 A/AA or best-practice violations`, async ({ page }) => {
      await page.goto(file);
      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag21a", "wcag2aa", "wcag21aa", "wcag22aa", "best-practice"]).analyze();
      expect(results.violations.map((v) => v.id)).toEqual([]);
    });
  }

  test("when a page does not exist, then the 404 page with links is shown", async ({ page }) => {
    const response = await page.goto("no-such-page.html");
    expect(response.status()).toBe(404);
    await expect(page.locator("h1")).toContainText(/not found/i);
  });
});

test("Home: when it opens, then all four authors are named", async ({ page }) => {
  await page.goto("index.html");
  for (const name of AUTHORS) await expect(page.locator("footer")).toContainText(name);
});

test("Navigation: when I click Summer in the menu, then the Summer page opens", async ({ page }) => {
  await page.goto("index.html");
  await page.locator("nav a[href='summer.html']").first().click();
  await expect(page).toHaveURL(/summer\.html$/);
  await expect(page.locator("nav a[aria-current='page']").first()).toHaveAttribute("href", "summer.html");
});

test.describe("Summer trails (AJAX)", () => {
  test("when I choose the Hiking chip, then only hiking trails are shown", async ({ page }) => {
    await page.goto("summer.html");
    await expect(page.locator("[data-trail-status]")).toContainText("6 of 6");
    await page.getByRole("button", { name: "Hiking", exact: true }).click();
    const metas = await page.locator("[data-trail-list] .meta").allTextContents();
    expect(metas.length).toBeGreaterThan(0);
    for (const m of metas) expect(m).toContain("Hiking");
  });

  test("when no trail matches the search, then a 'Clear filters' button brings all trails back", async ({ page }) => {
    await page.goto("summer.html");
    await page.locator("#trail-search").fill("xyz");
    await expect(page.locator("[data-trail-list] article")).toHaveCount(0);
    await page.getByRole("button", { name: "Clear filters" }).click();
    await expect(page.locator("[data-trail-list] article")).toHaveCount(6);
  });

  test("when I save a trail, then it appears in Plan my day and stays after a reload", async ({ page }) => {
    await page.goto("summer.html");
    const first = page.locator("[data-trail-list] article").first();
    const name = await first.locator("h3").textContent();
    await first.getByRole("button", { name: /^Save/ }).click();
    await expect(page.locator("[data-plan-list]")).toContainText(name);
    await page.reload();
    await expect(page.locator("[data-plan-list]")).toContainText(name);
  });
});

test("Winter: when the weather API answers, then values and an 'Updated' time are shown", async ({ page }) => {
  await page.goto("winter.html");
  await expect(page.locator("[data-w='temperature']")).toContainText("-3.2");
  await expect(page.locator("[data-w='updated']")).toContainText("Updated");
});

test.describe("Plan page", () => {
  test("when I open plan.html#tab-events, then the Events tab is selected and shows 6 events", async ({ page }) => {
    await page.goto("plan.html#tab-events");
    await expect(page.locator("#tab-events")).toHaveAttribute("aria-selected", "true");
    await expect(page.locator("#panel-events .h-event")).toHaveCount(6);
  });

  test("when I press the right arrow on a tab, then the next tab is selected and focused", async ({ page }) => {
    await page.goto("plan.html");
    await page.locator("#tab-travel").focus();
    await page.keyboard.press("ArrowRight");
    await expect(page.locator("#tab-stay")).toHaveAttribute("aria-selected", "true");
    await expect(page.locator("#tab-stay")).toBeFocused();
    await expect(page.locator("#panel-travel")).toBeHidden();
  });

  test("when I send the empty contact form, then errors show and focus moves to the first field", async ({ page }) => {
    await page.goto("plan.html");
    await page.locator("[data-contact-form] button[type=submit]").click();
    await expect(page.locator("#name")).toHaveAttribute("aria-invalid", "true");
    await expect(page.locator("#name-error")).not.toBeEmpty();
    await expect(page.locator("#name")).toBeFocused();
  });

  test("when I fill in the contact form correctly, then a thank-you message appears", async ({ page }) => {
    await page.goto("plan.html");
    await page.locator("#name").fill("Anna");
    await page.locator("#email").fill("anna@example.com");
    await page.locator("#message").fill("Is the bike park open in June?");
    await page.locator("label[for=privacy]").click();
    await page.locator("[data-contact-form] button[type=submit]").click();
    await expect(page.locator("[data-form-status]")).toContainText("Thank you, Anna");
  });
});

test.describe("Without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("when JavaScript is off, then all tab sections, trails and events are still readable", async ({ page }) => {
    await page.goto("plan.html");
    for (const id of ["panel-travel", "panel-stay", "panel-events", "panel-faq"]) await expect(page.locator(`#${id}`)).toBeVisible();
    await expect(page.locator("#panel-events .h-event")).toHaveCount(6);
    await page.goto("summer.html");
    await expect(page.locator("[data-trail-list] article")).toHaveCount(6);
    await page.goto("food.html");
    await expect(page.locator("#panel-shop")).toBeVisible();
  });
});

test.describe("Layout", () => {
  // 320 px = WCAG 1.4.10 Reflow (also what 1280 px at 400 % zoom gives); 640 px = 200 % zoom.
  for (const width of [320, 360, 600, 640, 840, 1024, 1280]) {
    test(`when the window is ${width} px wide, then no page in any language scrolls sideways`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      for (const file of PAGES) {
        await page.goto(file);
        const scroll = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(scroll, file).toBeLessThanOrEqual(0);
      }
    });
  }
});

test.describe("Languages", () => {
  test("when I choose IT in the language switch, then the same page opens in Italian", async ({ page }) => {
    await page.goto("summer.html");
    await page.locator(".lang-switch a[hreflang='it']").click();
    await expect(page).toHaveURL(/summer-it\.html$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "it");
    await expect(page.locator("h1")).toHaveText("Estate a Livigno");
    await expect(page.locator(".lang-switch a[aria-current='true']")).toHaveAttribute("hreflang", "it");
  });

  test("when the Italian trails load with JavaScript, then filters and messages are in Italian", async ({ page }) => {
    await page.goto("summer-it.html");
    await expect(page.locator("[data-trail-status]")).toHaveText("6 di 6 percorsi mostrati.");
    await page.getByRole("button", { name: "Escursionismo", exact: true }).click();
    for (const m of await page.locator("[data-trail-list] .meta").allTextContents()) expect(m).toContain("Escursionismo");
  });

  test("when I send the empty form on the German page, then the errors are in German", async ({ page }) => {
    await page.goto("plan-de.html");
    await page.locator("[data-contact-form] button[type=submit]").click();
    await expect(page.locator("#name-error")).toHaveText("Bitte gib deinen Namen ein.");
  });

  test("when I open the English home page, then English is the default and links to IT and DE exist", async ({ page }) => {
    await page.goto("index.html");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("link[rel=alternate][hreflang=it]")).toHaveAttribute("href", /index-it\.html$/);
    await expect(page.locator("link[rel=alternate][hreflang=de]")).toHaveAttribute("href", /index-de\.html$/);
  });
});

test.describe("Keyboard", () => {
  // reduced motion: no smooth scrolling, so each check sees the final position
  test.use({ reducedMotion: "reduce" });
  for (const file of ["index.html", "summer.html", "plan.html", "plan-de.html"]) {
    test(`${file}: when I press Tab through the page, then every focused element is visible, outlined and not under the sticky menu`, async ({ page }) => {
      await page.goto(file);
      const seen = new Set();
      for (let i = 0; i < 60; i++) {
        await page.keyboard.press("Tab");
        const f = await page.evaluate(() => {
          const el = document.activeElement;
          if (!el || el === document.body) return null;
          const r = el.getBoundingClientRect();
          const cs = getComputedStyle(el);
          // WCAG 2.4.11: the element on top at the centre of the focused element must be the element itself (not the sticky menu).
          // (for tall elements such as a tab panel: the centre of the part that is inside the window)
          const y1 = Math.max(r.top, 0), y2 = Math.min(r.bottom, innerHeight);
          const top = r.width && r.height && y2 > y1 ? document.elementFromPoint(r.left + r.width / 2, (y1 + y2) / 2) : null;
          return {
            id: el.outerHTML.slice(0, 80),
            // a 2 px+ outline, or (text fields) a 2 px+ coloured border
            outline: (cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) >= 2) || parseFloat(cs.borderTopWidth) >= 2,
            visible: r.width > 0 && r.height > 0,
            hidden: !top || !(el === top || el.contains(top) || top.contains(el) && top.tagName === "LABEL" || el.labels && [...el.labels].includes(top)),
            inFrame: el.tagName === "IFRAME",
            topEl: top ? top.outerHTML.slice(0, 60) + " y=" + Math.round(r.top) + ".." + Math.round(r.bottom) + " vh=" + innerHeight : "none",
          };
        });
        if (!f) break;
        if (seen.has(f.id)) break;
        seen.add(f.id);
        if (f.inFrame) continue;
        expect(f.visible, f.id).toBe(true);
        expect(f.outline, `focus outline: ${f.id}`).toBe(true);
        expect(f.hidden, `hidden behind menu: ${f.id} -- on top: ${f.topEl}`).toBe(false);
      }
      expect(seen.size).toBeGreaterThan(5);
    });
  }

  test("when I press Tab once on a page, then the first stop is the 'Skip to main content' link and it works", async ({ page }) => {
    await page.goto("summer.html");
    await page.keyboard.press("Tab");
    const link = page.locator(":focus");
    await expect(link).toHaveAttribute("href", "#main");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#main$/);
  });
});

test("Text spacing: when letter, word and line spacing are increased (WCAG 1.4.12), then no page scrolls sideways", async ({ page }) => {
  for (const file of BASE_PAGES) {
    await page.goto(file);
    await page.addStyleTag({ content: "* { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; } p { margin-bottom: 2em !important; }" });
    const scroll = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(scroll, file).toBeLessThanOrEqual(0);
  }
});
