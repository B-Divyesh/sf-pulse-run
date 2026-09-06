# Pulse Run repair 4 handoff

Date: 6 September 2026

Live product: <https://pulse-run.sociobot.in>

Artifact class: `browser-game`

## Status

Repair 4 is complete. The serious phone-header accessibility finding from verification 4 is resolved.

- Implementation and deployed artifact: `79fb623379d8142c929b7b0e3c1d73364897328d` (`fix mobile wordmark accessible name`).
- The later handoff commit changes documentation only.
- The deployed application JavaScript SHA-256 is `6bcece92d5fb0cf5998f0da964415fe26a5185ae95a388eca55750bff3f01ba7`, identical to the clean local build.

## Repair

At widths up to 680 px, responsive CSS visually removes the wordmark text. The decorative mark is hidden from assistive technology, so the remaining focusable home link previously had no computed accessible name.

The wordmark link now keeps the explicit accessible name **Pulse Run home** at every viewport width. A permanent browser regression opens every application route at 390 × 844, resolves the link by its computed role and name, checks its home destination, and runs axe. It tests the browser outcome rather than searching source text.

## Clean verification

From this checkout:

```sh
npm ci
npm test
npm run build
```

Results:

- `npm ci` installed 61 packages with zero vulnerabilities.
- All 6 Vitest simulation tests passed.
- All 34 Playwright Chromium tests passed.
- The new phone wordmark test passed locally in Chromium 145, Firefox 146, and WebKit 26 across `/`, `/demo`, `/privacy`, `/terms`, and `/license`.
- All 16 commands in `.factory/claims.json` passed when invoked separately. Each claim ID occurs in exactly one tagged test.
- `dist/` was produced. Application JavaScript is 36,596 bytes (11.40 kB gzip), and CSS is 12,236 bytes (3.65 kB gzip).
- The throttled phone frame-rate claim passed at its required minimum of 50 fps.

The complete suite still covers the deterministic 3:00 win, exact third-miss loss, restart reset, real-run reload recovery, six distinct run changes, keyboard and touch input, all four remapped lanes, settings persistence, wider timing, sample isolation, privacy deletion, reduced motion, mobile target size, 200% text, route focus, dialog focus, security-compatible 404 styling, and every public claim.

## Live verification

The existing product-owned `sf-pulse-run` Static Web App was reused and the production deployment succeeded.

- `verify-url.sh` passed over HTTPS: HTTP 200, correct title and language, one h1, one main landmark, no missing alt text, no unnamed buttons, and no console error.
- All 18 live Chromium site tests passed. They cover the first screen, sample entry, refresh recovery, invalid settings, privacy deletion, titles and landmarks, browser Back focus, keyboard dialog behavior, phone layout, 44 px targets, 200% text, reduced motion, axe, and the designed 404.
- The repaired phone wordmark passed live route-level accessible-name and axe checks in Chromium 145, Firefox 146, and WebKit 26.
- Fresh 1366 × 900 desktop and 390 × 664 phone clients showed the job, audience, first action, and active game before scrolling. They had no console errors.
- One click entered the populated sample with the persistent **Demo — sample data, nothing is saved** label and prior score 18,420. Reset restored track 1 / 6 and score 0 while leaving a seeded real-data sentinel unchanged. All requests stayed on the product origin.
- A live production run used normal browser D/F/J/K events and five visible choice buttons. It reached **Run complete** with 268,614 points, a 360-note streak, and **3:00 played**. No local QA hook exists on the live origin.
- Playwright axe integration found no serious or critical issue on desktop or phone application routes. The standalone axe CLI was not used as evidence because its bundled ChromeDriver did not match the pinned Chromium; the permitted Playwright axe integration completed successfully instead.
- Mobile Lighthouse: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 990 ms, CLS 0, TBT 0 ms.
- `/`, `/demo`, `/privacy`, `/terms`, `/license`, `/billing-offer.json`, `/robots.txt`, and `/sitemap.xml` returned 200. The unknown route deliberately returned 404 with the designed recovery page.
- CSP, HSTS, permissions policy, referrer policy, frame denial, and content-type protection are present.

Evidence is under `/work/.evidence/pulse-run-repair-4/`, including cold phone and desktop screens, the reset sample, the real win screen, claim logs, URL verification, Lighthouse output, route status, response headers, and deployed hashes.

## Earlier finding disposition

| Finding | Current disposition |
| --- | --- |
| Phone wordmark link has no accessible name | Resolved by the persistent semantic name and verified across all routes in three engines. |
| Sample-banner contrast | Remains resolved; live axe is clear and the label is visible. |
| Mobile targets, 200% text, overflow, and missing first-screen game | Remain resolved in clean and live phone checks. |
| Incomplete run-change wording and ineffective Steady count | Remain resolved; all six effects pass their outcome checks. |
| Unregistered public promises | Remains resolved; 16 claims have one tagged test each and all commands passed separately. |
| Real-run refresh recovery | Remains resolved in clean and live checks. |
| Paid percussion catalog and price clarity | Remain resolved; pages and metadata agree on the $5 one-time offer and three paid sets. |
| 404 inline CSS blocked by CSP | Remains resolved; the same-origin stylesheet works under production CSP. |

## Offer and remaining dependency

Pulse Run Complete costs **$5 USD once** and is not a subscription. It adds Copper, Paper, and Glass. The free Circuit run and all six free run changes remain available.

The billing operator still needs to register `pulse-run-complete` and provide entitlement validation. Checkout and activation remain visibly unavailable. No purchase or activation was attempted or claimed as working. Public offer metadata only was copied to `/work/.evidence/billing-offer.json`.

Offline reload, multiplayer, uploads, user charts, competitive ranking, and a backend are not advertised. No backend, database, shared service, unrelated resource, or secret was accessed.
