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
| Page not found | `404.html` |

## How the Part 2 requirements are met

| Requirement | How | Where |
|---|---|---|
| Based on the Part 1 prototype | Same 5 pages, menu, components and layouts as the Part 1 wireframes | all pages |
| Fully responsive (mobile, tablet, desktop) | Material Design 3 window size classes: navigation bar at the bottom (< 600 px), navigation rail (600–839 px), top bar with horizontal tabs (≥ 840 px) | `css/style.css` (media queries) |
| WCAG 2.1 level A | Skip link, landmarks, one `h1` per page, alt text, labels on all form fields, visible focus, keyboard tabs, errors next to the field, `prefers-reduced-motion`. Tested with axe-core: **0 violations** (WCAG 2.0/2.1 A and AA) on 7 pages × 3 sizes | all pages |
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

## Project structure

```text
index.html, summer.html, winter.html, food.html, plan.html, sources.html, 404.html
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

## Notes

- Events and trails are **sample data** and are marked as such on the pages.
- No ski pass prices are copied, because they change every season; the site links to the official site.
- Photos: save them in `img/photos/` with the exact file names from `data/photos.json` (about 1600 px wide, under 300 KB). Fill in author, licence and link in `data/photos.json` and run `node src/build.mjs` – the credits table on `sources.html` updates itself. Until then, labelled placeholder drawings are shown.
- If the site is published somewhere other than `https://livigno-explorers.github.io/livigno/`, change `SITE` in `src/build.mjs` and rebuild (used for canonical links and the sitemap).
