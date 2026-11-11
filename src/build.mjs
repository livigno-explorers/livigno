// Builds the static pages of the Livigno website from shared parts (header, navigation, footer).
// Run:  node src/build.mjs   – the output is plain HTML in the project root (no server-side code needed).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { logo } from "./illustrations.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://selinah3005.github.io/livigno/"; // change if the site is published elsewhere
const AUTHORS = ["Magadeline Ndlovu", "Sobin Karakkunnummel", "Gayathri Devi Shalini Dileep", "Monika Tasheva"];

// ---------- icons (simple, drawn by us) ----------
const icon = {
  home: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 2 11h3v9h5v-6h4v6h5v-9h3z"/></svg>',
  summer: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M11 1h2v4h-2zM11 19h2v4h-2zM1 11h4v2H1zM19 11h4v2h-4zM4.2 5.6l1.4-1.4 2.8 2.8-1.4 1.4zM15.6 17l1.4-1.4 2.8 2.8-1.4 1.4zM4.2 18.4 7 15.6 8.4 17l-2.8 2.8zM15.6 7 18.4 4.2l1.4 1.4L17 8.4z"/></svg>',
  winter: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 1h2v22h-2z"/><path d="M2.3 6.5l1-1.7 18.4 12.7-1 1.7z"/><path d="M20.7 4.8l1 1.7L3.3 19.2l-1-1.7z"/><path d="M8.5 2.5 12 6l3.5-3.5 1.4 1.4L12 8.8 7.1 3.9zM8.5 21.5 12 18l3.5 3.5 1.4-1.4L12 15.2l-4.9 4.9z"/></svg>',
  food: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 2h2v7a2 2 0 0 1-1 1.7V22H6V10.7A2 2 0 0 1 5 9V2h2v6h0zM3 2h2v7H3zM9 2h2v7H9zM16 2c2.8 0 4 3 4 7 0 2-1 3-2 3.5V22h-2z"/></svg>',
  plan: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 4 9 2 3 4v18l6-2 6 2 6-2V2zM9 4.2l6 2v13.6l-6-2z"/></svg>',
  search: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 3a7 7 0 0 1 5.6 11.2l5.6 5.6-1.4 1.4-5.6-5.6A7 7 0 1 1 10 3zm0 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10z"/></svg>',
  car: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 11 6.5 6.5A2 2 0 0 1 8.4 5h7.2a2 2 0 0 1 1.9 1.5L19 11a2 2 0 0 1 2 2v5h-2v2h-3v-2H8v2H5v-2H3v-5a2 2 0 0 1 2-2zm2.1 0h9.8l-1-3.2a1 1 0 0 0-1-.8H9.1a1 1 0 0 0-1 .8zM6.5 13a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm11 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/></svg>',
  bus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 2h12a2 2 0 0 1 2 2v14h-1v3h-3v-3H8v3H5v-3H4V4a2 2 0 0 1 2-2zm0 3v6h12V5zm1.5 8a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm9 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/></svg>',
  plane: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z"/></svg>',
  add: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6z"/></svg>',
  external: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3h7v7h-2V6.4l-9.3 9.3-1.4-1.4L17.6 5H14zM5 5h6v2H5v12h12v-6h2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"/></svg>',
};

const PAGES = [
  ["index.html", "Home", "Home", "home"],
  ["summer.html", "Summer", "Summer", "summer"],
  ["winter.html", "Winter", "Winter", "winter"],
  ["food.html", "Food & local", "Food", "food"],
  ["plan.html", "Plan your visit", "Plan", "plan"],
];

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function nav(current) {
  return `<nav class="main-nav" aria-label="Main">
      <ul>
${PAGES.map(([file, full, short, ic]) => `        <li><a href="${file}"${file === current ? ' aria-current="page"' : ""}><span class="ind">${icon[ic]}</span><span class="short">${esc(short)}</span><span class="full">${esc(full)}</span></a></li>`).join("\n")}
      </ul>
    </nav>`;
}

function layout({ file, title, description, body, hero = "", scripts = [], extraHead = "" }) {
  const canonical = SITE + (file === "index.html" ? "" : file);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="author" content="${esc(AUTHORS.join(", "))}">
  <meta name="theme-color" content="#2f5f7d">
  <link rel="canonical" href="${canonical}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${SITE}img/photos/hero-summer.jpg">
  <link rel="icon" href="img/logo.svg" type="image/svg+xml">
  <link rel="stylesheet" href="css/style.css">
${extraHead}${scripts.map((s) => `  <script type="module" src="js/${s}"></script>\n`).join("")}</head>
<body>
  <a class="skip-link" href="#main">Skip to main content</a>
  <header>
    <p class="notice" role="note">Student project – for teaching purposes only · CZU Prague · not an official website of Livigno</p>
    <div class="app-bar">
      <a class="brand" href="index.html"><img src="img/logo.svg" alt="" width="36" height="36">Livigno</a>
      ${nav(file)}
      <span class="spacer"></span>
      <form class="search" role="search" action="summer.html" method="get">
        <label class="visually-hidden" for="site-search">Search trails</label>
        ${icon.search}
        <input id="site-search" name="q" type="search" placeholder="Search trails">
        <button type="submit" class="visually-hidden">Search</button>
      </form>
      <a class="icon-btn search-toggle" href="summer.html#trail-search" aria-label="Search trails">${icon.search}</a>
      <a class="lang" href="${file}" hreflang="en">EN<span class="visually-hidden"> – English (current language)</span></a>
    </div>
  </header>

  <main id="main" tabindex="-1">${hero}
    <div class="page">
${body}
    </div>
  </main>

  <footer class="site-footer">
    <div class="page">
      <div>
        <h2>Livigno – mountain adventure all year round</h2>
        <p><strong>Authors:</strong> ${AUTHORS.map(esc).join(", ")}</p>
        <p>Student project for the course Internet Technologies – Client Side, Czech University of Life Sciences Prague, 2026. For teaching purposes only.</p>
      </div>
      <div class="h-card">
        <h2>Tourist information</h2>
        <p><a class="p-name u-url" href="https://www.livigno.eu/en">APT Livigno</a> (official site)</p>
        <p class="p-adr h-adr"><span class="p-locality">Livigno</span>, <span class="p-region">Lombardy</span>, <span class="p-country-name">Italy</span></p>
        <p class="p-geo h-geo">Coordinates: <span class="p-latitude">46.538</span>, <span class="p-longitude">10.135</span></p>
      </div>
      <div>
        <h2>About this site</h2>
        <ul>
          <li><a href="sources.html">Sources &amp; image credits</a></li>
          <li><a href="plan.html#contact">Contact form</a></li>
          <li><a href="sitemap.xml">Sitemap (XML)</a></li>
        </ul>
      </div>
    </div>
  </footer>
</body>
</html>
`;
}

// ---------- shared bits ----------
// Real photos live in img/photos/<name>.jpg (list + credits: data/photos.json, shown on sources.html).
const photo = (name, alt, { eager = false, w = 1200, h = 800, cls = "" } = {}) =>
  `<img${cls ? ` class="${cls}"` : ""} src="img/photos/${name}.jpg" alt="${esc(alt)}" width="${w}" height="${h}"${eager ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async">`;

// Full-width photo banner with the page title on top (first thing in <main>).
const banner = ({ image, alt, eyebrow = "", title, lead = "", extra = "", big = false, imgAttrs = "" }) => `
    <section class="photo-hero${big ? " photo-hero-big" : ""}" aria-labelledby="page-title">
      ${photo(image, alt, { eager: true, w: 1600, h: 900 }).replace("<img", `<img${imgAttrs}`)}
      <div class="hero-inner">
        ${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ""}
        <h1 id="page-title">${title}</h1>
        ${lead ? `<p class="hero-lead">${lead}</p>` : ""}${extra}
      </div>
    </section>`;

// Image-led activity tile (label on the photo, tagline, text, "Discover more").
const tile = ({ image, alt, label, tagline, text, href, season = "" }) => `
        <article class="tile"${season ? ` data-season-card="${season}"` : ""}>
          <div class="tile-media">${photo(image, alt)}<h3 class="tile-label">${esc(label)}</h3></div>
          <div class="tile-body">
            <p class="tagline">${esc(tagline)}</p>
            <p>${text}</p>
            <a class="more" href="${href}">Discover more<span class="visually-hidden"> about ${esc(label.toLowerCase())}</span> <span aria-hidden="true">→</span></a>
          </div>
        </article>`;

const card = ({ variant = "elevated", image, alt, title, meta, text, actions = "", attrs = "" }) => `
        <article class="card card-${variant}"${attrs}>
          ${photo(image, alt)}
          <div class="card-body">
            <h3>${esc(title)}</h3>
            ${meta ? `<p class="meta">${esc(meta)}</p>` : ""}
            ${text ? `<p>${text}</p>` : ""}
            ${actions ? `<div class="card-actions">${actions}</div>` : ""}
          </div>
        </article>`;

const ext = (href, label, cls = "btn btn-outlined") =>
  `<a class="${cls}" href="${href}" target="_blank" rel="noopener">${esc(label)} ${icon.external}<span class="visually-hidden"> (opens in a new tab)</span></a>`;

// Events shown on the home page as hCalendar (h-event). Same data as data/events.json.
const photos = JSON.parse(fs.readFileSync(path.join(ROOT, "data/photos.json"), "utf8"));
const events = JSON.parse(fs.readFileSync(path.join(ROOT, "data/events.json"), "utf8"));
const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
function eventItem(e) {
  const d = new Date(e.start + "T00:00:00");
  const nice = d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  return `          <li class="h-event event-card">
            <span class="date-badge" aria-hidden="true"><span class="day">${d.getDate()}</span>${MONTHS[d.getMonth()]}</span>
            <div>
              <h3 class="p-name">${esc(e.name)}</h3>
              <p class="support"><time class="dt-start" datetime="${e.start}">${nice}</time> · <span class="p-location">${esc(e.location)}</span></p>
              <p class="p-summary">${esc(e.summary)}</p>
            </div>
          </li>`;
}

// =================== PAGES ===================
const pages = {};

pages["index.html"] = layout({
  file: "index.html",
  title: "Livigno – mountain adventure all year round in the Alps",
  description: "Plan your trip to Livigno in the Italian Alps: hiking and cycling in summer, skiing and snowboarding in winter, local food and duty-free shopping.",
  scripts: ["main.js"],
  extraHead: `  <script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org", "@type": "TouristDestination", name: "Livigno",
    description: "Mountain town in the Italian Alps for summer and winter holidays.",
    geo: { "@type": "GeoCoordinates", latitude: 46.538, longitude: 10.135 },
    containedInPlace: { "@type": "AdministrativeArea", name: "Province of Sondrio, Lombardy, Italy" },
  })}</script>\n`,
  hero: banner({
    image: "hero-summer", alt: "Green Livigno valley with the lake and mountains in summer", big: true,
    imgAttrs: " data-season-hero",
    eyebrow: "Italian Alps · 1,816 m",
    title: "Livigno – mountain adventure all year round",
    lead: "A high valley close to the Swiss border. Hike and cycle in summer, ski and snowboard in winter, and enjoy local food and duty-free shopping in every season.",
    extra: `
        <div class="btn-row">
          <a class="btn btn-light" href="plan.html">Plan your trip</a>
          <a class="btn btn-ghost" href="#things-title">Things to do</a>
        </div>
        <div class="segmented on-dark" role="group" aria-label="Season" data-season-switch>
          <button type="button" aria-pressed="true" data-season="summer">Summer</button>
          <button type="button" aria-pressed="false" data-season="winter">Winter</button>
        </div>
        <p class="status" aria-live="polite" data-season-text>Summer: hiking trails, cycling routes, lakes and a bike park.</p>`,
  }),
  body: `
    <section class="stats" aria-label="Livigno in numbers">
      <dl>
        <div><dt>Above sea level</dt><dd>1,816 m</dd></div>
        <div><dt>Ski areas</dt><dd>2</dd></div>
        <div><dt>Of slopes</dt><dd>≈ 115 km</dd></div>
        <div><dt>Winter Olympics venue</dt><dd>2026</dd></div>
      </dl>
    </section>

    <section class="intro" aria-labelledby="intro-title">
      <p class="eyebrow">Welcome</p>
      <h2 id="intro-title">One valley, two seasons</h2>
      <p class="lead">Livigno lies in a wide alpine valley in Lombardy, Italy. In winter it is a ski and snowboard town with two ski areas and a snow park; in summer the same slopes become hiking trails and bike routes around the lake.</p>
    </section>

    <section aria-labelledby="things-title">
      <p class="eyebrow">Things to do</p>
      <h2 id="things-title">Choose your adventure</h2>
      <div class="grid grid-3" data-season-grid>
${tile({ image: "hiking", alt: "Hiking path through green alpine meadows", label: "Hiking", tagline: "From lake walks to high passes", text: "Easy walks along the valley and longer routes to the peaks.", href: "summer.html", season: "summer" })}
${tile({ image: "road-cycling", alt: "Road climbing to a mountain pass", label: "Road cycling", tagline: "Climb the famous passes", text: "Mountain roads and a flat cycle path along the valley floor.", href: "summer.html", season: "summer" })}
${tile({ image: "mtb", alt: "Mountain biker on a trail", label: "Mountain bike", tagline: "Flow trails and a bike park", text: "Trails for every level, from family routes to downhill lines.", href: "summer.html", season: "summer" })}
${tile({ image: "ski", alt: "Skier on a snowy slope", label: "Skiing", tagline: "Two ski areas, one valley", text: "Wide slopes for beginners and experts on both sides of the valley.", href: "winter.html", season: "winter" })}
${tile({ image: "snowpark", alt: "Snowboarder in a snow park", label: "Snowboard & snow park", tagline: "Where the Olympics jumped", text: "Jumps, rails and lines in the Livigno snow parks.", href: "winter.html", season: "winter" })}
${tile({ image: "pizzoccheri", alt: "Plate of pizzoccheri buckwheat pasta", label: "Food & local", tagline: "Taste the Valtellina", text: "Buckwheat pasta, mountain cheese and duty-free shopping.", href: "food.html" })}
      </div>
    </section>

    <section class="band" aria-labelledby="life-title">
      ${photo("village", "Houses of Livigno village below the mountains")}
      <div class="band-text">
        <p class="eyebrow">Livigno lifestyle</p>
        <h2 id="life-title">More than sport</h2>
        <p>Stop at a mountain hut for lunch, try the local dishes in the village and shop without Italian VAT.</p>
        <ul class="pills" aria-label="Explore">
          <li><a href="food.html#tab-eat">Mountain huts</a></li>
          <li><a href="food.html">Local food</a></li>
          <li><a href="food.html#tab-shop">Duty-free shopping</a></li>
          <li><a href="plan.html#tab-events">Events</a></li>
        </ul>
      </div>
    </section>

    <section aria-labelledby="events-title">
      <div class="section-head">
        <div><p class="eyebrow">What's on</p><h2 id="events-title">Upcoming events</h2></div>
        <a class="btn btn-outlined" href="plan.html#tab-events">All events</a>
      </div>
      <ul class="events-grid">
${events.slice(0, 3).map(eventItem).join("\n")}
      </ul>
      <p class="small">Sample events for the student project.</p>
    </section>

    <section class="travel" aria-labelledby="travel-title">
      ${photo("lake", "")}
      <div class="travel-text">
        <h2 id="travel-title">How to get to Livigno</h2>
        <ul class="travel-modes">
          <li>${icon.car}<span>By car</span></li>
          <li>${icon.bus}<span>By bus</span></li>
          <li>${icon.plane}<span>By plane</span></li>
        </ul>
        <a class="btn btn-light" href="plan.html#tab-travel">Plan your journey</a>
      </div>
    </section>`,
});

pages["summer.html"] = layout({
  file: "summer.html",
  title: "Summer in Livigno – hiking, cycling and mountain biking",
  description: "Find hiking trails, cycling routes and the bike park in Livigno. Filter by activity and difficulty, see the trail map and plan your day.",
  scripts: ["main.js", "trails.js"],
  hero: banner({ image: "lake", alt: "Lago di Livigno in a green valley below the mountains", eyebrow: "Summer", title: "Summer in Livigno",
    lead: "Lakes, high meadows and mountain passes. Search the trails or filter them by activity and difficulty, then save the ones you like to your day plan." }),
  body: `

    <section aria-labelledby="trails-title">
      <h2 id="trails-title">Trails</h2>
      <form class="search-bar" role="search" data-trail-form>
        <label class="visually-hidden" for="trail-search">Search trails by name</label>
        ${icon.search}
        <input id="trail-search" type="search" name="q" placeholder="Search trails and bike routes" autocomplete="off">
        <button type="submit" class="visually-hidden">Search</button>
      </form>
      <fieldset class="chips" data-filter="type">
        <legend>Activity</legend>
        <button type="button" class="chip" aria-pressed="false" data-value="hiking">Hiking</button>
        <button type="button" class="chip" aria-pressed="false" data-value="cycling">Cycling</button>
        <button type="button" class="chip" aria-pressed="false" data-value="mtb">Mountain bike</button>
      </fieldset>
      <fieldset class="chips" data-filter="level">
        <legend>Difficulty</legend>
        <button type="button" class="chip" aria-pressed="false" data-value="easy">Easy</button>
        <button type="button" class="chip" aria-pressed="false" data-value="medium">Medium</button>
        <button type="button" class="chip" aria-pressed="false" data-value="hard">Hard</button>
      </fieldset>
      <p class="status" role="status" aria-live="polite" data-trail-status>Loading trails…</p>
      <div class="grid grid-3" data-trail-list></div>
      <p class="small">Difficulty: <strong>easy</strong> – good paths, little climbing; <strong>medium</strong> – longer, some steep parts; <strong>hard</strong> – for experienced, fit visitors. Trail data is sample data for the student project and will be checked with the tourist office.</p>
      <noscript><p>Please turn on JavaScript to see and filter the trails.</p></noscript>
    </section>

    <section id="plan-my-day" aria-labelledby="day-title">
      <div class="section-head">
        <h2 id="day-title">Plan my day</h2>
        <button type="button" class="btn btn-text" data-clear-plan>Clear plan</button>
      </div>
      <ol class="list plan-list" data-plan-list></ol>
    </section>

    <section aria-labelledby="map-title">
      <h2 id="map-title">Trail map</h2>
      <iframe class="map" title="Map of the Livigno valley (OpenStreetMap)" loading="lazy"
        src="https://www.openstreetmap.org/export/embed.html?bbox=10.02%2C46.47%2C10.25%2C46.61&amp;layer=mapnik&amp;marker=46.538%2C10.135"></iframe>
      <p class="small">Map data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>.</p>
    </section>

    <p><a class="fab" href="#plan-my-day">${icon.add} Plan my day</a></p>`,
});

pages["winter.html"] = layout({
  file: "winter.html",
  title: "Winter in Livigno – skiing, snowboarding and snow report",
  description: "Skiing and snowboarding in Livigno: current weather and snow, the Carosello 3000 and Mottolino ski areas, ski schools and ski pass information.",
  scripts: ["main.js", "weather.js"],
  extraHead: '  <link rel="preconnect" href="https://api.open-meteo.com" crossorigin>\n',
  hero: banner({ image: "hero-winter", alt: "Livigno valley covered in snow", eyebrow: "Winter", title: "Winter in Livigno",
    lead: "Long winters, two ski areas and a snow park. Check the conditions, compare the options and get your ski pass.",
    extra: `
        <div class="segmented on-dark" role="group" aria-label="Winter sport" data-sport-switch>
          <button type="button" aria-pressed="true" data-sport="ski">Skiing</button>
          <button type="button" aria-pressed="false" data-sport="board">Snowboard</button>
          <button type="button" aria-pressed="false" data-sport="xc">Cross-country</button>
        </div>
        <p class="status" aria-live="polite" data-sport-text>Skiing: slopes for beginners and experts in both ski areas.</p>` }),
  body: `

    <div class="split">
      <section aria-labelledby="snow-title">
        <h2 id="snow-title">Weather and snow now</h2>
        <div class="fact weather" data-weather>
          <dl>
            <dt>Temperature</dt><dd data-w="temperature">–</dd>
            <dt>Snow depth</dt><dd data-w="snow">–</dd>
            <dt>New snow (last hour)</dt><dd data-w="snowfall">–</dd>
            <dt>Wind</dt><dd data-w="wind">–</dd>
          </dl>
          <p class="small" role="status" aria-live="polite" data-w="updated">Loading live data…</p>
        </div>
        <p class="small">Live data from the Open-Meteo weather API for the Livigno valley. Slope conditions can differ – always check the official ski area information.</p>
      </section>

      <section aria-labelledby="pass-title">
        <h2 id="pass-title">Ski pass options</h2>
        <div class="table-wrap">
          <table>
            <caption>Typical ski pass types</caption>
            <thead><tr><th scope="col">Pass</th><th scope="col">Good for</th></tr></thead>
            <tbody>
              <tr><th scope="row">1 day</th><td>A first try or a short visit</td></tr>
              <tr><th scope="row">Multi-day</th><td>A ski week, usually cheaper per day</td></tr>
              <tr><th scope="row">Season</th><td>Locals and people who come often</td></tr>
            </tbody>
          </table>
        </div>
        <p class="small">Prices change every season, so we link to the official ski pass information instead of copying prices.</p>
      </section>
    </div>

    <section aria-labelledby="areas-title">
      <h2 id="areas-title">Ski areas and schools</h2>
      <div class="grid grid-3">
${card({ image: "ski", alt: "Skier on a wide slope", title: "Carosello 3000", meta: "Ski area", text: "One of the two big ski areas of Livigno." })}
${card({ image: "snowpark", alt: "Snowboarder in a snow park", title: "Mottolino", meta: "Ski area · snow park", text: "The second ski area, with a snow park for freestyle." })}
${card({ image: "ski-school", alt: "Training slope with small flags", title: "Ski and snowboard schools", meta: "Lessons for all levels", text: "Group and private lessons for children and adults." })}
      </div>
      <div class="btn-row">
        ${ext("https://www.livigno.eu/en", "Buy ski pass", "btn btn-filled")}
        ${ext("https://www.livigno.eu/en", "Webcams")}
      </div>
    </section>`,
});

pages["food.html"] = layout({
  file: "food.html",
  title: "Food and local products in Livigno – typical dishes and duty-free",
  description: "Typical dishes of Livigno and the Valtellina valley such as pizzoccheri, sciatt and bresaola, local producers and duty-free shopping.",
  scripts: ["main.js"],
  hero: banner({ image: "pizzoccheri", alt: "Plate of pizzoccheri, buckwheat pasta with cheese", eyebrow: "Food & local", title: "Food and local products",
    lead: "Livigno cooks in the tradition of the Valtellina valley: buckwheat, mountain cheese and cured meat. Try the dishes, meet local producers and shop duty-free." }),
  body: `

    <section aria-labelledby="eat-title">
      <h2 id="eat-title" class="visually-hidden">What to eat and buy</h2>
      <div class="tabs" role="tablist" aria-label="Food and shopping">
        <button type="button" role="tab" id="tab-dishes" aria-controls="panel-dishes" aria-selected="true">Typical dishes</button>
        <button type="button" role="tab" id="tab-eat" aria-controls="panel-eat" aria-selected="false" tabindex="-1">Where to eat</button>
        <button type="button" role="tab" id="tab-shop" aria-controls="panel-shop" aria-selected="false" tabindex="-1">Duty-free shopping</button>
      </div>
      <div role="tabpanel" id="panel-dishes" aria-labelledby="tab-dishes" tabindex="0">
        <div class="grid grid-3">
${card({ variant: "outlined", image: "pizzoccheri", alt: "Plate of pizzoccheri buckwheat pasta", title: "Pizzoccheri", meta: "Buckwheat pasta · Valtellina", text: "Short buckwheat pasta cooked with potatoes and cabbage, served with melted cheese and butter." })}
${card({ variant: "outlined", image: "sciatt", alt: "Round golden cheese fritters", title: "Sciatt", meta: "Cheese fritters", text: "Crispy fritters made of buckwheat batter with a soft cheese centre." })}
${card({ variant: "outlined", image: "bresaola", alt: "Plate with thin slices of cured meat", title: "Bresaola", meta: "Cured beef", text: "Air-dried, thinly sliced beef from the Valtellina, often served with lemon and oil." })}
        </div>
      </div>
      <div role="tabpanel" id="panel-eat" aria-labelledby="tab-eat" tabindex="0" hidden>
        <ul class="list">
          <li><span class="lead-icon" aria-hidden="true">${icon.food}</span><div class="text"><p class="title">Mountain huts (rifugi)</p><p class="support">Simple local food on the slopes and along hiking trails.</p></div></li>
          <li><span class="lead-icon" aria-hidden="true">${icon.food}</span><div class="text"><p class="title">Traditional restaurants</p><p class="support">Valtellina dishes such as pizzoccheri and sciatt.</p></div></li>
          <li><span class="lead-icon" aria-hidden="true">${icon.food}</span><div class="text"><p class="title">Pizzerias and cafés</p><p class="support">Quick meals in the village centre.</p></div></li>
        </ul>
        <p class="small">A list of restaurants with opening hours will be loaded from the tourist office data (planned for the next semester).</p>
      </div>
      <div role="tabpanel" id="panel-shop" aria-labelledby="tab-shop" tabindex="0" hidden>
        <div class="fact">
          <h3>Why are prices lower in Livigno?</h3>
          <p>Livigno is a duty-free area: Italian VAT is not charged on most goods. This is why many visitors shop for sports equipment, perfume or chocolate here. Check the customs allowances before you travel home.</p>
        </div>
      </div>
    </section>

    <section aria-labelledby="producers-title">
      <h2 id="producers-title">Local producers</h2>
      <ul class="list">
        <li>${photo("cheese", "", { w: 112, h: 112, cls: "lead-img" })}<div class="text"><p class="title">Dairy</p><p class="support">Fresh milk, mountain cheese and yoghurt from the valley.</p></div></li>
        <li>${photo("hiking", "", { w: 112, h: 112, cls: "lead-img" })}<div class="text"><p class="title">Honey and mountain herbs</p><p class="support">Products of the high alpine meadows.</p></div></li>
        <li>${photo("village", "", { w: 112, h: 112, cls: "lead-img" })}<div class="text"><p class="title">Bakery</p><p class="support">Bread and sweets made with buckwheat and rye.</p></div></li>
      </ul>
    </section>`,
});

pages["plan.html"] = layout({
  file: "plan.html",
  title: "Plan your visit to Livigno – getting there, where to stay, events",
  description: "How to get to Livigno by car, bus or plane, where to stay, upcoming events, frequently asked questions and a contact form for the tourist office.",
  scripts: ["main.js", "events.js", "contact.js"],
  hero: banner({ image: "village", alt: "Livigno village with mountains behind", eyebrow: "Plan your visit", title: "Plan your visit",
    lead: "Everything you need before you travel: how to get to the valley, where to stay, what is on and who to ask." }),
  body: `
    <section aria-labelledby="info-title">
      <h2 id="info-title" class="visually-hidden">Travel information</h2>
      <div class="tabs" role="tablist" aria-label="Plan your visit">
        <button type="button" role="tab" id="tab-travel" aria-controls="panel-travel" aria-selected="true">Getting there</button>
        <button type="button" role="tab" id="tab-stay" aria-controls="panel-stay" aria-selected="false" tabindex="-1">Where to stay</button>
        <button type="button" role="tab" id="tab-events" aria-controls="panel-events" aria-selected="false" tabindex="-1">Events</button>
        <button type="button" role="tab" id="tab-faq" aria-controls="panel-faq" aria-selected="false" tabindex="-1">FAQ</button>
      </div>

      <div role="tabpanel" id="panel-travel" aria-labelledby="tab-travel" tabindex="0">
        <ul class="list">
          <li><span class="lead-icon" aria-hidden="true">${icon.car}</span><div class="text"><p class="title">By car</p><p class="support">From Italy over the Foscagno Pass; from Switzerland through the Munt la Schera tunnel or, in summer, over the Forcola di Livigno pass.</p></div></li>
          <li><span class="lead-icon" aria-hidden="true">${icon.bus}</span><div class="text"><p class="title">By bus</p><p class="support">Bus connections from Tirano and Bormio, which can be reached by train or car.</p></div></li>
          <li><span class="lead-icon" aria-hidden="true">${icon.plane}</span><div class="text"><p class="title">By plane</p><p class="support">The nearest large airports are in Milan, Bergamo and Zurich; continue by train, bus or car.</p></div></li>
        </ul>
      </div>

      <div role="tabpanel" id="panel-stay" aria-labelledby="tab-stay" tabindex="0" hidden>
        <div class="grid grid-3">
${card({ variant: "outlined", image: "village", alt: "Hotels in the village", title: "Hotels", meta: "In the village centre", text: "From family hotels to wellness hotels." })}
${card({ variant: "outlined", image: "hero-summer", alt: "Houses in the green valley", title: "Apartments", meta: "Self-catering", text: "Good for families and longer stays." })}
${card({ variant: "outlined", image: "hut", alt: "Mountain hut on a hiking route", title: "Mountain huts (rifugi)", meta: "Sleep in the mountains", text: "Simple rooms on hiking routes – book early." })}
        </div>
      </div>

      <div role="tabpanel" id="panel-events" aria-labelledby="tab-events" tabindex="0" hidden>
        <p class="status" role="status" aria-live="polite" data-events-status>Loading events…</p>
        <ul class="list" data-events-list></ul>
        <p class="small">Sample events for the student project; real dates will come from the tourist office.</p>
      </div>

      <div role="tabpanel" id="panel-faq" aria-labelledby="tab-faq" tabindex="0" hidden>
        <h2 class="visually-hidden">Frequently asked questions</h2>
        <details><summary>When is the best time to visit?</summary><p>Winter for skiing and snowboarding, summer for hiking and cycling. Spring and autumn are quieter.</p></details>
        <details><summary>Do I need a car in Livigno?</summary><p>Not necessarily: the village can be explored on foot and by local bus.</p></details>
        <details><summary>Is everything duty-free?</summary><p>Most goods are sold without Italian VAT, but customs limits apply when you leave. Check them before you travel.</p></details>
      </div>
    </section>

    <div class="split">
      <section id="contact" aria-labelledby="contact-title">
        <h2 id="contact-title">Contact the tourist office</h2>
        <p>Ask us anything about your trip. Fields marked * are required.</p>
        <form class="form" novalidate data-contact-form>
          <div class="field">
            <input id="name" name="name" type="text" autocomplete="name" required placeholder=" " aria-describedby="name-error">
            <label for="name">Name *</label>
            <p class="error" id="name-error"></p>
          </div>
          <div class="field">
            <input id="email" name="email" type="email" autocomplete="email" required placeholder=" " aria-describedby="email-error">
            <label for="email">Email *</label>
            <p class="error" id="email-error"></p>
          </div>
          <div class="field">
            <textarea id="message" name="message" required placeholder=" " aria-describedby="message-error"></textarea>
            <label for="message">Your question *</label>
            <p class="error" id="message-error"></p>
          </div>
          <div class="field">
            <div class="check">
              <input id="privacy" name="privacy" type="checkbox" required aria-describedby="privacy-error">
              <label for="privacy">I agree that my data is used to answer my question. *</label>
            </div>
            <p class="error" id="privacy-error"></p>
          </div>
          <p><button type="submit" class="btn btn-filled">Send question</button></p>
          <p class="form-status" role="status" aria-live="polite" data-form-status></p>
        </form>
      </section>

      <section aria-labelledby="map-title">
        <h2 id="map-title">Map</h2>
        <iframe class="map" title="Map of Livigno and the roads to the valley (OpenStreetMap)" loading="lazy"
          src="https://www.openstreetmap.org/export/embed.html?bbox=9.9%2C46.35%2C10.45%2C46.7&amp;layer=mapnik&amp;marker=46.538%2C10.135"></iframe>
        <p class="small">Map data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>.</p>
      </section>
    </div>`,
});

pages["sources.html"] = layout({
  file: "sources.html",
  title: "Sources and image credits – Livigno student project",
  description: "Sources (ISO 690), image credits and authors of the Livigno student web project.",
  scripts: ["main.js"],
  body: `
    <section aria-labelledby="page-title">
      <h1 id="page-title">Sources and image credits</h1>
      <p class="lead">This website is a student project. The texts were written by the authors; facts come from the sources below.</p>
      <h2>Sources (ISO 690)</h2>
      <ol>
        <li>Livigno. In: <i>Wikipedia: the free encyclopedia</i> [online]. San Francisco (CA): Wikimedia Foundation [cit. 2026-11-08]. Available from: <a href="https://en.wikipedia.org/wiki/Livigno">https://en.wikipedia.org/wiki/Livigno</a></li>
        <li>APT LIVIGNO. <i>Winter Olympic Games Milano Cortina 2026</i> [online]. [cit. 2026-11-08]. Available from: <a href="https://www.livigno.eu/en/winter-olympic-games-milano-cortina-2026">https://www.livigno.eu/en/winter-olympic-games-milano-cortina-2026</a></li>
        <li>OPEN-METEO. <i>Free Weather API</i> [online]. [cit. 2026-11-08]. Available from: <a href="https://open-meteo.com/">https://open-meteo.com/</a></li>
        <li>OPENSTREETMAP CONTRIBUTORS. <i>OpenStreetMap</i> [online]. [cit. 2026-11-08]. Available from: <a href="https://www.openstreetmap.org/copyright">https://www.openstreetmap.org/copyright</a></li>
        <li>GOOGLE. <i>Material Design 3</i> [online]. [cit. 2026-11-08]. Available from: <a href="https://m3.material.io/">https://m3.material.io/</a></li>
      </ol>
      <h2>Photo credits</h2>
      <p>Photos are used under their free licences (for example Creative Commons) and credited below. The icons and the logo were drawn by the authors.</p>
      <section class="table-wrap" tabindex="0" aria-label="Photo credits table">
        <table>
          <caption>Photos used on this website</caption>
          <thead><tr><th scope="col">Photo</th><th scope="col">Author</th><th scope="col">Licence</th><th scope="col">Source</th></tr></thead>
          <tbody>
${photos.map((p) => `            <tr><th scope="row">${esc(p.shows)}</th>${p.author
  ? `<td>${esc(p.author)}</td><td>${p.licenceUrl ? `<a href="${esc(p.licenceUrl)}">${esc(p.licence)}</a>` : esc(p.licence)}</td><td>${p.source ? `<a href="${esc(p.source)}">Link</a>` : "–"}</td>`
  : '<td colspan="3">Placeholder drawing by the authors – photo will be added</td>'}</tr>`).join("\n")}
          </tbody>
        </table>
      </section>
      <h2>Authors</h2>
      <ul>${AUTHORS.map((a) => `<li>${esc(a)}</li>`).join("")}</ul>
    </section>`,
});

pages["404.html"] = layout({
  file: "404.html",
  title: "Page not found – Livigno",
  description: "This page does not exist. Go to one of the main sections of the Livigno website.",
  scripts: ["main.js"],
  body: `
    <section aria-labelledby="page-title">
      <h1 id="page-title">Page not found</h1>
      <p class="lead">Sorry, this address does not exist. Maybe the link is old or has a typo.</p>
      <ul class="list">
${PAGES.map(([f, full]) => `        <li><div class="text"><p class="title"><a href="${f}">${esc(full)}</a></p></div></li>`).join("\n")}
      </ul>
    </section>`,
});

// ---------- write files ----------
for (const [file, html] of Object.entries(pages)) fs.writeFileSync(path.join(ROOT, file), html.replace(/[ \t]+\n/g, "\n"));
fs.writeFileSync(path.join(ROOT, "img", "logo.svg"), logo);

const today = "2026-11-08";
fs.writeFileSync(path.join(ROOT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...PAGES.map((p) => p[0]), "sources.html"].map((f) => `  <url><loc>${SITE}${f === "index.html" ? "" : f}</loc><lastmod>${today}</lastmod></url>`).join("\n")}
</urlset>
`);
fs.writeFileSync(path.join(ROOT, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${SITE}sitemap.xml\n`);
console.log("built", Object.keys(pages).length, "pages");
