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

## What we added to the DoD while working

At the start our DoD had only "works, no console errors, valid HTML/CSS". We added:

- **DoD 4** (no JavaScript) after the lecture and the test above showed hidden content.
- **DoD 5** (Lighthouse ≥ 85) after the slow Home page.
- **DoD 6** (real, pinned packages) because AI tools can suggest packages that do not exist.
- **DoD 7** (photo licence) after the iStock photo.
- **DoD 8** (we can explain every line) because most code was drafted with an AI assistant: the AI drafts, we verify.
- **DoD 1** now also says "no page scrolls sideways", after the layout test found the header overflow.

## What we learned

The AI often said "everything works" before we tested it. The bugs above were found only by running the
validators, the tests and the browser ourselves. Small increments with "When … then …" criteria made each check quick.
