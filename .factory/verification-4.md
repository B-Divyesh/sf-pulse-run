# Verify browser support for the three-minute rhythm run

Date: 6 September 2026

## Verdict: FAIL

Finding count: **1**. Untested claim count: **0**.

Implementation candidate reviewed: `aba0b954a3111835dd9a8a87af1b5f104035ae5c` (`fix styled 404 under content security policy`).

Documentation baseline reviewed: `de3835f22e349ecfcf9afeffb15598306af72122` (`record strict review 2 pass`). Commits after the implementation candidate before this report change only review material. The live JavaScript, CSS, `404.html`, and `404.css` SHA-256 values match a clean build of the implementation candidate.

Live URL: <https://pulse-run.sociobot.in>

Pulse Run is a finite single-player rhythm game. It is for keyboard players who want original percussion without an account or download. Before scrolling, fresh desktop and 390 × 844 phone viewports in Chromium, Firefox, and WebKit show **Play a three-minute rhythm run**, identify that audience, offer **Try it with sample data**, and show the game canvas.

## Finding

1. **Serious — the phone header has an unnamed focusable home link on every application route.** In a 390 px Chromium context, axe reports `link-name` with serious impact for `.wordmark`: `<a class="wordmark" href="/" data-route=""><span class="wordmark-mark" aria-hidden="true"></span><span>Pulse Run</span></a>`. The responsive presentation removes the text from the accessibility tree, but the link remains keyboard-focusable. A screen-reader user reaches an unnamed home link on `/`, `/demo`, `/privacy`, `/terms`, and `/license`. This is a product accessibility defect, not an expected 404 or test-tool message.

## Clean candidate verification

A new detached checkout at `/tmp/pulse-run-verify-4-clean` was checked out at `aba0b95`.

```sh
npm ci
npm test
npm run build
```

- `npm ci` completed with zero vulnerabilities.
- `npm test` passed all 6 Vitest simulation tests and all 33 Playwright Chromium tests.
- `npm run build` produced `dist/`: application JavaScript is 36,568 bytes (11.39 kB gzip) and CSS is 12,236 bytes (3.65 kB gzip).
- Each of the 16 declared commands was run separately as `npm run test:e2e -- --grep @claim:<id>` and passed: `complete-run`, `three-misses`, `restart-reset`, `settings-persist`, `local-play-data`, `demo-isolation`, `one-time-offer`, `input-modes`, `remappable-input`, `free-run-changes`, `no-account-ads-tracking`, `audio-gesture`, `assist-timing`, `delete-play-data`, `built-in-scope`, and `frame-rate`.
- The registry has 16 IDs and each has exactly one tagged browser test. There are no missing, false, incomplete, or untested public claims. The finding is an unclaimed accessibility defect.

## Live browser rounds

Each engine used a fresh desktop context and a separate 390 × 844 context with touch enabled. The live run used normal browser key events, real visible choice buttons, and the production fixed-timestep loop; no live QA hook or simulated end state was used. Each phone client first started a real run, reloaded into **Run paused**, resumed, and then played through the visible end screen. The audio check passively counted `AudioContext.createGain` calls: zero before interaction and four after the explicit start gesture. That confirms gesture-gated audio startup in headless browsers; it does not claim an audio-hardware listening test.

| Engine | Version | Touch-control score | Complete run evidence | Console during normal play |
| --- | --- | ---: | --- | --- |
| Chromium | 145.0.7632.6 | 844 | 5 choices; **Run complete**, 331,890 points, 444-note streak, 3:00 played | None |
| Firefox | 146.0.1 | 390 | 5 choices; **Run complete**, 259,716 points, 352-note streak, 3:00 played | None |
| WebKit | 26.0 | 350 | 5 choices; **Run complete**, 527,522 points, 498-note streak, 3:00 played | None during normal load and play |

The initial full-round captures independently scored touch controls in Chromium and WebKit. A short Firefox touch probe initially missed its note window; a second real `page.touchscreen.tap()` probe over multiple visible note windows scored 390. This is a timing correction in the test, not a failed Firefox game path.

All three engines had one title, one h1, one main landmark, a visible canvas, zero phone horizontal overflow, real reload recovery, one same-origin request origin (`https://pulse-run.sociobot.in`), and a 3:00 win. The recorded first screens and end screens are in `/work/.evidence/pulse-run-verify-4/`.

## Support boundaries and unavailable infrastructure

The README documents Playwright Chromium checks only. It does not make a public Firefox, Safari, iOS, or WebKit compatibility promise. Firefox and WebKit results above are additional observed compatibility coverage, not invented public support.

- Playwright Firefox 146 does not support its `isMobile` context option. It was tested in a 390 × 844 phone viewport with touch enabled, not claimed as Firefox mobile-device emulation.
- Playwright WebKit 26 is not a physical iOS or macOS Safari device. It loaded the product stylesheet (105 CSS rules; body background `rgb(16, 23, 34)`) and played normally. Playwright WebKit screenshot capture itself emits a CSP stylesheet-refusal console message after capture; a fresh no-screenshot page load waited for one second with zero console errors. This is a capture-tool/CSP interaction, not a product stylesheet failure, and is excluded from the finding count.
- No physical-device audio output was available in this headless environment. Gesture-gated `AudioContext` creation was observed instead.
- The game is explicitly single-player with no multiplayer rooms, ranking, upload, backend, or offline-reload promise. Therefore no real-multiplayer, tenant, rate-limit, backend, or offline claim applies. This is a declared scope boundary, not an untested public claim.

## Current live checks

- `verify-url.sh https://pulse-run.sociobot.in /work/.evidence/pulse-run-verify-4/verify-url` passed: HTTP 200, title, `lang=en`, one h1, main landmark, image alt text, button labels, and no landing console errors.
- Fresh live routes `/`, `/demo`, `/privacy`, `/terms`, and `/license` each returned 200 and had their expected distinct titles, one h1, and one main landmark. The same-origin route links returned 200.
- One click opened `/demo` with **Demo — sample data, nothing is saved**, score 18,420, and track `1 / 6`. Reset kept the banner, returned track `1 / 6`, and left a seeded real-data sentinel unchanged.
- A real run reloaded to **Run paused** with a working resume action. The privacy control removed all three real storage keys and announced deletion.
- The public Complete offer remains $5 USD once, not a subscription; the clean `one-time-offer` claim passed. Checkout and activation remain visibly unavailable and were not attempted or represented as working.
- The unknown route returned deliberate HTTP 404 with title **Page not found — Pulse Run**, heading **Page not found**, and a working return link. Its HTTP 404 status is expected. The browser's generic failed-resource message for that deliberate status is not a defect.
- Desktop live axe has zero serious or critical violations. Phone live axe has the serious unnamed-wordmark finding above on every application route.

## Earlier finding disposition

| Earlier finding | Current disposition |
| --- | --- |
| Sample-banner contrast | Resolved; banner is visible in the live sample and desktop axe remains clear. |
| Mobile targets, 200% text, overflow, and missing first-screen game | Resolved; the game canvas is visible before scrolling and all engines had zero phone overflow. The new unnamed-header-link issue is separate. |
| Incomplete modifier wording and ineffective Steady count | Resolved; all six changes remain accurately described and separately tested. |
| Unregistered public promises | Resolved; all 16 current public claims have one tagged command and each command passed. |
| Real-run refresh recovery | Resolved; it recovered to the visible paused state in Chromium, Firefox, and WebKit. |
| Paid percussion catalog and price clarity | Resolved; the $5 one-time offer and Copper, Paper, and Glass content still agree across code, copy, and metadata. |
| 404 inline CSS blocked by CSP | Resolved; candidate and live `404.css` hashes match, and the styled recovery document remains served from a same-origin stylesheet. |

## Next step

Repair the responsive wordmark so its home link has a persistent accessible name at the phone breakpoint, then re-run phone axe across all application routes and this cross-engine verification. No product code was changed during this verification.
