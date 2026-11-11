// Plan page: load all events with fetch and show them as hCalendar (h-event) microformat.
import { ENDPOINTS, getJSON } from "./api.js";

const list = document.querySelector("[data-events-list]");
const status = document.querySelector("[data-events-status]");
const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

function eventItem(e) {
  const d = new Date(`${e.start}T00:00:00`);
  const li = document.createElement("li");
  li.className = "h-event";

  const badge = document.createElement("span");
  badge.className = "lead-icon";
  badge.setAttribute("aria-hidden", "true");
  badge.append(String(d.getDate()), document.createElement("br"), MONTHS[d.getMonth()]);

  const text = document.createElement("div");
  text.className = "text";
  const title = document.createElement("p");
  title.className = "title p-name";
  title.textContent = e.name;
  const when = document.createElement("p");
  when.className = "support";
  const time = document.createElement("time");
  time.className = "dt-start";
  time.dateTime = e.start;
  time.textContent = d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const place = document.createElement("span");
  place.className = "p-location";
  place.textContent = e.location;
  when.append(time, " · ", place);
  const summary = document.createElement("p");
  summary.className = "support p-summary";
  summary.textContent = e.summary;
  text.append(title, when, summary);

  li.append(badge, text);
  return li;
}

try {
  const events = await getJSON(ENDPOINTS.events);
  list.replaceChildren(...events.map(eventItem));
  status.textContent = `${events.length} events.`;
} catch (error) {
  console.error(error);
  status.textContent = "Sorry, the events could not be loaded. Please try again later.";
}
