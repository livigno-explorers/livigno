// Winter page: live weather and snow from the Open-Meteo API (third-party API, no key needed).
import { THIRD_PARTY, getJSON } from "./api.js";

const box = document.querySelector("[data-weather]");
const out = (name) => box.querySelector(`[data-w="${name}"]`);

try {
  const { current, current_units: u } = await getJSON(THIRD_PARTY.weather);
  out("temperature").textContent = `${current.temperature_2m} ${u.temperature_2m}`;
  out("snow").textContent = current.snow_depth == null ? "not available" : `${Math.round(current.snow_depth * 100)} cm`;
  out("snowfall").textContent = `${current.snowfall} ${u.snowfall}`;
  out("wind").textContent = `${current.wind_speed_10m} ${u.wind_speed_10m}`;
  const time = new Date(current.time);
  out("updated").textContent = `Updated: ${time.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })} (local time in Livigno)`;
} catch (error) {
  console.error(error);
  for (const n of ["temperature", "snow", "snowfall", "wind"]) out(n).textContent = "not available";
  out("updated").textContent = "Live data is not available right now. Please check the official webcams.";
}
