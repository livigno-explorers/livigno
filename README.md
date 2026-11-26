# Livigno – mountain adventure all year round

Regional tourism website for Livigno (Italian Alps). Student project – for teaching purposes only.
Course: Internet Technologies – Client Side, Czech University of Life Sciences Prague, 2026.

**Authors:** Magadeline Ndlovu, Sobin Karakkunnummel, Gayathri Devi Shalini Dileep, Monika Tasheva

## How to open it

The pages load data with `fetch()`, so open them through a small web server (not by double-clicking):

```sh
npx serve          # or: python -m http.server
```

Then open the address it prints (for example http://localhost:3000).

## Pages

| Page | File |
|---|---|
| Home | `index.html` |
| Summer | `summer.html` |
| Winter | `winter.html` |
| Food & local | `food.html` |
| Plan your visit | `plan.html` |
| Sources & image credits | `sources.html` |
| Accessibility statement | `accessibility.html` |
| Page not found | `404.html` |

## How the Part 2 requirements are met

| Requirement | How | Where |
|---|---|---|
| Based on the Part 1 prototype | Same 5 pages, menu, components and layouts as the Part 1 wireframes | all pages |
| Fully responsive (mobile, tablet, desktop) | Material Design 3 window size classes: navigation bar at the bottom (< 600 px), navigation rail (600–839 px), top bar with horizontal tabs (≥ 840 px) | `css/style.css` (media queries) |
| WCAG 2.1 level A (we aimed for AA) | Skip link, landmarks, one `h1` per page, alt text, labels on all form fields, visible focus that is never hidden under the sticky menu, keyboard tabs, errors next to the field, contrast ≥ 4.5:1 also on photos, works at 320 px / 400 % zoom, `prefers-reduced-motion`. Tested: axe-core WCAG 2.2 AA + best practices **0 violations** (24 pages × 3 sizes), pa11y/HTML_CodeSniffer AA **0 errors**, Lighthouse accessibility **100**, keyboard tests in `npm test`. Details: `accessibility.html` | all pages |
| HTML5 + WAI-ARIA | `header`, `nav`, `main`, `footer`, `section`, `article`, `time`; ARIA tabs pattern (`role="tablist/tab/tabpanel"`, `aria-selected`, arrow keys), `aria-current="page"`, `aria-pressed` on chips and segmented buttons, `aria-live` status messages, `aria-invalid` + `aria-describedby` in the form | `js/main.js`, `js/contact.js` |
| Valid HTML5 and CSS3 | Checked with html-validate (0 errors) and stylelint (0 errors). Before submitting, also check with https://validator.w3.org and https://jigsaw.w3.org/css-validator/ | – |
| Flex and Grid | **Grid:** page sections, card grids, `.split` layout, footer, carousel. **Flexbox:** app bar, navigation, chips, buttons, lists, card actions | `css/style.css` |
| Fast web pages | No frameworks, no web fonts, compressed JPG photos with `width`/`height`, `fetchpriority` on the main photo, `loading="lazy"`, ES modules (deferred), `preconnect` to the weather API. HTML + CSS + JS ≈ 30 KB per page; photos are lazy-loaded. Check again with Lighthouse after the real photos are added | – |
| AJAX + back-end preparation | All requests go through `js/api.js` (`getJSON`, `postJSON`). Trails and events are loaded from `data/*.json`; next semester only `API_BASE` changes to the back end. The contact form already calls `postJSON` when `ENDPOINTS.contact` is set | `js/api.js`, `js/trails.js`, `js/events.js`, `js/contact.js` |
| Third-party APIs | **Open-Meteo** weather API (live temperature, snow depth, new snow, wind, "Updated" time) and **OpenStreetMap** map embeds | `js/weather.js`, `summer.html`, `plan.html` |
| Technical SEO | Unique `title` and `meta description` per page, one `h1`, `canonical`, Open Graph tags, `lang="en"`, clean file names, `sitemap.xml`, `robots.txt`, schema.org JSON-LD (TouristDestination) on the home page, 404 page | all pages |
| 2 microformats | **hCalendar (h-event):** events on Home (static) and Plan → Events (loaded with fetch). **hCard (h-card):** tourist information in the footer of every page (with h-adr and h-geo) | `index.html`, `js/events.js`, footer |
| Authors on the first page | Footer of the home page (and every page) | footer |
| Student-project notice in the header | First line of the header on every page | header |

## Usability heuristics from Part 1 – fixed

- FAQ added (Plan your visit → FAQ).
- Snow card shows **"Updated: date, time"**.
- Error states built: form errors, "no trail matches → Clear filters", "data not available" messages.
- Outlined text fields with **floating labels** (the label no longer disappears).
- **404 page** with links to the main sections.

## Tests (end-to-end)

```sh
npm install                      # @playwright/test + @axe-core/playwright (pinned versions)
npx playwright install chromium  # once
npm test                         # 142 tests (desktop + mobile, all 3 languages)
```

The tests check every acceptance criterion in `PRD.md`: no console errors, one `h1`, the student notice,
0 axe (WCAG 2.2 AA + best practices) violations on every page, keyboard (every focus visible, never under the
sticky menu, skip link works), no sideways scrolling from 320 px and with bigger text spacing, navigation, trail filters, "Plan my day", weather API
(answered by the test, no network needed), tabs with arrow keys, form validation, and the site with
JavaScript turned off. Plan: `PRD.md` · Definition of Done: `DoD.md` · Reflection: `REFLECTION.md`.

## Languages

English is the default (`index.html`, `summer.html`, …). Italian and German versions are built next to them
(`index-it.html`, `index-de.html`, …) from the dictionaries in `src/i18n/pages.it.json` and `src/i18n/pages.de.json`;
texts written by JavaScript are in `js/i18n.js`. The header has an EN / IT / DE switch, and every page lists its
other languages with `<link rel="alternate" hreflang>`. `node src/build.mjs` stops with a list if any text has no translation.

## Works without JavaScript

All content is in the HTML. JavaScript only adds features (filters, tabs, weather, form).
With JavaScript off, every tab section is shown with its own heading, and trails and events are listed.
Screen readers use JavaScript normally, so they get the full interactive version with ARIA.

## Project structure

```text
index.html, summer.html, winter.html, food.html, plan.html, sources.html, accessibility.html, 404.html
*-it.html, *-de.html  Italian and German versions (built)
css/style.css        design (Material Design 3 tokens, responsive)
js/api.js            all data requests (AJAX) + API addresses
js/main.js           tabs, segmented buttons (all pages)
js/trails.js         Summer: trails, search, filters, "Plan my day" (localStorage)
js/weather.js        Winter: Open-Meteo weather API
js/events.js         Plan: events list (h-event)
js/contact.js        Plan: contact form validation
data/                trails.json, events.json (sample data), photos.json (photo credits)
img/logo.svg         logo, drawn by the authors
img/photos/*.jpg     photos (list + credits in data/photos.json → shown on sources.html)
src/                 build script: generates the HTML pages from shared header/footer
sitemap.xml, robots.txt
```

To change the shared header or footer, edit `src/build.mjs` and run `node src/build.mjs`.

## How we worked

We planned in small increments (`PRD.md`), agreed on one Definition of Done (`DoD.md`) and checked every increment
against it before committing. We also used an AI coding assistant to draft code and texts; every change was reviewed,
tested and, where needed, corrected by us – see `REFLECTION.md` for the bugs our checks caught.

## Notes

- Events and trails are **sample data** and are marked as such on the pages.
- No ski pass prices are copied, because they change every season; the site links to the official site.
- Photos: save them in `img/photos/` with the exact file names from `data/photos.json` (about 1600 px wide, under 300 KB). Fill in author, licence and link in `data/photos.json` and run `node src/build.mjs` – the credits table on `sources.html` updates itself. Until then, labelled placeholder drawings are shown.
- If the site is published somewhere other than `https://livigno-explorers.github.io/livigno/`, change `SITE` in `src/build.mjs` and rebuild (used for canonical links and the sitemap).
