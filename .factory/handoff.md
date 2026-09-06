# Pulse Run handoff

Date: 6 September 2026

Live product: <https://pulse-run.sociobot.in>

Artifact class: `browser-game`

## Status

Strict review 1 passed with **zero findings** and **zero untested claims**. No product code was changed.

- Implementation and deployed artifact: `aba0b954a3111835dd9a8a87af1b5f104035ae5c`.
- Documentation baseline reviewed: `6a776bd7eee66c3d495389faa054f8724a6c39e8`.
- The later commit containing this handoff and `.factory/review-1.md` is report-only.
- Live JavaScript, main CSS, 404 HTML, and 404 CSS hashes match the clean implementation build.

## What was reviewed

- Fresh desktop and 390 × 664 phone first screens name the three-minute rhythm run, audience, and sample action, and show the game.
- One-click sample entry displays a persistent label, active seeded play, and the prior score 18,420.
- A real timed live sample reaches the third-miss loss screen at 0:06. Reset restores track 1/6 and score 0 without changing seeded real storage.
- The clean deterministic suite reaches the six-track 3:00 win, verifies five choices, and resets through Play again.
- Keyboard, touch, all four remapped keys, duplicate-key recovery, wider timing, settings persistence, reload recovery, focus, reduced motion, 200% text, and phone targets passed.
- Routes, internal links, distinct titles, semantic structure, privacy deletion, same-origin traffic, security headers, legal pages, offer metadata, and the styled deliberate 404 passed.
- All earlier findings are resolved. Their current evidence is listed in `.factory/review-1.md`.

## Clean verification

From a detached checkout of `aba0b95`:

```sh
npm ci
npm test
npm run build
```

Results:

- 6 Vitest simulation tests passed.
- 33 Playwright browser tests passed.
- All 16 commands declared in `.factory/claims.json` passed separately.
- The claim registry has exactly one tagged browser test for each ID.
- `dist/` was produced; application JavaScript is 36,568 bytes and CSS is 12,236 bytes.

## Live verification

- Desktop shows 395.79 px of game canvas in the first viewport. Phone shows 148.86 px with zero overflow.
- Live routes have one h1, one main, correct titles, and no application console errors.
- Live axe scans have zero serious or critical findings on all application routes and the 404 recovery page.
- `verify-url.sh` passed.
- Mobile Lighthouse: Performance 100, Accessibility 96, Best Practices 100, SEO 100; LCP 997.5 ms, CLS 0, TBT 0 ms.
- The expected unknown URL returns HTTP 404 with a working styled recovery page. Its generic failed-resource console line is expected for that deliberate status.

Evidence is in `/work/.evidence/pulse-run-review-1/`. The formal report is `.factory/review-1.md`.

## Offer and remaining dependency

Pulse Run Complete costs **$5 USD once** and is not a subscription. It adds Copper, Paper, and Glass. The free Circuit run and all six free run changes remain available.

The billing operator still needs to register `pulse-run-complete` and provide entitlement validation. Checkout and activation remain visibly unavailable and were not tested or claimed as working.

Offline play, multiplayer, uploads, user charts, competitive ranking, and a backend are not advertised. No backend, database, shared service, credential, or unrelated product was accessed.

## Reproduce

```sh
git checkout aba0b954a3111835dd9a8a87af1b5f104035ae5c
npm ci
npm test
npm run build
```

Then run each command in `.factory/claims.json` and review <https://pulse-run.sociobot.in> in fresh desktop and phone contexts.
