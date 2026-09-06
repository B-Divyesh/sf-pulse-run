# Pulse Run handoff

Date: 6 September 2026

Live product: <https://pulse-run.sociobot.in>

Artifact class: `browser-game`

## Status

Verification 4 is **FAIL** with **1 serious finding** and **0 untested claims**. No product code was changed.

- Implementation and deployed artifact: `aba0b954a3111835dd9a8a87af1b5f104035ae5c`.
- Documentation baseline reviewed: `de3835f22e349ecfcf9afeffb15598306af72122`.
- The live JavaScript, CSS, 404 HTML, and 404 CSS hashes match the clean candidate build.
- At the phone breakpoint, the focusable header wordmark link has no accessible name. It is a serious axe `link-name` finding on every application route and must be repaired before a PASS.

## What was reviewed

- Fresh desktop and 390 × 844 phone first screens in Chromium 145, Firefox 146, and WebKit 26 name the three-minute rhythm run, audience, and sample action, and show the game.
- One-click sample entry shows its persistent label, active play, and prior score 18,420 without changing real storage. Reset returns the sample to track 1 / 6.
- Chromium, Firefox, and WebKit each completed all six deployed tracks, chose five real changes, and reached the visible 3:00 win screen. Runs used normal keyboard and touch input; no live QA hook was used.
- Each live real run reloaded into the paused recovery screen and resumed. Gesture-gated audio-context creation and touch-control scoring were observed in every engine.
- Routes, internal links, titles, privacy deletion, same-origin traffic, security headers, legal pages, public offer metadata, and the styled deliberate 404 passed.
- Every earlier product finding remains resolved. The new mobile unnamed-wordmark finding and browser-specific evidence are in `.factory/verification-4.md`.

## Clean verification

From a fresh detached clone of `aba0b95`:

```sh
npm ci
npm test
npm run build
```

Results:

- 6 Vitest simulation tests passed.
- 33 Playwright Chromium tests passed.
- All 16 commands declared in `.factory/claims.json` passed separately.
- Each claim ID has exactly one tagged browser test.
- `dist/` was produced. Application JavaScript is 36,568 bytes and CSS is 12,236 bytes.

## Live verification

- `verify-url.sh` passed for the landing page.
- Chromium 145.0.7632.6, Firefox 146.0.1, and WebKit 26.0 each loaded fresh desktop and phone viewports, had zero phone overflow, completed a live 3:00 run with five choices, and showed no normal-play console errors.
- Phone touch controls scored 844 in Chromium, 390 in Firefox, and 350 in WebKit. Each client created audio only after an explicit start gesture and recovered a real run after reload.
- Desktop axe has zero serious or critical issues. Phone axe has the one serious unnamed home-link issue on every application route.
- The expected unknown URL returns HTTP 404 with a working styled recovery page.

Evidence is in `/work/.evidence/pulse-run-verify-4/`. The formal report is `.factory/verification-4.md`.

## Offer and remaining dependency

Pulse Run Complete costs **$5 USD once** and is not a subscription. It adds Copper, Paper, and Glass. The free Circuit run and all six free run changes remain available.

The billing operator still needs to register `pulse-run-complete` and provide entitlement validation. Checkout and activation remain visibly unavailable and were not tested or claimed as working.

Offline play, multiplayer, uploads, user charts, competitive ranking, and a backend are not advertised. The README only documents Chromium Playwright support; Firefox and WebKit coverage is observed compatibility evidence, not an added public support claim. No backend, database, shared service, credential, or unrelated product was accessed.

## Reproduce

```sh
git checkout aba0b954a3111835dd9a8a87af1b5f104035ae5c
npm ci
npm test
npm run build
```

Then run every command in `.factory/claims.json`, repair the responsive wordmark accessible name, and re-run phone axe across every application route before declaring PASS.
