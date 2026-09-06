# Review 2 — Play a three-minute rhythm run

Date: 6 September 2026

## Verdict: PASS

Finding count: **0**. Untested claim count: **0**.

Implementation candidate reviewed: `aba0b954a3111835dd9a8a87af1b5f104035ae5c` (`fix styled 404 under content security policy`).

Documentation baseline reviewed: `79e335927b7a4114ec3f526fd3903fb06fa0c738` (`record strict review 1 pass`). The commits after the implementation candidate change only reports and the copy audit. Live JavaScript, CSS, 404 HTML, and 404 CSS hashes match a clean candidate build.

Live URL: <https://pulse-run.sociobot.in>

Pulse Run is a finite single-player browser rhythm run. It is for keyboard players who want original synthesized percussion without an account or download. Before scrolling, fresh desktop and 390 × 664 phone browsers show **Play a three-minute rhythm run**, name that audience, offer **Try it with sample data**, and show the game itself.

## Clean candidate verification

A fresh detached clone at `/tmp/pulse-run-review-2-clean.7Px3fA` was checked out at the implementation candidate.

```sh
npm ci
npm test
npm run build
```

- `npm ci` installed 61 packages and reported zero vulnerabilities.
- `npm test` passed all 6 deterministic simulation tests and all 33 Playwright browser tests.
- `npm run build` produced `dist/`. Application JavaScript is 36,568 bytes, or 11.39 kB gzip. CSS is 12,236 bytes, or 3.65 kB gzip.
- All 16 commands in `.factory/claims.json` were then run separately from the clean checkout. Every command passed.
- The registry contains 16 IDs. Each ID occurs in exactly one tagged browser test.

The clean suite covers the six-track 3:00 win, exact third-miss loss, restart reset, refresh recovery, all six run changes, keyboard and touch play, all four remapped lanes, duplicate-key rejection, persisted settings, wider timing, privacy deletion, sample isolation, route and browser-back focus, dialog focus, reduced motion, 200% text, phone targets, throttled frame rate, and production-CSP 404 styling.

## Claim results

| Claim | Result | Observable evidence |
| --- | --- | --- |
| `complete-run` | PASS | Six tracks, five choices, and 3:00 reach the win screen. |
| `three-misses` | PASS | The third missed phrase reaches the loss screen. |
| `restart-reset` | PASS | Play again clears track, score, misses, and changes. |
| `settings-persist` | PASS | Sound, wider timing, and a remapped key survive a real-run reload. |
| `local-play-data` | PASS | Real storage remains local; sample play leaves it unchanged; requests stay same-origin. |
| `demo-isolation` | PASS | One-click entry, persistent label, populated sample, and reset preserve the real sentinel. |
| `one-time-offer` | PASS | Pages and public metadata agree on $5 USD once and the three paid sets. |
| `input-modes` | PASS | Keyboard and touch inputs each score a note. |
| `remappable-input` | PASS | Every remapped lane key scores its note. |
| `free-run-changes` | PASS | All six free changes have distinct effects with Circuit. |
| `no-account-ads-tracking` | PASS | Play starts without identity UI; resources remain same-origin. |
| `audio-gesture` | PASS | Audio stays locked before input, unlocks after input, and never requests recording. |
| `assist-timing` | PASS | Wider timing accepts an offset rejected by normal timing. |
| `delete-play-data` | PASS | The privacy control deletes every product storage key. |
| `built-in-scope` | PASS | No upload, ranking, room control, or WebSocket appears. |
| `frame-rate` | PASS | Phone-sized Chromium under 4× CPU throttling remains at or above 50 fps. |

The live site, README, legal pages, public offer metadata, design thesis, and handoff were cross-checked against the registry. There are no missing public claim entries. Checkout and activation are explicitly unavailable, so they are not treated as tested capabilities.

## Live desktop and phone review

- Fresh desktop returned 200 with the title **Pulse Run — Play a three-minute rhythm run**, `lang=en`, one h1, one main landmark, no console or page errors, no horizontal overflow, and 395.79 px of visible canvas in the first viewport.
- Fresh 390 × 664 phone returned the same job, audience, and first action with no errors or overflow. The canvas begins at 515.14 px and shows 148.86 px before scrolling.
- Every visible phone target measured at least 44 × 44 CSS px. At 200% text there was no horizontal overflow or missing heading. Reduced motion removed interface transition duration.
- Tab reaches the skip link first. The settings button has a 3 px focus outline. Enter opens settings, duplicate lane keys show an error without closing the dialog, and Escape restores focus.
- Browser navigation and Back move focus to the current h1.

## Complete game loop and sample isolation

- One click from the landing page opened `/demo` with **Demo — sample data, nothing is saved**, the prior score **18,420**, active track `1 / 6`, and moving notes.
- A real-data sentinel was present before sample entry. It stayed unchanged during sample play, after the end screen, after Play again, and after Reset demo.
- A wall-clock, no-input live run reached the actual **Run ended** screen at **0:06 played** with **Three missed phrases ended this run.**
- A second fresh live client played the deployed production engine with normal keyboard events. Its browser clock advanced the fixed-timestep run deterministically. It completed six real 30-second tracks, selected five real change buttons, and reached **Run complete** at **3:00 played** with 448,597 points and a 450-note streak. No local-only QA hook was available or used on the live origin.
- Live touch controls separately scored 445 points. The live keyboard run scored on the same deployed game.
- Play again after both end states restored active track `1 / 6` and score `0`. Reset demo did the same while keeping the sample label and leaving real storage unchanged.
- A real run reloaded into **Run paused** and resumed at its saved place.

Recorded screenshots are `desktop-first-screen.png`, `phone-first-screen.png`, `demo-active-phone.png`, `live-loss-end-screen.png`, `live-win-end-screen.png`, and `live-404.png` under `/work/.evidence/pulse-run-review-2/`.

## Routes, accessibility, privacy, and performance

- `/`, `/demo`, `/privacy`, `/terms`, and `/license` return 200. Each has its expected route title, one h1, one main landmark, and zero serious or critical axe findings.
- Every discovered same-origin link returns 200. `robots.txt`, `sitemap.xml`, public offer metadata, icons, and social metadata are present.
- The unknown route deliberately returns HTTP 404. It shows **Page not found**, product styling, one main landmark, zero overflow, no unexpected console error, no serious or critical axe finding, and a working return link.
- The privacy action deletes all Pulse Run local-storage keys and announces the result.
- Observed game and sample traffic stayed on `https://pulse-run.sociobot.in`. No third-party request appeared.
- Security headers include CSP, HSTS, permissions policy, referrer policy, frame denial, and content-type protection.
- `verify-url.sh` passed: title, language, one h1, main landmark, image alt text, button labels, and no console error.
- Live Chromium measured 60.00 request-animation frames per second at 390 × 844 under 4× CPU throttling while the sample was active.
- Fresh mobile Lighthouse: Performance 100, Accessibility 96, Best Practices 100, SEO 100; LCP 957.9 ms, CLS 0, and TBT 20 ms.

The live application hashes match the clean candidate: JavaScript `37a98e319e8757875de01e68e15166f2c8d2a2e1487d978ca9b601a129b569e0`, CSS `407736989fb42880eced773f6a3a7327f63f57455c546e8cdec41f8ba6d5a6ee`, 404 HTML `f66654e3cbe5d2ca61d46c8217e3417e8ae638e80a8be64c32bcbf31ac48fcd9`, and 404 CSS `08ef6d1bed3762cd76533db6539d226fef2d2201c2548e1f517a5f8635c8349c`.

## Earlier finding disposition

| Earlier finding | Current disposition |
| --- | --- |
| Sample-banner contrast | Resolved. The label remains visible; live axe scans have no serious or critical result. |
| Mobile targets, 200% text, and overflow | Resolved. Fresh live phone targets, text scale, and overflow passed. |
| Paid percussion catalog completeness | Resolved. Pages and metadata list Copper, Paper, and Glass for $5 USD once. |
| Real-run refresh recovery | Resolved. A fresh live real run reloads paused and resumes. |
| No game in the 390 × 664 first screen | Resolved. The live phone shows 148.86 px of canvas before scroll. |
| Phrase shield contradicted the change copy | Resolved. The copy includes missed-phrase protection, and its effect passes the claim test. |
| Steady count did not affect play | Resolved. Its repeating lane pattern passes the isolated outcome check. |
| Seven public promises lacked claim tests | Resolved. There are 16 one-to-one tagged claims, and every command passed separately. |
| Inline 404 styling was blocked by CSP | Resolved. The live same-origin stylesheet loads, matches the candidate, and has no CSP error. |

## Offer and scope

Pulse Run Complete is a public **$5 USD one-time offer**, not a subscription. It adds Copper, Paper, and Glass original percussion sets. The free game remains a complete six-track run with Circuit and six run changes.

Billing registration and entitlement validation remain an external operator dependency. The product plainly says checkout, payment, and activation are unavailable and untested. No purchase or activation was attempted or claimed as passed. The JSON contains public offer metadata only.

The product does not advertise offline reload, multiplayer, uploads, user charts, competitive ranking, or a backend. Offline/update, independent multiplayer clients, tenant isolation, restart persistence, health, rate limits, SQLite, CLI, library, and desktop-artifact checks do not apply. There is no missed AI feature: deterministic rhythm play and original synthesized percussion fit the researched job without a model call.

No product code, deployment, infrastructure, secret, unrelated product, or shared service was changed during this review.

## Evidence

Evidence is under `/work/.evidence/pulse-run-review-2/`, including `live-review.json`, screenshots, `verify-url/verify.json`, and `lighthouse-mobile.json`. The required copies are `/work/.evidence/qa-report.md` and `/work/.evidence/qa-result.json`.
