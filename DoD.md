# Definition of Done (global – applies to every increment)

8 items, each a strict Yes/No. An increment is done only when all 8 are "Yes".

| # | Item | How we check it |
|---|---|---|
| 1 | Every acceptance criterion of the increment was checked by hand at desktop and phone width, and no page scrolls sideways. | Browser, 1280 px and 375 px + the "Layout" test |
| 2 | `npm test` passes (all end-to-end tests, including 0 axe WCAG 2.1 A/AA violations and 0 console errors). | `npm test` |
| 3 | W3C shows 0 errors for every changed HTML page and for `css/style.css`. | validator.w3.org/nu, jigsaw.w3.org/css-validator |
| 4 | All page content can be read with JavaScript turned off. | Browser with JavaScript disabled + the "Without JavaScript" test |
| 5 | Lighthouse performance is at least 85 on mobile for every changed page. | Chrome DevTools → Lighthouse (mobile) |
| 6 | Every package in `package.json` exists on npmjs.com, has a pinned version and is in the PRD technical scope. | `npm view <package> version` |
| 7 | Every new photo has a free licence (Unsplash, Pexels, Pixabay, Wikimedia Commons) and a credit in `data/photos.json`. | Licence page of the photo |
| 8 | A team member can explain every changed line (also AI-written code), and `PRD.md` is updated before the commit. | Code review in the team |
