# Review 3 — Play a three-minute rhythm run

Date: 6 September 2026

## Verdict: PASS

Finding count: **0**. Untested claim count: **0**.

Implementation candidate reviewed: `79fb623379d8142c929b7b0e3c1d73364897328d` (`fix mobile wordmark accessible name`).

Documentation baseline reviewed: `0a684b67ccd1c314c48d757a8e36d0762c3c79d9` (`record verification 5 pass`). Its changes after the implementation candidate are reports only. The deployed JavaScript and CSS match a clean build of the implementation candidate.

Live URL: <https://pulse-run.sociobot.in>

Pulse Run's job is a finite, single-player rhythm run. It is for keyboard players who want original synthesized percussion without an account or download. Before scrolling, fresh desktop and 390 × 664 phone browsers show **Play a three-minute rhythm run**, name that audience, offer **Try it with sample data**, and show the game itself.

The work order's external `factory-evidence/pulse-run-verify-5/qa-report.md` copy was not mounted in this disposable worker. I read the full committed `.factory/verification-5.md`, the preceding reviews and verifications, and then independently repeated the required checks.

## Clean candidate and declared claims

A fresh detached checkout at the implementation commit was used.

```sh
npm ci
npm test
npm run build
```

- `npm ci` installed 61 packages and reported zero vulnerabilities.
- `npm test` passed 6 deterministic Vitest tests and 34 Chromium browser tests.
- `npm run build` produced `dist/`. Application JavaScript is 36,596 bytes (11.40 kB gzip), and CSS is 12,236 bytes (3.65 kB gzip).
- The registry contains 16 IDs. Each ID occurs in exactly one tagged browser test.
- Every declared command was then run separately from the clean checkout.

| Claim | Result | Observable result |
| --- | --- | --- |
| `complete-run` | PASS | Six tracks, five choices, and 3:00 reach the win screen. |
| `three-misses` | PASS | The third missed phrase reaches the loss screen. |
| `restart-reset` | PASS | Play again clears track, score, misses, and changes. |
| `settings-persist` | PASS | Sound, wider timing, and remapped keys persist in a real run. |
| `local-play-data` | PASS | Product data stays local and gameplay requests stay same-origin. |
| `demo-isolation` | PASS | One-click sample entry, persistent label, reset, and real-data isolation work. |
| `one-time-offer` | PASS | Pages and public metadata agree on $5 USD once and the three paid sets. |
| `input-modes` | PASS | Keyboard and touch controls each score notes. |
| `remappable-input` | PASS | Every remapped lane key plays its lane. |
| `free-run-changes` | PASS | All six free changes have distinct effects with Circuit. |
| `no-account-ads-tracking` | PASS | Play starts without identity UI and loads no third-party resource. |
| `audio-gesture` | PASS | Audio unlocks after input and recording is never requested. |
| `assist-timing` | PASS | Wider timing accepts an offset rejected by normal timing. |
| `delete-play-data` | PASS | The privacy action clears every product storage key. |
| `built-in-scope` | PASS | No upload, ranking, room control, or WebSocket is present. |
| `frame-rate` | PASS | Phone-sized Chromium under 4× CPU throttling stays above 50 fps. |

The site, README, legal copy, offer metadata, design thesis, and copy audit were cross-checked against the registry. No public claim is missing, false, incomplete, or untested.

## Live gameplay and sample isolation

- Fresh desktop showed 395.79 px of game canvas in the first viewport. Fresh 390 × 664 phone showed 148.86 px, the job, audience, first action, and no horizontal overflow.
- One click opened `/demo` with **Demo — sample data, nothing is saved**, prior score **18,420**, track `1 / 6`, and active notes.
- A real-storage sentinel remained unchanged through sample play, loss, Play again, and Reset demo. Reset restored track `1 / 6` and score `0` while the sample label remained visible.
- The deterministic deployed sample reached the actual **Run ended** screen after the third missed phrase at `0:06 played`.
- A separate fresh real client used normal D/F/J/K browser keyboard events and the five deployed choice buttons. Browser frame timestamps were accelerated without a product QA hook; the deployed fixed-timestep game reached the actual **Run complete** screen at `3:00 played`, with 478,345 points and a 510-note streak.
- Play again after the win restored track `1 / 6` and score `0`. A separate real run reloaded into **Run paused** and resumed from its saved state.
- Live phone touch controls scored 83 points. No multiplayer path was tested because the product explicitly provides and advertises single-player play only.

Screenshots record the desktop and phone first screens, active sample, loss end screen, win end screen, and 404 page under `/work/.evidence/pulse-run-review-3/`.

## Normal, invalid, boundary, and recovery paths

- Normal keyboard, touch, choice, win, loss, restart, and real-run start paths passed.
- Duplicate lane keys produced **Choose a different key for each lane**, kept the settings dialog open, and Escape restored focus to Settings.
- Every visible first-screen phone target measured at least 44 × 44 CSS px. Text at 200% produced no horizontal overflow.
- The first Tab stop was **Skip to main content**. Settings had a visible 3 px solid focus outline.
- Reduced motion changed the tested interface transition to `0.00001s`.
- Real-run reload recovery, browser Back focus, and privacy deletion recovery passed.

## Accessibility, routes, privacy, and links

- Chromium 145, Firefox 146, and WebKit 26 each checked `/`, `/demo`, `/privacy`, `/terms`, and `/license` in fresh 390 × 844 contexts.
- Every route returned 200, had its expected title, exactly one `h1`, one `main`, a named **Pulse Run home** link, and zero serious or critical axe findings.
- The privacy action removed all Pulse Run local-storage keys and announced the deletion.
- Landing and sample traffic used only `https://pulse-run.sociobot.in`. No account form, ad, analytics request, tracking pixel, third-party script, upload, WebSocket, or room UI appeared.
- `verify-url.sh` passed: HTTPS 200, title, `lang=en`, one h1, main landmark, image alternatives, button labels, and no console error.
- `/billing-offer.json`, `/robots.txt`, `/sitemap.xml`, the favicon, apple-touch icon, and social card returned 200. All application routes passed, the external Param Factory link returned 200, and the contact link is an explicit `mailto:` link.
- The unknown route deliberately returned HTTP 404 with title **Page not found — Pulse Run**, heading **Page not found**, one main landmark, product styling, no overflow, no serious or critical axe result, and a working return link. The deliberate HTTP 404 is expected.
- Live responses include CSP, HSTS, referrer policy, content-type protection, permissions policy, and frame denial.

## Performance and deployed identity

- Live phone gameplay measured 60.00 request-animation frames per second under 4× Chromium CPU throttling.
- Mobile Lighthouse: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1,039.858 ms, CLS 0, and TBT 0 ms.
- The deployed JavaScript SHA-256 is `6bcece92d5fb0cf5998f0da964415fe26a5185ae95a388eca55750bff3f01ba7`, identical to the clean candidate build.
- The deployed CSS SHA-256 is `407736989fb42880eced773f6a3a7327f63f57455c546e8cdec41f8ba6d5a6ee`, identical to the clean candidate build.
- The static build is well below the 200 kB JavaScript and 50 kB CSS budgets.

## Earlier finding disposition

| Earlier finding | Current disposition |
| --- | --- |
| Sample-banner contrast | Resolved. The label is persistent and visible; live axe checks are clear. |
| Phone targets, 200% text, overflow, and missing first-screen game | Resolved. Targets are at least 44 px, zoom has no overflow, and 148.86 px of canvas is visible. |
| Phrase shield contradicted the modifier wording | Resolved. The wording includes missed-phrase protection and the outcome test passes. |
| Steady count did not affect play | Resolved. Its repeating lane pattern passes the isolated outcome test. |
| Seven public promises lacked claim tests | Resolved. All 16 public claims have one tagged command, and every command passed separately. |
| Real-run refresh recovery | Resolved. The fresh live run reloaded paused and resumed. |
| Paid percussion catalog and price clarity | Resolved. Public pages and metadata agree on $5 USD once for Copper, Paper, and Glass. |
| 404 inline styling was blocked by CSP | Resolved. The same-origin stylesheet renders under production CSP. |
| Phone wordmark lacked an accessible name | Resolved. **Pulse Run home** is present on every application route in all three engines. |

## Offer, scope, and remaining dependency

Pulse Run Complete costs **$5 USD once** and is not a subscription. It adds the Copper, Paper, and Glass original percussion sets. The free Circuit run and all six run changes remain available. Public metadata contains only the offer name, slug, price, currency, type, return URL, evidence text, included content, and validation path.

Billing registration and entitlement validation remain an operator dependency. Checkout, payment, and activation are visibly unavailable, were not attempted, and are not reported as working.

Pulse Run does not promise offline reload, multiplayer, uploads, user charts, rankings, a backend, health endpoints, rate limits, or a CLI/library/desktop artifact. Those checks do not apply. AI would not improve the brief's deterministic rhythm loop, so there is no missed AI feature.

No product code, deployment, infrastructure, secret, unrelated service, or shared database was accessed or changed.

## Evidence

Review evidence is under `/work/.evidence/pulse-run-review-3/`, including one log per claim, `live-review.json`, screenshots, `verify-url/verify.json`, and `lighthouse-mobile.json`. The required copies are `/work/.evidence/qa-report.md` and `/work/.evidence/qa-result.json`.
