# Pulse Run handoff

Date: 6 September 2026

Live product: <https://pulse-run.sociobot.in>

Artifact class: `browser-game`

## Status

The recorded repair findings are resolved. Pulse Run is a finite single-player keyboard rhythm run for players who want a short browser game without an account. The landing h1 says **Play a three-minute rhythm run**. Before scrolling, visitors see who it is for, **Try it with sample data**, and a visible working game canvas.

## Version record

- Implementation and deployed artifact: `5eb3e9ab34da8f393985c40286591be8e0989ef6` (`repair mobile game entry and public claims`)
- Verification documentation baseline: `502ce5cc698a1682284204745c399c2f624d277e` (`record repair verification`)
- This handoff is a report-only commit after those two commits; it makes no product-code change.
- Previous independent verification: [`verification-1.md`](verification-1.md), fail recorded at `4ec9f55d4ad41219f509b04d0eef69f8f7e8969c`
- Current repair verification: [`verification-2.md`](verification-2.md)

## What changed

- Made the phone first screen compact enough to show 148.86 px of the real game canvas in a 390 × 664 viewport; the regression test requires at least 96 px.
- Corrected the run-change statement. Phrase shield now fits the claim, and Steady count now changes the note pattern instead of doing nothing.
- Added outcome-based coverage for every public claim, including all four remapped keys, all six free run changes, gesture-gated audio, real/sample local data boundaries, account-free entry, assist timing, privacy deletion, and single-player built-in scope.
- Kept the researched one-time offer: Pulse Run Complete is **$5 USD once**, not a subscription. It adds Copper, Paper, and Glass percussion sets; it never adds ads.
- Replaced untestable public wording about audio with precise “synthesized percussion” wording, backed by the gesture/no-recording browser check.
- Copied public offer metadata to `/work/.evidence/billing-offer.json` and the 98-character verb-first catalog line to `/work/.evidence/catalog-description.txt`.

The researched non-goals remain: no imported songs, user charts, copyrighted recordings, rankings, accounts, ads, analytics, or multiplayer. The visual system remains the printed rhythm instrument described in [`design.md`](design.md), with hand-authored Canvas/CSS and locally synthesized percussion only.

## How to run and verify

Requirements: Node.js 20+ and npm.

```sh
npm ci
npm test
npm run build
```

From the fresh clone `/tmp/pulse-run-clean-5eb3e9a`:

- `npm ci`: 61 packages installed, 0 vulnerabilities.
- `npm test`: 6 Vitest tests and 33 Playwright tests passed.
- All 16 commands in [`.factory/claims.json`](claims.json) were run separately and passed.
- `npm run build`: created `dist/`; JavaScript is 36.57 KB (11.39 KB gzip) and CSS is 12.24 KB (3.65 KB gzip).
- The suite covers deterministic win/loss, restart, choices, keyboard/touch/remapped input, settings, refresh recovery, demo reset/isolation, phone layout, focus, reduced motion, 200% text, routes, designed 404, and axe scans.

Live verification after deployment:

- Fresh desktop and 390 × 664 phone contexts have no console/page errors. The phone canvas begins at y=515.14, leaving 148.86 px visible in the first viewport.
- One click opened `/demo`, showed the persistent demo label and realistic 18,420 previous score, then a no-input run reached **Run ended**. Reset restored track `1 / 6`, score `0`, active play, and empty local storage.
- `/`, `/demo`, `/privacy`, `/terms`, `/license`, `/billing-offer.json`, `/robots.txt`, and `/sitemap.xml` return 200. An unknown route intentionally returns the designed HTTP 404 page.
- `verify-url.sh` and live axe scans pass. Lighthouse mobile scored Performance 100, Accessibility 96, Best Practices 100, SEO 100; LCP 1.0 s, CLS 0.
- Live JavaScript/CSS SHA-256 hashes match local `dist/`. HTTPS sends CSP, HSTS, permissions, referrer, frame, and content-type protections.

Evidence: `/work/.evidence/pulse-run-repair-2-live/`.

## Deployment

`5eb3e9a` was pushed to `main` and deployed through the existing `sf-pulse-run` Static Web App in Central US. The existing app, hostname, TLS, and static configuration were reused. No backend, shared database, user data, or unrelated product was accessed.

## Known dependency and next step

The separate billing operator still needs to register `pulse-run-complete` and provide an entitlement-validation contract. Checkout and activation remain unavailable and are stated honestly on `/license`; no checkout, payment, or activation was attempted or claimed as successful. Once that contract exists, integrate and independently test entitlement before claiming it works.
