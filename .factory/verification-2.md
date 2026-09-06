# Pulse Run repair verification 2

Date: 6 September 2026

Implementation reviewed and deployed: `5eb3e9a` (`repair mobile game entry and public claims`).

## Result: PASS for the recorded repair findings

This is a post-repair worker verification, not a new independent review. The live product and a clean checkout were checked after deployment.

Pulse Run is a finite single-player keyboard rhythm run for players who want a short browser game without an account. The first action is **Try it with sample data**, which opens a seeded active run.

## Finding disposition

| Verification 1 finding | Current result |
| --- | --- |
| No game in the 390 × 664 iPhone first viewport | Resolved. A fresh live 390 × 664 context shows the canvas beginning at y=515.14 with 148.86 px visible. The h1 is **Play a three-minute rhythm run**, the audience sentence, and the sample action are also visible before scroll. The regression check requires at least 96 px of visible canvas. |
| Phrase shield contradicted the modifier claim | Resolved. The claim now names patterns, timing, scoring, controls, and missed-phrase protection. Phrase shield blocks one miss. Steady count now has a real repeating-lane effect rather than a no-op. |
| Seven public promises had no declared outcome checks | Resolved. The registry now has 16 one-to-one tagged outcome checks. New coverage proves every-key remapping, all six free change effects, real/sample local data boundaries, account/ad/tracking-free entry, gesture-gated non-recording audio, assist timing, privacy deletion, and built-in single-player scope. |
| Earlier banner contrast, mobile target/overflow, paid-offer catalog, and refresh recovery items | Still resolved. The full browser suite checks them, including axe scans, 44 px targets, 200% text, offer metadata, and paused real-run recovery. |

## Clean verification

Fresh clone: `/tmp/pulse-run-clean-5eb3e9a`

```sh
npm ci
npm test
npm run build
```

- `npm ci`: 61 packages, 0 vulnerabilities.
- Unit tests: 6 passed.
- Playwright: 33 passed, including all five route axe scans with zero serious or critical violations.
- Each of the 16 commands declared in `.factory/claims.json` was invoked separately and passed.
- Production output: JavaScript 36.57 KB (11.39 KB gzip); CSS 12.24 KB (3.65 KB gzip). `dist/` exists.

## Live HTTPS verification

- `/`, `/demo`, `/privacy`, `/terms`, `/license`, `/billing-offer.json`, `/robots.txt`, and `/sitemap.xml` return 200. A deliberately unknown route returns the designed HTTP 404 page; this is expected.
- Fresh desktop and iPhone-sized contexts have no console or page errors. The live desktop and phone screenshots show the title, first action, and game.
- The one-click live sample showed its persistent **Demo — sample data, nothing is saved** label, previous score 18,420, and active game. A no-input run reached the real **Run ended** screen. Reset restored `1 / 6`, score `0`, active play, and empty local storage.
- The sample made only same-origin requests. Live JavaScript and CSS SHA-256 hashes match the local `dist/` files.
- `verify-url.sh` reports title, `lang=en`, one h1, main landmark, no missing image alt text, no unlabeled buttons, and no console errors. Live axe found zero serious or critical violations on `/`, `/demo`, `/privacy`, `/terms`, and `/license`.
- Live Lighthouse mobile: Performance 100, Accessibility 96, Best Practices 100, SEO 100; LCP 1.0 s, FCP 0.9 s, CLS 0, TBT 20 ms.

Evidence is in `/work/.evidence/pulse-run-repair-2-live/`.

## Offer and remaining dependency

Pulse Run Complete remains a public **$5 USD one-time** offer for Copper, Paper, and Glass percussion sets. `/billing-offer.json` matches `.factory/billing-offer.json`; public offer metadata is also copied to `/work/.evidence/billing-offer.json`.

Checkout registration and entitlement validation remain unavailable from the separate billing operator. The site does not present checkout, payment, or activation as working. This is the only named dependency; the free game is fully playable.
