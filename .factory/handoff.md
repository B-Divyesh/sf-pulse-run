# Pulse Run verification 5 handoff

Date: 6 September 2026

Live product: <https://pulse-run.sociobot.in>

Artifact class: `browser-game`

## Status

Independent verification 5 passed with zero findings and zero untested claims. No product code was changed during this verification.

- Implementation and deployed artifact: `79fb623379d8142c929b7b0e3c1d73364897328d` (`fix mobile wordmark accessible name`).
- Documentation baseline reviewed: `5fedbf7c283804bc810df4feff4925b40af588c5` (`record repair 4 verification`), a report-only commit.
- The deployed application JavaScript SHA-256 is `6bcece92d5fb0cf5998f0da964415fe26a5185ae95a388eca55750bff3f01ba7`, identical to the clean local build.

## How to verify

From this checkout:

```sh
npm ci
npm test
npm run build
```

- The clean suite passed 6 Vitest tests and 34 Chromium Playwright tests.
- Each of the 16 isolated claim commands in `.factory/claims.json` passed separately.
- `dist/` was produced. Application JavaScript is 36,596 bytes (11.40 kB gzip); CSS is 12,236 bytes (3.65 kB gzip).

## Live checks

- `verify-url.sh` passed over HTTPS: HTTP 200, correct title and language, one h1, one main landmark, no missing alt text, no unnamed buttons, and no console error.
- Fresh Chromium, Firefox, and WebKit phone checks passed on `/`, `/demo`, `/privacy`, `/terms`, and `/license`: expected title, one h1, one main, named **Pulse Run home** link, and no serious or critical axe result.
- Fresh desktop and 390 × 664 phone clients showed the job, audience, first action, and active game before scrolling. Canvas visibility was 395.81 px on desktop and 148.86 px on phone, with no horizontal overflow.
- One click entered the populated sample with the persistent **Demo — sample data, nothing is saved** label and prior score 18,420. Reset restored track 1 / 6 and score 0 while leaving a seeded real-data sentinel unchanged.
- A no-input live sample reached the actual loss screen at 0:06. A separate fresh real run used normal D/F/J/K browser events, five deployed choice buttons, and reached **Run complete** at **3:00 played**. No local QA hook exists on the live origin.
- Duplicate key settings recover with a visible error; the privacy control deletes product storage and announces the result; reduced motion is active; live phone Chromium was 60.45 fps under 4× CPU throttling.
- The designed unknown route correctly returns HTTP 404 with a styled accessible recovery page. The expected failed-resource console message for this deliberate 404 is not a defect.
- `/`, `/demo`, `/privacy`, `/terms`, `/license`, `/billing-offer.json`, `/robots.txt`, and `/sitemap.xml` returned 200. CSP, HSTS, permissions policy, referrer policy, frame denial, and content-type protection are present.

## Earlier finding disposition

| Finding | Current disposition |
| --- | --- |
| Phone wordmark link had no accessible name | Resolved across all application routes in three engines. |
| Sample-banner contrast | Resolved; the label remains visible and axe is clear. |
| Phone targets, 200% text, overflow, and missing first-screen game | Resolved by the browser suite and live phone checks. |
| Incomplete run-change wording and ineffective Steady count | Resolved; all six effects have outcome checks. |
| Unregistered public promises | Resolved; 16 public claims have one tagged command each. |
| Real-run refresh recovery | Resolved by the clean browser suite. |
| Paid percussion catalog and price clarity | Resolved; public pages and metadata agree on $5 USD once and three paid sets. |
| 404 inline CSS blocked by CSP | Resolved; the same-origin stylesheet works under production CSP. |

## Offer and remaining dependency

Pulse Run Complete costs **$5 USD once** and is not a subscription. It adds Copper, Paper, and Glass. The free Circuit run and all six free run changes remain available.

The billing operator still needs to register `pulse-run-complete` and provide entitlement validation. Checkout and activation remain visibly unavailable. No purchase or activation was attempted or claimed as working.

Offline reload, multiplayer, uploads, user charts, competitive ranking, and a backend are not advertised. No backend, database, shared service, unrelated resource, or secret was accessed.

Evidence is under `/work/.evidence/pulse-run-verify-5/`. The complete independent report is `.factory/verification-5.md`.
