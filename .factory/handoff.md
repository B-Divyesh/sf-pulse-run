# Pulse Run handoff

Date: 6 September 2026

Live product: <https://pulse-run.sociobot.in>

Artifact class: `browser-game`

## Status

Independent verification of implementation `5eb3e9ab34da8f393985c40286591be8e0989ef6` is **FAIL**. Documentation baseline: `5fabf6e36c6d19e2ae8d215861421e278dca8ad0`.

The finite single-player rhythm game, sample sandbox, public one-time offer disclosure, mobile first screen, and all declared claims passed. One deployed 404-page defect remains: its inline stylesheet is blocked by the deployed `style-src 'self'` CSP, so an unknown route logs a CSP error and loses its designed styling. The expected HTTP 404 status itself is not the problem.

## Verification completed

From a fresh detached candidate clone:

```sh
npm ci
npm test
npm run build
```

- `npm ci`: 61 packages, 0 vulnerabilities.
- `npm test`: 6 unit tests and 33 Playwright tests passed.
- All 16 `.factory/claims.json` commands passed separately.
- Build produced `dist/`; JS is 36,568 bytes and CSS is 12,236 bytes.
- Fresh live desktop and 390 × 664 phone contexts show the plain job, audience, first action, and working canvas. The phone canvas has 148.86 px visible in the first viewport.
- The one-click sample showed its persistent label and realistic previous score, reached the real loss end screen, reset to a clean sample, and did not write real local storage.
- Landing-page `verify-url.sh` and live axe scans passed. Lighthouse mobile: 100 performance, 96 accessibility, 100 best practices, 100 SEO; LCP 1.0 s, CLS 0, TBT 30 ms.

The full evidence and claim table are in [verification-2.md](verification-2.md). Screenshots and raw results are under `/work/.evidence/pulse-run-verify-2-live/` for this worker.

## Required next step

Repair the static 404 delivery so its product stylesheet is not blocked by the CSP, deploy it, then independently open an unknown route in a fresh browser and verify both the recovery styling and zero console errors. Do not mark the product PASS until that is clean.

## Billing dependency

`Pulse Run Complete` remains a public $5 USD one-time offer for Copper, Paper, and Glass percussion sets. Billing registration and entitlement validation are not yet available. Checkout and activation are accurately unavailable and must not be claimed as passed until the billing operator provides the contract and it is independently tested.
