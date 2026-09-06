# Pulse Run verification 3

Date: 6 September 2026

## Verdict: PASS

Implementation candidate reviewed: `aba0b954a3111835dd9a8a87af1b5f104035ae5c` (`fix styled 404 under content security policy`).

Documentation baseline reviewed: `f5f0a53f748d0a66c1f01c4970c0a74ebc67fcd3` (`record repair 3 verification`). It is report-only; the live JavaScript and 404 stylesheet hashes match a clean build of the implementation candidate.

Live URL: <https://pulse-run.sociobot.in>

Finding count: **0**. Untested claim count: **0**.

Pulse Run's job is a finite single-player browser rhythm run. It is for keyboard players who want original synthesized percussion without an account or download. Before scrolling, fresh desktop and 390 × 664 phone browsers show **Play a three-minute rhythm run**, name that audience, offer **Try it with sample data**, and show the active game canvas.

## Clean candidate verification

A new detached checkout at `/tmp/pulse-run-verify-3-clean.aPxueg` was checked out at `aba0b95`.

```sh
npm ci
npm test
npm run build
```

- `npm ci` installed 61 packages with zero vulnerabilities.
- `npm test` passed all 6 deterministic simulation tests and all 33 Playwright tests.
- `npm run build` produced `dist/`. Its application JavaScript is 36,568 bytes (11.39 kB gzip) and CSS is 12,236 bytes (3.65 kB gzip).
- All 16 commands declared in `.factory/claims.json` were run individually from the clean checkout and passed: `complete-run`, `three-misses`, `restart-reset`, `settings-persist`, `local-play-data`, `demo-isolation`, `one-time-offer`, `input-modes`, `remappable-input`, `free-run-changes`, `no-account-ads-tracking`, `audio-gesture`, `assist-timing`, `delete-play-data`, `built-in-scope`, and `frame-rate`.
- The registry has 16 claims and every ID occurs in exactly one tagged browser test.

The clean browser suite covers the deterministic six-track 3:00 win, exact third-miss loss, restart reset, refresh recovery, invalid duplicate-key rejection, all four remapped lanes, keyboard and touch play, all six run changes, settings persistence, wider timing, reduced motion, focus restoration, 200% text, mobile target size, privacy deletion, route/back behavior, production-CSP 404 behavior, and the throttled phone frame-rate claim.

## Live verification

- Fresh desktop: HTTP 200, title **Pulse Run — Play a three-minute rhythm run**, one `h1`, one `main`, no console or page errors, no horizontal overflow, and 395.79 px of the game canvas visible in the first viewport.
- Fresh phone (390 × 664): HTTP 200, the same title/job/audience/action, no horizontal overflow, and 148.86 px of the game canvas visible in the first viewport.
- One click from the fresh landing page opened `/demo`. It showed the persistent **Demo — sample data, nothing is saved** label, prior score **18,420**, and active track `1 / 6`.
- A no-input live sample reached the actual **Run ended** screen at **0:06 played** with the text **Three missed phrases ended this run.** The recorded end-screen evidence is `live-demo-loss-end-screen.png`.
- Reset demo restored active track `1 / 6` and score `0`. A seeded real-data sentinel was unchanged before sample entry, while playing the sample, and after reset. Sample traffic used only `https://pulse-run.sociobot.in`.
- `/`, `/demo`, `/privacy`, `/terms`, `/license`, `/404.html`, `/404.css`, `/billing-offer.json`, `/robots.txt`, and `/sitemap.xml` returned HTTP 200. Every discovered same-origin link returned 200.
- Every application route had its expected distinct title, one `h1`, and one `main`. Live axe scans found zero serious or critical violations on `/`, `/demo`, `/privacy`, `/terms`, and `/license`.
- The live unknown route deliberately returned HTTP 404. It displayed **Page not found**, the product background `rgb(16, 23, 34)`, and a working recovery link. It had zero serious/critical axe findings and zero horizontal overflow. Chromium emitted only its generic resource message for the deliberate 404 status; this is expected, not a CSP or product-page error. Direct `/404.html` returned 200 with no console errors.
- `verify-url.sh` passed: title, `lang=en`, one `h1`, main landmark, image alt text, button labels, and a landing page free of console errors.
- Live JavaScript SHA-256 and `/404.css` SHA-256 match the clean `aba0b95` build. The 404 stylesheet is same-origin and compatible with `style-src 'self'`.
- Mobile Lighthouse: Performance 100, Accessibility 96, Best Practices 100, SEO 100; LCP 966.732 ms, CLS 0, TBT 26 ms.

## Earlier findings

| Earlier finding | Current disposition |
| --- | --- |
| Sample-banner contrast | Resolved; clean and live axe checks have no serious or critical issue. |
| Mobile targets, 200% text, overflow, and missing first-screen game | Resolved; the phone has zero overflow and 148.86 px of visible canvas. |
| Incomplete modifier wording and ineffective Steady count | Resolved; the six distinct changes are publicly described accurately and individually tested. |
| Unregistered public promises | Resolved; all 16 public claims have one tagged command and each command passed. |
| Real-run refresh recovery | Resolved; it passes in the clean browser suite. |
| Paid percussion catalog and price clarity | Resolved; the public metadata and pages agree on $5 USD once for Copper, Paper, and Glass. |
| 404 inline CSS blocked by CSP | Resolved; live `/404.css` loads under the deployed CSP, the page is styled, and direct 404 has no console error. |

## Scope and external dependency

Pulse Run Complete is a public **$5 USD one-time offer**, not a subscription. It adds Copper, Paper, and Glass original percussion sets. Billing registration and entitlement validation remain an external operator dependency; checkout and activation are clearly unavailable, were not attempted, and are not claimed as passed. The free sample and complete free run remain usable without it.

The product advertises no multiplayer, uploads, user charts, competitive ranking, offline reload, or backend service. Therefore no multiplayer/client or backend/tenant checks apply.

## Evidence

Evidence is in `/work/.evidence/pulse-run-verify-3/`, including clean command logs, one log for each claim command, browser results, desktop/phone/demo/end-screen/404 screenshots, route/link checks, CSP asset hashes, accessibility results, and Lighthouse JSON.

No product code was changed during this verification.
