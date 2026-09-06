# Pulse Run handoff

Date: 6 September 2026

Live product: <https://pulse-run.sociobot.in>

Artifact class: `browser-game`

## Status

Strict review 2 passed with **zero findings** and **zero untested claims**. No product code was changed.

- Implementation and deployed artifact: `aba0b954a3111835dd9a8a87af1b5f104035ae5c`.
- Documentation baseline reviewed: `79e335927b7a4114ec3f526fd3903fb06fa0c738`.
- Commits after the implementation candidate change reports and the copy audit only.
- Live JavaScript, CSS, 404 HTML, and 404 CSS hashes match the clean candidate build.

## What was reviewed

- Fresh desktop and 390 × 664 phone first screens name the three-minute rhythm run, audience, and sample action, and show the game.
- One-click sample entry displays a persistent label, active play, and prior score 18,420 without changing real storage.
- A wall-clock live sample reaches the third-miss loss screen at 0:06.
- A fresh live client completed all six deployed tracks, selected five change buttons, and reached the 3:00 win screen. The live origin exposes no local QA hook; the run used normal keyboard events and the production fixed-timestep loop.
- Keyboard and touch scoring, Play again, Reset demo, invalid duplicate keys, focus, settings, real-run reload recovery, reduced motion, 200% text, and phone targets passed.
- Routes, internal links, titles, semantics, privacy deletion, same-origin traffic, security headers, legal pages, public offer metadata, and the styled deliberate 404 passed.
- Every earlier finding is resolved. Its fresh disposition appears in `.factory/review-2.md`.

## Clean verification

From a fresh detached clone of `aba0b95`:

```sh
npm ci
npm test
npm run build
```

Results:

- 6 Vitest simulation tests passed.
- 33 Playwright browser tests passed.
- All 16 commands declared in `.factory/claims.json` passed separately.
- Each claim ID has exactly one tagged browser test.
- `dist/` was produced. Application JavaScript is 36,568 bytes and CSS is 12,236 bytes.

## Live verification

- Desktop shows 395.79 px of game canvas in the first viewport. Phone shows 148.86 px with zero overflow.
- The live loss and win end screens, both restart paths, and five between-track choices were recorded.
- Live routes have one h1, one main landmark, correct titles, and no application console errors.
- Live axe scans have zero serious or critical findings on every application route and the 404 page.
- `verify-url.sh` passed.
- Live frame measurement was 60.00 fps at 390 × 844 under 4× CPU throttling.
- Mobile Lighthouse: Performance 100, Accessibility 96, Best Practices 100, SEO 100; LCP 957.9 ms, CLS 0, TBT 20 ms.
- The expected unknown URL returns HTTP 404 with a working styled recovery page.

Evidence is in `/work/.evidence/pulse-run-review-2/`. The formal report is `.factory/review-2.md`.

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

Then run every command in `.factory/claims.json` and review <https://pulse-run.sociobot.in> in fresh desktop and phone contexts.
