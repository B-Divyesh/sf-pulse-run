# Pulse Run independent verification 2

Date: 6 September 2026

## Verdict: FAIL

Implementation candidate reviewed: `5eb3e9ab34da8f393985c40286591be8e0989ef6` (`repair mobile game entry and public claims`).

Documentation baseline reviewed: `5fabf6e36c6d19e2ae8d215861421e278dca8ad0` (`update repair handoff`). It changes reports only; the live JavaScript and CSS hashes match the `5eb3e9a` production build.

Live URL: <https://pulse-run.sociobot.in>

Pulse Run's job is a finite, single-player keyboard rhythm run. It is for keyboard players who want a short original-percussion browser game without an account or download. Before scrolling, a fresh desktop and 390 × 664 phone page say **Play a three-minute rhythm run**, identify that audience, offer **Try it with sample data**, and show the working game canvas.

This review has **one finding** and **zero untested declared or public claims**. A PASS requires zero findings at every severity, so the verdict is FAIL.

## Finding

1. **Medium — the designed unknown-route 404 is broken by the deployed CSP and logs a console error.** `GET /does-not-exist` correctly returns HTTP 404, which is expected. Its delivered `404.html` contains an inline `<style>` block, while the response CSP is `style-src 'self'`. Chromium blocks that block and reports: `Applying inline style violates the following Content Security Policy directive 'style-src 'self''`. Thus the required designed recovery page loses its product styling and has a console error on load. The same result occurs when loading `/404.html` (which returns 200 as a direct static document). This is not a finding against the deliberate HTTP 404 status; it is a finding against the broken page and CSP incompatibility.

## Local candidate verification

A fresh detached clone at `/tmp/pulse-run-verify-2-clean.PVzCSu` was checked out at `5eb3e9a`.

```sh
npm ci
npm test
npm run build
```

- `npm ci` installed 61 packages with 0 vulnerabilities.
- `npm test` passed 6 Vitest tests and 33 Playwright tests.
- `npm run build` created `dist/`. The production JS is 36,568 bytes and CSS is 12,236 bytes (well below the static-product budget).
- All 16 commands declared in `.factory/claims.json` were run separately from that clean checkout. Every command passed once.

## Claim commands

| Claim ID | Result | Evidence |
| --- | --- | --- |
| `complete-run` | PASS | deterministic six-track win reaches 3:00 end screen |
| `three-misses` | PASS | third missed phrase shows loss end screen |
| `restart-reset` | PASS | play again restores clean track, score, misses, and changes |
| `settings-persist` | PASS | sound, assist, and remapped keys restore after real-run reload |
| `local-play-data` | PASS | real/sample storage boundary and same-origin requests asserted |
| `demo-isolation` | PASS | seeded sample label, reset, and untouched real sentinel asserted |
| `one-time-offer` | PASS | visible and JSON offer agree on $5 USD once and unavailable checkout |
| `input-modes` | PASS | keyboard and touch controls each score a note |
| `remappable-input` | PASS | all four remapped lanes score notes |
| `free-run-changes` | PASS | all six changes have distinct tested play outcomes |
| `no-account-ads-tracking` | PASS | account-free entry and same-origin-only resources asserted |
| `audio-gesture` | PASS | percussion unlocks only after action; no media capture request |
| `assist-timing` | PASS | wider setting accepts a previously missed timing offset |
| `delete-play-data` | PASS | visible privacy action empties all product keys |
| `built-in-scope` | PASS | no uploads, ranking/room UI, or WebSockets |
| `frame-rate` | PASS | at least 50 fps under 4× CPU throttle in phone viewport |

There are no untested claims: the live/README public statements about run length, loss, reset, local data, demo isolation, one-time price, input, changes, account/tracking absence, audio, assist timing, deletion, single-player scope, and frame rate map to the registry above. Checkout and activation are clearly stated as unavailable rather than claimed to work.

## Live browser verification

- Fresh desktop and phone contexts loaded the landing page with no console/page errors. The first-screen phone canvas begins at y=515.14 px; 148.86 px remains visible in the 390 × 664 viewport, and horizontal overflow is zero.
- One click entered `/demo`. It displayed **Demo — sample data, nothing is saved**, prior score **18,420**, and active track `1 / 6`. In a clean context it had no local-storage keys. A no-input run reached the real **Run ended** screen after three missed phrases at `0:06 played`. **Reset demo** restored active track `1 / 6`, score `0`, its label, and empty storage.
- Fresh landing/demo traffic used only `https://pulse-run.sociobot.in`; no third-party request was observed. The deployed JS and CSS SHA-256 hashes equal the locally built candidate hashes.
- `/`, `/demo`, `/privacy`, `/terms`, `/license`, `/billing-offer.json`, `/robots.txt`, and `/sitemap.xml` return 200. The unknown route returns deliberate HTTP 404; its CSP/style defect is the finding above.
- Route titles update in a browser and every checked route has one `h1` and one `main`. Keyboard, dialog focus restoration, duplicate-key validation, reduced motion, touch targets, 200% text, privacy deletion, refresh recovery, routes/back navigation, and deterministic end states passed in the browser suite.
- `/opt/fleet/lib/verify-url.sh` passed for the landing page: title, `lang=en`, one h1, main landmark, no missing image alt text, no unlabeled buttons, and no landing-page console errors.
- Live axe scans on `/`, `/demo`, `/privacy`, `/terms`, `/license`, and the unknown 404 found zero axe violations. This does not clear the separate CSP console error on the 404.
- A successful live mobile Lighthouse run recorded Performance 100, Accessibility 96, Best Practices 100, SEO 100, LCP 1.0 s, CLS 0, and TBT 30 ms.

Evidence: `/work/.evidence/pulse-run-verify-2-live/`, including desktop/phone/sample/end-screen screenshots, `live-check.json`, `verify-url/verify.json`, and `lighthouse-mobile-retry.json`.

## Earlier review findings

| Earlier item | Current disposition |
| --- | --- |
| No game in the 390 × 664 first viewport | Resolved. 148.86 px of canvas is visible on a fresh live phone page. |
| Phrase shield contradicted the change statement; Steady count was ineffective | Resolved. The public wording includes missed-phrase protection and the isolated change test proves shield and the repeating Steady count pattern. |
| Seven public promises had no declared outcome checks | Resolved. All 16 public claims are registered, each has one tagged command, and every command passed independently. |
| Sample banner contrast, targets/overflow, paid offer catalog, and refresh recovery | Resolved by the current browser suite and live checks. |
| Billing registration and entitlement validation | Still an honest external dependency. Checkout and activation are unavailable and were not represented as passed. |

No product code was changed during this verification. The required repair is to make the deployed 404 styling compatible with the CSP (for example by serving a same-origin stylesheet or authorizing only that known style safely), then re-run fresh unknown-route console and visual checks.
