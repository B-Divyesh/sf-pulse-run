# Pulse Run review 3 handoff

Date: 6 September 2026

Live product: <https://pulse-run.sociobot.in>

Artifact class: `browser-game`

## Status

Strict review 3 passed with **zero findings** and **zero untested claims**. No product code was changed.

- Implementation and deployed artifact: `79fb623379d8142c929b7b0e3c1d73364897328d` (`fix mobile wordmark accessible name`).
- Documentation baseline reviewed: `0a684b67ccd1c314c48d757a8e36d0762c3c79d9` (`record verification 5 pass`).
- Live JavaScript SHA-256: `6bcece92d5fb0cf5998f0da964415fe26a5185ae95a388eca55750bff3f01ba7`, identical to the clean implementation build.

## How to verify

```sh
npm ci
npm test
npm run build
```

- Clean results: 6 Vitest tests and 34 Chromium browser tests passed.
- Each of the 16 commands in `.factory/claims.json` passed separately.
- `dist/` was produced. JavaScript is 36,596 bytes (11.40 kB gzip); CSS is 12,236 bytes (3.65 kB gzip).

## Live results

- Fresh desktop and 390 × 664 phone sessions show the job, audience, sample action, and game before scrolling.
- The one-click sample showed score 18,420 and the persistent sample label. It reached the real loss screen at 0:06, reset to track 1 with score 0, and did not change a real-data sentinel.
- A fresh real client used D/F/J/K and five deployed choice buttons to reach **Run complete** at 3:00. Play again reset the run. Touch input also scored, and reload recovered a real run paused.
- Invalid duplicate keys, keyboard focus, 200% text, 44 px phone targets, reduced motion, privacy deletion, and browser navigation passed.
- Chromium, Firefox, and WebKit phone contexts found no serious or critical axe issue on all five application routes.
- The designed unknown route correctly returns HTTP 404 with an accessible styled recovery page.
- Live phone gameplay measured 60.00 fps under 4× CPU throttling.
- Mobile Lighthouse scored 100 for Performance, Accessibility, Best Practices, and SEO. LCP was 1.04 s, CLS 0, and TBT 0 ms.
- `verify-url.sh` passed. Security headers, route titles, links, metadata, public offer metadata, and the live/candidate asset identity passed.

## Offer and known dependency

Pulse Run Complete costs **$5 USD once**, not a subscription. It adds Copper, Paper, and Glass. Checkout and activation remain visibly unavailable until the billing operator registers the offer and entitlement validation. No purchase or activation was attempted or claimed as working.

Offline reload, multiplayer, uploads, user charts, rankings, and backend behavior are not advertised. No backend, database, secret, unrelated product, or shared service was accessed.

The full report is `.factory/review-3.md`. Evidence is under `/work/.evidence/pulse-run-review-3/`, with required copies at `/work/.evidence/qa-report.md` and `/work/.evidence/qa-result.json`.
