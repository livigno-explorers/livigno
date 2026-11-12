// Contact form: accessible validation (error next to the field, focus moves to the first error).
// The back end is planned for next semester: when ENDPOINTS.contact is set, the data is sent with postJSON.
import { ENDPOINTS, postJSON } from "./api.js";
import { t } from "./i18n.js";

const form = document.querySelector("[data-contact-form]");
const status = form.querySelector("[data-form-status]");

const rules = {
  name: (f) => (f.value.trim() ? "" : t("Please enter your name.")),
  email: (f) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value.trim()) ? "" : t("Please enter a valid email, for example anna@example.com.")),
  message: (f) => (f.value.trim().length >= 10 ? "" : t("Please write your question (at least 10 characters).")),
  privacy: (f) => (f.checked ? "" : t("Please agree so that we can answer you.")),
};

function check(field) {
  const message = rules[field.name](field);
  document.getElementById(`${field.id}-error`).textContent = message;
  field.setAttribute("aria-invalid", message ? "true" : "false");
  return !message;
}

for (const name of Object.keys(rules)) {
  const field = form.elements[name];
  // Once a field has shown an error, re-check it while the user types,
  // so the message disappears as soon as the problem is fixed.
  const event = field.type === "checkbox" ? "change" : "input";
  field.addEventListener(event, () => { if (field.getAttribute("aria-invalid") === "true") check(field); });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  status.textContent = "";
  const fields = Object.keys(rules).map((n) => form.elements[n]);
  const invalid = fields.filter((f) => !check(f));
  if (invalid.length) {
    invalid[0].focus();
    return;
  }

  const el = form.elements;
  const data = { name: el.name.value.trim(), email: el.email.value.trim(), message: el.message.value.trim() };
  try {
    if (ENDPOINTS.contact) await postJSON(ENDPOINTS.contact, data);
    form.reset();
    for (const f of fields) f.removeAttribute("aria-invalid");
    status.textContent = t("Thank you, {name}! Your question is ready to be sent. (Student project: sending will work when the back end is added next semester.)", { name: data.name });
  } catch (error) {
    console.error(error);
    status.textContent = t("Sorry, your question could not be sent. Please try again later.");
  }
});
