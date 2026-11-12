import { t } from "./i18n.js";

// Shared behaviour for all pages: tabs (WAI-ARIA tabs pattern) and segmented buttons.

// ---------- Tabs ----------
for (const tablist of document.querySelectorAll('[role="tablist"]')) {
  const tabs = [...tablist.querySelectorAll('[role="tab"]')];

  const select = (tab, focus = true) => {
    for (const t of tabs) {
      const on = t === tab;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute("aria-controls"));
      panel.hidden = !on;
      panel.removeAttribute("data-tab-hidden");
    }
    if (focus) tab.focus();
  };

  tablist.addEventListener("click", (e) => {
    const tab = e.target.closest('[role="tab"]');
    if (tab) select(tab);
  });

  tablist.addEventListener("keydown", (e) => {
    const i = tabs.indexOf(document.activeElement);
    if (i < 0) return;
    const next = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    select(tabs[(next + tabs.length) % tabs.length]);
  });

  // Without JavaScript all panels are visible. Here we show only the selected one,
  // or the one named in the address, e.g. plan.html#tab-events
  const fromHash = tabs.find((t) => `#${t.id}` === location.hash);
  select(fromHash || tabs.find((t) => t.getAttribute("aria-selected") === "true") || tabs[0], false);
}

// ---------- Segmented buttons ----------
function segmented(selector, attr, texts, onChange) {
  const group = document.querySelector(selector);
  if (!group) return;
  const output = document.querySelector(`[data-${attr}-text]`);
  group.addEventListener("click", (e) => {
    const button = e.target.closest("button");
    if (!button) return;
    for (const b of group.querySelectorAll("button")) b.setAttribute("aria-pressed", String(b === button));
    const value = button.dataset[attr];
    if (output) output.textContent = texts[value];
    onChange?.(value);
  });
}

segmented("[data-season-switch]", "season", {
  summer: t("Summer: hiking trails, cycling routes, lakes and a bike park."),
  winter: t("Winter: two ski areas, a snow park, ski schools and live snow information."),
}, (season) => {
  // Change the big photo and put the chosen season's activities first.
  const hero = document.querySelector("[data-season-hero]");
  if (hero) {
    hero.src = `img/photos/hero-${season}.jpg`;
    hero.alt = season === "winter" ? t("Livigno valley covered in snow") : t("Green Livigno valley with the lake and mountains in summer");
  }
  const cards = [...document.querySelectorAll(`[data-season-card="${season}"]`)];
  cards.reverse().forEach((card) => card.parentElement.prepend(card));
});

segmented("[data-sport-switch]", "sport", {
  ski: t("Skiing: slopes for beginners and experts in both ski areas."),
  board: t("Snowboard: a snow park with jumps and rails, plus wide slopes."),
  xc: t("Cross-country: prepared tracks along the flat valley floor."),
});
