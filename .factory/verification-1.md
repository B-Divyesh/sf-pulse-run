# Pulse Run verification 1

## Verdict: FAIL

Reviewed implementation candidate: `369aedae71a4bfb2eefbd6c4805d8902ed3e2e6b` (`persist real run before first reload`).

Reviewed documentation baseline: `0a659c9b741afff59f6119c9e06f76d4f24b4693` (`record final verification handoff`). That later commit changes only `.factory/handoff.md`; the live JavaScript and CSS hashes match the `369aeda` build.

Live URL: <https://pulse-run.sociobot.in>

Pulse Run's job is a finite, single-player keyboard rhythm run. It is for keyboard players who want a short original-percussion game without an account. Before scrolling, the page says this and offers **Try it with sample data**, which opens the seeded active sample.

The verdict is **FAIL** because the findings below include a browser-game first-screen failure, a false public claim, and unregistered public claims. The declared claim commands themselves all passed; they are not sufficient to justify a PASS.

## Findings

1. **Major — the phone first screen does not show the game itself.** A fresh iPhone 13 browser context (390 × 664 CSS px) loaded `/` with no console or page errors, but the canvas begins at y=738 px. No playable game is visible before scrolling. This violates the browser-game requirement that the game itself appears on the first screen, rather than a landing/menu wall. At the taller 390 × 844 test viewport only the top 106 px of the canvas is visible. Evidence: `/work/.evidence/qa-live-phone-first-screen.png` and `/work/.evidence/qa-live-390x844-first-screen.png`.

2. **Major — the public modifier claim is false and has no matching claim test.** The landing page says, “Each choice changes the next note pattern, timing window, or score.” The selectable **Phrase shield** modifier only increases `shield`, which blocks one missed phrase; it changes none of those three stated things. No entry in `.factory/claims.json` tests modifier effects. This is both a false public statement and an untested claim.

3. **Medium — the claim registry does not cover several other public promises.** The required claim audit found no tagged claim entry/test for these distinct visitor-facing promises: every key can be remapped and played; real-run data never leaves the browser; there are no accounts, ads, analytics, tracking pixels, or third-party scripts; the free-content counts (one set and six run changes); Complete never adds ads; and audio only starts after a user gesture with no recording. Existing tests cover part of some areas (for example, demo request origin and persistence of one remapped key) but do not prove these complete public statements. The claims contract requires each public claim to have an observable isolated test. There are **7 untested public claims** in total when the false modifier statement is included.

## What passed

- Fresh detached checkout at documentation SHA `0a659c9`: `npm ci` installed 61 packages with 0 vulnerabilities; `npm test` passed 6 Vitest and 26 Playwright tests; `npm run build` created `dist/`.
- Every declared command in `.factory/claims.json` was run against the clean checkout and passed individually: `complete-run`, `three-misses`, `restart-reset`, `settings-persist`, `local-play-data`, `demo-isolation`, `one-time-offer`, `input-modes`, and `frame-rate`.
- The live desktop page has the required title, `lang=en`, one `h1`, one main landmark, visible game canvas, no horizontal overflow, and no console/page errors. The first screen clearly states the job, audience, first action, local-data fact, input methods, and $5 one-time price.
- The live phone page has no horizontal overflow, states the same job and first action, and opens the isolated sample correctly. Its missing game canvas in the initial viewport is finding 1.
- One click opened `/demo`; the realistic previous score `18,420` and persistent “Demo — sample data, nothing is saved” banner appeared. Reset returned track `1 / 6` and score `0` with no local-storage keys. A no-input live sample reached the actual **Run ended** screen after exactly three missed phrases at `0:06 played`.
- The clean deterministic suite reached the six-track, five-choice win screen at `3:00`; it also covered restart, invalid duplicate-key validation, recovery after refresh, keyboard/touch input, settings, keyboard focus/dialog return, reduced motion, 200% text, and the designed 404.
- Live `/`, `/demo`, `/privacy`, `/terms`, `/license`, `/billing-offer.json`, `/robots.txt`, and `/sitemap.xml` returned 200. An unknown route correctly returned HTTP 404 with the designed recovery page. All site links returned 200 or were the explicit `mailto:` contact.
- Live headers include CSP, HSTS, `X-Content-Type-Options`, referrer policy, permissions policy, and `X-Frame-Options`. Live JS and CSS SHA-256 hashes match the local `369aeda` production build.
- `/opt/fleet/lib/verify-url.sh` passed against live HTTPS: title present, `lang=en`, one `h1`, main present, no missing image alt text, no unlabeled buttons, and no console errors. Live axe scans with the installed Playwright integration found zero violations on `/`, `/demo`, `/privacy`, `/terms`, and `/license`.

## Earlier findings and current disposition

| Earlier item | Current disposition |
| --- | --- |
| Sample banner contrast (`cb67be0`) | Resolved: current live axe scans have no violations and the banner is visible in the active sample. |
| Mobile targets, text scale, and overflow checks (`f8a4f40`) | The documented 390 × 844 no-overflow and 200% tests pass. The shorter real-phone first-screen issue remains as finding 1. |
| Paid percussion catalog (`e92afad`) | Metadata and visible offer agree: $5 USD once for Copper, Paper, and Glass. The unavailable checkout/activation state is plainly disclosed and is not treated as a passed purchase. |
| Real-run reload recovery (`369aeda`) | Covered by the clean browser suite and passed. |
| Earlier handoff's billing gap | Still expected and honestly disclosed; no checkout or activation was attempted or reported as working. |

## Evidence and reproduction

- Live evidence: `/work/.evidence/pulse-run-verify-1-live/verify.json`, `/work/.evidence/qa-live-desktop-first-screen.png`, `/work/.evidence/qa-live-phone-first-screen.png`, `/work/.evidence/qa-live-loss-end-screen.png`, and `/work/.evidence/qa-live-390x844-first-screen.png`.
- Clean checkout: `/tmp/pulse-run-verify-1-clean.l8Xt3o` during this verification.
- Reproduce the primary failure: open a fresh iPhone 13 browser context at `https://pulse-run.sociobot.in/`; the canvas top is 738 CSS px in a 664 px viewport.

No product code was changed during this verification.
