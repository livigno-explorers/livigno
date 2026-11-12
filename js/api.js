// One place for all data requests (AJAX with fetch).
// Today the data comes from static JSON files in /data.
// Next semester only API_BASE changes to the address of our own back end (e.g. "/api/"),
// and the same functions keep working.

import { lang } from "./i18n.js";

export const API_BASE = "data/";
const suffix = lang === "en" ? "" : `-${lang}`; // data/trails-it.json, data/events-de.json …

export const ENDPOINTS = {
  trails: `${API_BASE}trails${suffix}.json`,
  events: `${API_BASE}events${suffix}.json`,
  contact: null, // back end not ready yet: the form is validated and sent in the browser only
};

// Third-party APIs used by the site.
export const THIRD_PARTY = {
  // Open-Meteo: free weather API, no key needed. Livigno ≈ 46.538 N, 10.135 E.
  weather:
    "https://api.open-meteo.com/v1/forecast?latitude=46.538&longitude=10.135" +
    "&current=temperature_2m,snowfall,snow_depth,wind_speed_10m&timezone=Europe%2FRome",
};

export async function getJSON(url, { timeout = 8000 } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { signal: controller.signal, headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error(`Request failed: ${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

export async function postJSON(url, data) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return response.json();
}
