# Reflection

Short reflection for the PRD/DoD exercise – Livigno group project, CZU Prague 2026.

## Which criterion or DoD item caught a bug

| Caught by | Bug | Fix |
|---|---|---|
| P5 criterion "When I fill in the form correctly, then a thank-you message appears" (automated test) | The click on *Send* missed: errors shown on blur moved the button down just before the click. | Fields are now checked while typing, so nothing moves under the mouse. |
| DoD 3 – W3C 0 errors | The Plan page skipped a heading level (h1 → h3). | Added an h2 for the tab section. |
| DoD 4 – readable without JavaScript | 5 tab sections, all trails and all events were invisible with JavaScript off. | Content is now written into the HTML; JavaScript only adds tabs, filters and live data. |
| DoD 5 – Lighthouse | Big photos made the Home page slow (mobile score 82). | Photos compressed to 800 px (score 88–89). |
| DoD 7 – free licence | One downloaded photo was a watermarked iStock image; another showed the wrong dish. | Both removed; placeholders shown until free photos are found. |
| DoD 2 – axe inside `npm test` (German pages) | The German "Merken" (save) button had a hidden label that did not contain the visible word, so voice-control users could not say it. | The visible word now always starts the accessible name, in every language. |
| New layout test (no sideways scrolling) | The header overflowed between 840 and 1024 px, and long words and web addresses overflowed on small phones – also in English, unnoticed before. | Search becomes an icon at those widths; long words break or hyphenate. |
| P10 – contrast of text on photos (screenshot test) | axe said "OK", but white text on bright snow was only 2.97:1. axe cannot see what is inside a photo. | A dark gradient behind the hero text; now at least 4.5:1 everywhere. |
| P10 – keyboard test | The header search had an invisible "Search" button: keyboard users landed on it and saw nothing. The privacy checkbox had no focus ring at all. | The button now appears when it gets focus; the checkbox has a focus ring. |
| P10 – layout test at 320 px | Hidden screen-reader text in the photo credits table pushed the Sources page sideways on phones. | The table box now keeps its hidden text inside. |
| P10 – axe best-practice rules | Two search forms had the same name for screen readers, and two tables that scroll on phones could not be reached with the keyboard. | Each search has its own name; the tables can be focused and scrolled with the arrow keys. |

## What we added to the DoD while working

At the start our DoD had only "works, no console errors, valid HTML/CSS". We added:

- **DoD 4** (no JavaScript) after the lecture and the test above showed hidden content.
- **DoD 5** (Lighthouse ≥ 85) after the slow Home page.
- **DoD 6** (real, pinned packages) because AI tools can suggest packages that do not exist.
- **DoD 7** (photo licence) after the iStock photo.
- **DoD 8** (we can explain every line), because we also used an AI coding assistant for drafts and
  we wanted to stay in control of what goes into the project.
- **DoD 1** now also says "no page scrolls sideways", after the layout test found the header overflow,
  and "works with the keyboard only", after the lecture on Web Accessibility.
- **DoD 2** now uses WCAG 2.2 AA and the axe best-practice rules, not only WCAG 2.1 A/AA.

## What we learned

- "Valid" is not the same as "accessible". The W3C validator was happy long before the keyboard test was.
- One tool is never enough: axe missed the text on photos, the photo test missed the invisible button,
  and the keyboard test missed the tables that only the axe best-practice rules found.
- Writing the criterion first ("When I press Tab …, then …") made it clear what "done" means and made the bug easy to show.
- Suggestions from the AI assistant, and its "everything works", were only a starting point. Every bug in this table
  was found when we ran the validators, the tests or the browser ourselves.
