// Summer page: load trails with fetch (AJAX), search + filter chips, and "Plan my day" (saved in the browser).
import { ENDPOINTS, getJSON } from "./api.js";

const list = document.querySelector("[data-trail-list]");
const status = document.querySelector("[data-trail-status]");
const search = document.querySelector("#trail-search");
const planList = document.querySelector("[data-plan-list]");
const STORE = "livigno-plan";

const TYPE = { hiking: "Hiking", cycling: "Cycling", mtb: "Mountain bike" };
const filters = { type: new Set(), level: new Set() };
let trails = [];

const readPlan = () => {
  try { return JSON.parse(localStorage.getItem(STORE)) || []; } catch { return []; }
};
const writePlan = (ids) => {
  try { localStorage.setItem(STORE, JSON.stringify(ids)); } catch { /* storage blocked: plan lives only in this visit */ }
};
let plan = readPlan();

function el(tag, attrs = {}, text) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  if (text) node.textContent = text;
  return node;
}

function trailCard(t) {
  const card = el("article", { class: "card card-outlined" });
  card.append(el("img", { src: `img/photos/${t.image}.jpg`, alt: t.alt, width: "1200", height: "800", loading: "lazy", decoding: "async" }));
  const body = el("div", { class: "card-body" });
  body.append(el("h3", {}, t.name), el("p", { class: "meta" }, `${TYPE[t.type]} · ${t.level}`), el("p", {}, t.text));
  const actions = el("div", { class: "card-actions" });
  const save = el("button", { type: "button", class: "btn btn-tonal", "aria-pressed": String(plan.includes(t.id)) });
  save.textContent = plan.includes(t.id) ? "Saved" : "Save";
  save.setAttribute("aria-label", `Save ${t.name} to my day plan`);
  save.addEventListener("click", () => toggle(t.id));
  actions.append(save);
  body.append(actions);
  card.append(body);
  return card;
}

function render() {
  const q = search.value.trim().toLowerCase();
  const shown = trails.filter((t) =>
    (!q || t.name.toLowerCase().includes(q)) &&
    (!filters.type.size || filters.type.has(t.type)) &&
    (!filters.level.size || filters.level.has(t.level)));

  list.replaceChildren(...shown.map(trailCard));
  status.replaceChildren();
  if (shown.length) {
    status.textContent = `${shown.length} of ${trails.length} trails shown.`;
  } else {
    status.append("No trail matches your search. ");
    const clear = el("button", { type: "button", class: "btn btn-text" }, "Clear filters");
    clear.addEventListener("click", clearFilters);
    status.append(clear);
  }
  renderPlan();
}

function renderPlan() {
  planList.replaceChildren(...plan
    .map((id) => trails.find((t) => t.id === id))
    .filter(Boolean)
    .map((t) => {
      const li = el("li");
      const text = el("div", { class: "text" });
      text.append(el("p", { class: "title" }, t.name), el("p", { class: "support" }, `${TYPE[t.type]} · ${t.level}`));
      const remove = el("button", { type: "button", class: "btn btn-text", "aria-label": `Remove ${t.name} from my day plan` }, "Remove");
      remove.addEventListener("click", () => toggle(t.id));
      li.append(text, remove);
      return li;
    }));
}

function toggle(id) {
  plan = plan.includes(id) ? plan.filter((x) => x !== id) : [...plan, id];
  writePlan(plan);
  render();
}

function clearFilters() {
  search.value = "";
  for (const set of Object.values(filters)) set.clear();
  for (const chip of document.querySelectorAll(".chip")) chip.setAttribute("aria-pressed", "false");
  render();
  search.focus();
}

for (const group of document.querySelectorAll("[data-filter]")) {
  group.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    const set = filters[group.dataset.filter];
    const on = chip.getAttribute("aria-pressed") !== "true";
    chip.setAttribute("aria-pressed", String(on));
    on ? set.add(chip.dataset.value) : set.delete(chip.dataset.value);
    render();
  });
}

document.querySelector("[data-trail-form]").addEventListener("submit", (e) => e.preventDefault());
search.addEventListener("input", render);
document.querySelector("[data-clear-plan]").addEventListener("click", () => { plan = []; writePlan(plan); render(); });

// The search box in the top bar sends ?q=… to this page.
search.value = new URLSearchParams(location.search).get("q") || "";

try {
  trails = await getJSON(ENDPOINTS.trails);
  render();
} catch (error) {
  console.error(error);
  status.textContent = "Sorry, the trails could not be loaded. Please try again later.";
}
