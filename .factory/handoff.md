# Pulse Run handoff

Date: 6 September 2026

Live product: <https://pulse-run.sociobot.in>

Artifact class: `browser-game`

## Version record

- Implementation and documentation baseline: `e92afadd2c409d4fd343c7a681ae942c9dd3b519`
- Deployed artifact: production `dist/` built from that SHA
- Handoff: the report-only commit containing this file follows the deployed SHA and does not require another product image
- Starting scaffold: `77a9b606fb2ec155634b577fe051c67bf0d80cf8`

The admitted repository contained only the factory scaffold. There was no earlier implementation, design thesis, verification report, or completed handoff. The complete earlier Git history was the single scaffold commit.

## What shipped

- A deterministic, single-player, three-minute rhythm run with six 30-second tracks.
- A four-lane Canvas game with keyboard, remapped-key, pointer, and touch input.
- Three-missed-phrase loss, five between-track choices, win and loss summaries, and one-action restart.
- A fixed 60 Hz simulation with `requestAnimationFrame` rendering, clamped time, hidden-tab pause, and saved real-run recovery.
- Gesture-gated Web Audio percussion with the free Circuit arrangement.
- Three additional finished 16-step arrangements—Copper, Paper, and Glass—for Pulse Run Complete.
- Sound, reduced-effects, and wider-timing settings. Real settings persist locally.
- A one-click `/demo` sample with an active seeded run, populated prior result, persistent sample banner, reset, and in-memory isolation.
- Product routes for `/`, `/demo`, `/privacy`, `/terms`, and `/license`, plus a styled HTTP 404 response.
- Hand-authored Canvas, CSS, favicon, and 1200×630 social-card art. Provenance is in `.factory/design.md`.
- Responsive first screens for desktop and phone, 44 px targets, 200% text support, focus management, reduced-motion handling, and semantic landmarks.
- CSP, permissions, referrer, frame, and content-type headers through the Static Web App configuration.

The brief's non-goals remain intact: no imported songs, copyrighted audio, user charts, rankings, accounts, advertising, analytics, or multiplayer claim.

## Public offer

Pulse Run Complete is **$5 USD once**, not a subscription. It adds the Copper, Paper, and Glass original percussion sets. The free game remains a complete six-track run with Circuit and six run changes.

Public metadata exists at `/billing-offer.json`, `.factory/billing-offer.json`, and `/work/.evidence/billing-offer.json`. The catalog description is mirrored to `/work/.evidence/catalog-description.txt`.

Checkout registration and entitlement validation are not available. The `/license` route says this directly. No checkout, payment, or activation was attempted or reported as passing.

## Verification

Final clean checkout: `/tmp/pulse-run-clean-e92afad`

```sh
npm ci
npm test
npm run build
```

Results from the clean checkout:

- `npm ci`: 61 packages installed, 0 vulnerabilities.
- Vitest: 6 deterministic simulation tests passed.
- Playwright: 26 browser checks passed in Chromium.
- Every command in `.factory/claims.json` ran separately and passed.
- Build output: 35.89 KB JavaScript (11.12 KB gzip), 11.92 KB CSS (3.57 KB gzip), and `dist/` created.
- Throttled phone-size frame measurement: 60.0 fps under 4× CPU throttling; the claim threshold is 50 fps.

Browser coverage includes complete win, three-miss loss, restart reset, choices, keyboard and touch scoring, invalid duplicate mappings, settings persistence, refresh recovery, sample reset isolation, local request boundaries, route titles, History API focus, dialog focus, reduced motion, 44 px targets, 200% text, and mobile overflow.

Accessibility results:

- Axe Playwright scans on `/`, `/demo`, `/privacy`, `/terms`, and `/license`: 0 serious or critical issues.
- Worker `verify-url.sh` on live HTTPS: title present, `lang=en`, one `h1`, main landmark present, no missing alt text, no unlabeled buttons, and no console errors.
- Live Lighthouse mobile: Performance 100, Accessibility 96, Best Practices 100, SEO 100.
- Live metrics: LCP 1.0 s, FCP 0.9 s, CLS 0, TBT 0 ms.

Live checks:

- Fresh desktop and phone browser contexts loaded without console or page errors.
- The first screen states the play, audience, first actions, local-data fact, inputs, and price before scrolling.
- One click opened the active sample. A real timed no-input run reached the loss screen after three missed phrases.
- Reset returned the sample to track 1 with score 0 and left local storage empty.
- All runtime requests during the sample were same-origin.
- `/`, `/demo`, `/privacy`, `/terms`, `/license`, and `/billing-offer.json` returned 200.
- An unknown URL returned HTTP 404 with the designed recovery page.
- Live JavaScript and CSS SHA-256 hashes matched the final local `dist/` files exactly.
- HTTPS returned CSP, HSTS, permissions, referrer, frame, and content-type protections.

Evidence:

- `.factory/desktop-first-screen.png`
- `.factory/phone-first-screen.png`
- `.factory/demo-active-run.png`
- `.factory/run-end-screen.png`
- `/work/.evidence/live-desktop-first-screen.png`
- `/work/.evidence/live-phone-first-screen.png`
- `/work/.evidence/live-loss-end-screen.png`
- `/work/.evidence/verify-live-final/verify.json`

## Deployment

The final static build was pushed to `main` and deployed to the existing product scope as `sf-pulse-run` in Central US. The product hostname and managed TLS are ready. No backend, database, volume, staging slot, unrelated service, or secret was accessed.

## Known gap and next step

The separate billing operator must register `pulse-run-complete` and provide a real Sociobot entitlement-validation contract. After that integration exists, wire `/license` to it and independently test payment return plus entitlement before claiming activation works. All free-game functionality is available now.
