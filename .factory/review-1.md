# Review 1 — Play a three-minute rhythm run

Date: 6 September 2026

## Verdict: PASS

Implementation candidate reviewed: `aba0b954a3111835dd9a8a87af1b5f104035ae5c` (`fix styled 404 under content security policy`).

Documentation baseline reviewed: `6a776bd7eee66c3d495389faa054f8724a6c39e8` (`record verification 3 pass`). The commits after the implementation candidate change reports only. Live JavaScript, main CSS, 404 HTML, and 404 CSS hashes match the clean implementation build.

Live URL: <https://pulse-run.sociobot.in>

Finding count: **0**. Untested claim count: **0**.

Pulse Run's job is a finite single-player browser rhythm run. It is for keyboard players who want original synthesized percussion without an account or download. Before scrolling, fresh desktop and 390 × 664 phone browsers show **Play a three-minute rhythm run**, identify that audience, offer **Try it with sample data**, and show the game itself.

## Clean candidate verification

A new detached checkout at `/tmp/pulse-run-review-1-clean.ixSqqq` was checked out at the implementation candidate.

```sh
npm ci
npm test
npm run build
```

- `npm ci` installed 61 packages and reported zero vulnerabilities.
- `npm test` passed all 6 deterministic simulation tests and all 33 Playwright browser tests.
- `npm run build` produced `dist/`. Application JavaScript is 36,568 bytes (11.39 kB gzip), and CSS is 12,236 bytes (3.65 kB gzip).
- All 16 commands in `.factory/claims.json` were then run separately from the clean checkout. Every command passed.
- The registry contains 16 IDs. Each ID occurs in exactly one tagged browser test.

The clean suite covers a deterministic six-track 3:00 win, an exact third-miss loss, play-again reset, refresh recovery, all six run changes, keyboard and touch play, all four remapped lanes, duplicate-key rejection, persisted settings, wider timing, privacy deletion, sample isolation, route and browser-back focus, dialog focus, reduced motion, 200% text, phone targets, the throttled frame-rate threshold, and the production-CSP 404 outcome.

## Claim results

| Claim | Result | Observable evidence |
| --- | --- | --- |
| `complete-run` | PASS | Six tracks, five choices, and 3:00 reach the win screen. |
| `three-misses` | PASS | The third missed phrase reaches the loss screen. |
| `restart-reset` | PASS | Play again clears track, score, misses, and changes. |
| `settings-persist` | PASS | Sound, wider timing, and a remapped key survive a real-run reload. |
| `local-play-data` | PASS | Real storage remains local; sample play leaves it unchanged; requests stay same-origin. |
| `demo-isolation` | PASS | One-click entry, persistent label, populated sample, and reset preserve the real sentinel. |
| `one-time-offer` | PASS | Pages and metadata agree on $5 USD once and the three paid sets. |
| `input-modes` | PASS | Keyboard and touch inputs each score a placed note. |
| `remappable-input` | PASS | Every remapped lane key scores its note. |
| `free-run-changes` | PASS | All six free changes have distinct observable effects with Circuit. |
| `no-account-ads-tracking` | PASS | Play starts without identity UI; resources remain same-origin. |
| `audio-gesture` | PASS | Audio stays locked before input, unlocks after input, and never requests recording. |
| `assist-timing` | PASS | Wider timing accepts an offset rejected by normal timing. |
| `delete-play-data` | PASS | The visible privacy control deletes every product storage key. |
| `built-in-scope` | PASS | No upload, ranking, room control, or WebSocket appears. |
| `frame-rate` | PASS | Phone-sized Chromium under 4× CPU throttling remains at or above 50 fps. |

The live site, README, legal pages, metadata, design thesis, and handoff were cross-checked against this registry. There are no missing public claim entries. Checkout and activation are explicitly unavailable, so they are not treated as tested product capabilities.

## Live desktop and phone review

- Fresh desktop returned 200 with the correct title, `lang=en`, one h1, one main landmark, no console or page errors, no horizontal overflow, and 395.79 px of visible game canvas in the first viewport.
- Fresh 390 × 664 phone returned the same job, audience, and first action with no errors or overflow. The canvas begins at 515.14 px and shows 148.86 px before scrolling.
- Every visible phone target measured at least 44 × 44 CSS px. At 200% text there was no horizontal overflow or lost heading. Reduced-motion preference removed interface transition duration.
- Keyboard Tab reached the skip link first. The settings button had a 3 px focus outline, opened with Enter, rejected duplicate lane keys with a visible error, closed with Escape, and restored focus.
- Fresh route navigation and browser back moved focus to the new h1.

## Sample, run, and recovery evidence

- One click from the landing page opened `/demo` with **Demo — sample data, nothing is saved**, the realistic prior score **18,420**, active track `1 / 6`, and moving notes.
- A seeded real-data sentinel was present before sample entry. It was unchanged during sample play, after the loss, and after reset.
- A real timed no-input live sample reached the actual **Run ended** screen at **0:06 played** with **Three missed phrases ended this run.**
- **Reset demo** restored active track `1 / 6`, score `0`, moving play, and the persistent sample label.
- All observed landing and sample traffic stayed on `https://pulse-run.sociobot.in`.
- Clean deterministic coverage separately reaches the 3:00 win screen, proves the five between-track choices, and verifies play-again reset and real-run reload recovery.

Recorded evidence includes `desktop-first-screen.png`, `phone-first-screen.png`, `demo-active-run.png`, and `demo-loss-end-screen.png` in `/work/.evidence/pulse-run-review-1/`.

## Routes, accessibility, privacy, and performance

- `/`, `/demo`, `/privacy`, `/terms`, `/license`, `/404.html`, `/404.css`, `/billing-offer.json`, `/robots.txt`, `/sitemap.xml`, both icons, and the social card returned 200. Every discovered same-origin link returned 200.
- Each application route has its expected distinct title, one h1, one main landmark, and `lang=en`.
- Live axe scans found zero serious or critical violations on `/`, `/demo`, `/privacy`, `/terms`, `/license`, and the 404 recovery page.
- The privacy control deleted all Pulse Run local-storage keys and announced the result.
- The unknown route deliberately returned HTTP 404. It displayed **Page not found**, product styling, no overflow, and a working return link. Chromium logged only its generic failed-resource message for the expected 404 status. Direct `/404.html` returned 200 without console errors.
- `verify-url.sh` passed: correct title and language, one h1, main landmark, no missing image alt text, no unlabeled button, and no console error.
- Mobile Lighthouse: Performance 100, Accessibility 96, Best Practices 100, SEO 100; LCP 997.5 ms, CLS 0, TBT 0 ms.
- Security headers include CSP, HSTS, permissions policy, referrer policy, frame denial, and content-type protection.

The static build stays well below the JavaScript and CSS budgets. Pulse Run does not advertise offline reload, multiplayer, uploads, user charts, competitive ranking, or a backend. Offline/update, multiplayer-client, tenant, restart-persistence, health, rate-limit, SQLite, CLI, library, and desktop-artifact checks therefore do not apply.

## Earlier finding disposition

| Earlier finding | Current disposition |
| --- | --- |
| Sample-banner contrast | Resolved; the live label remains legible and current axe scans have no serious or critical finding. |
| Mobile targets, 200% text, and overflow | Resolved; live targets, zoom, and overflow passed on a 390 px phone. |
| Paid percussion catalog completeness | Resolved; pages and metadata list Copper, Paper, and Glass for $5 USD once. |
| Real-run refresh recovery | Resolved; the clean browser suite restores the saved run in a paused state. |
| Missing game in the 390 × 664 first screen | Resolved; 148.86 px of the live canvas is visible. |
| False run-change wording and ineffective Steady count | Resolved; wording covers each effect, and all six changes have separate outcome checks. |
| Seven unregistered public promises | Resolved; 16 current claims each have one tagged command, and all commands passed. |
| Inline 404 styling blocked by CSP | Resolved; the same-origin stylesheet loads, computed colors match the design, and no CSP error remains. |

## Offer and scope

Pulse Run Complete is a public **$5 USD one-time offer**, not a subscription. It adds the Copper, Paper, and Glass original percussion sets. The free game remains an honest complete six-track run with Circuit and six run changes.

Billing registration and entitlement validation remain an external operator dependency. The product says checkout, payment, and activation are unavailable and untested. No purchase or activation was attempted or claimed as passed.

There is no missed AI feature: the brief calls for deterministic play and original synthesized percussion, not generated user content. The researched non-goals remain intact. No product code, deployment, infrastructure, secret, unrelated product, or shared service was accessed or changed during this review.

## Evidence

Review evidence is in `/work/.evidence/pulse-run-review-1/`, including live browser results, screenshots, `verify-url.sh` output, and Lighthouse JSON. The required copies are `/work/.evidence/qa-report.md` and `/work/.evidence/qa-result.json`.
