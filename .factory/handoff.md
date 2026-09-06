# Pulse Run handoff

Date: 6 September 2026

Live product: <https://pulse-run.sociobot.in>

Artifact class: `browser-game`

## Status

Repair 3 is complete. The current implementation has no open product defect from either independent verification report.

The unknown-route page now loads a same-origin stylesheet allowed by the deployed content security policy. Its heading is the plain **Page not found**, and it keeps the Pulse Run visual system, recovery link, standard navigation, legal links, and 44 px targets on desktop and phone.

## Version record

- Implementation and deployed artifact: `aba0b954a3111835dd9a8a87af1b5f104035ae5c` (`fix styled 404 under content security policy`).
- Documentation/report commit: the later report-only commit containing this handoff and copy-audit update.
- Previous documentation baseline: `4b7339f645b8bcbffca5921990dbeb93f45bbd68`.
- Live JavaScript, main CSS, 404 HTML, and 404 CSS SHA-256 values match the clean build from the implementation commit.

## Repair

- Moved the 404 design from an inline `<style>` block to `/404.css`.
- Kept `style-src 'self'`; no CSP weakening or inline-style exception was added.
- Replaced the metaphorical 404 heading with **Page not found**.
- Added the standard sample, privacy, terms, product description, and version recovery structure.
- Replaced the structure-only 404 test with a browser outcome test. It applies the production CSP, checks computed product colors, confirms the recovery target, runs axe, and rejects console errors.
- Added the new 404 copy to `.factory/copy-audit.md`. Every listed sentence remains within the 22-word limit and uses none of the banned marketing words.

No game logic, free content, paid deliverable, price, storage boundary, or product scope changed.

## Clean verification

Fresh clone: `/tmp/pulse-run-repair-3-clean.At7K9N`

```sh
npm ci
npm test
npm run build
```

Results:

- `npm ci`: 61 packages installed, 0 vulnerabilities.
- Vitest: all 6 deterministic simulation tests passed.
- Playwright: all 33 browser tests passed.
- All 16 commands in `.factory/claims.json` passed separately from the clean clone.
- The registry has 16 IDs and every ID appears in exactly one tagged browser test.
- Build output includes `dist/`; JavaScript is 36,568 bytes and main CSS is 12,236 bytes.
- The 404 document is 1,244 bytes and its stylesheet is 2,513 bytes.

The browser suite covers a deterministic 3:00 win, exact third-miss loss, restart reset, refresh recovery, all six run changes, keyboard, touch, all remapped lanes, settings, wider timing, local storage, sample isolation, price metadata, privacy deletion, reduced motion, focus, mobile layout, 200% text, frame rate, route structure, axe, and the production-CSP 404 outcome.

## Live verification

The clean `dist/` was deployed to the existing `sf-pulse-run` Static Web App in Central US. The existing custom domain and production environment were reused.

- Fresh desktop and 390 × 664 phone contexts state the job, audience, and first action before scrolling.
- The desktop canvas starts at 406.95 px. The phone canvas starts at 515.14 px and shows 148.86 px in the first viewport.
- One click opens `/demo`, shows the persistent sample label and previous score of 18,420, and starts active play.
- A real timed no-input sample reaches **Run ended** after three missed phrases at 0:06.
- **Reset demo** restores active track `1 / 6`, score `0`, and empty real local storage.
- All observed landing and sample requests were same-origin.
- The unknown path returns the deliberate HTTP 404. `/404.css` returns 200, computed colors match the product palette, and desktop/phone recovery views have no overflow.
- The unknown request produces only Chromium's generic message for its deliberate 404 status. There is no CSP violation or other unexpected console error. Direct `/404.html` returns 200 with zero console errors.
- Live axe checks on the landing and 404 pages found zero serious or critical violations.
- `verify-url.sh` passed: correct title and language, one h1, main landmark, no missing image alt text, no unlabeled buttons, and no landing console errors.
- `/`, `/demo`, `/privacy`, `/terms`, `/license`, metadata, crawler files, icons, social art, and the direct 404 document return 200.
- The live privacy control deleted all product storage in its fresh browser context.
- Lighthouse mobile: Performance 100, Accessibility 96, Best Practices 100, SEO 100; LCP 1.08 s, CLS 0, TBT 31.5 ms.

Evidence is in `/work/.evidence/pulse-run-repair-3/`. It includes clean command logs, each claim log, headers, hashes, browser JSON, Lighthouse JSON, verify-url output, and desktop/phone/sample/end-screen/404 screenshots.

## Earlier findings

| Finding | Current disposition |
| --- | --- |
| Sample banner contrast | Resolved; current browser axe checks pass and the label remains visible. |
| Mobile targets, 200% text, and overflow | Resolved; the clean suite passes and live phone overflow is zero. |
| Paid percussion catalog completeness | Resolved; Complete still contains Copper, Paper, and Glass for $5 USD once. |
| Real-run refresh recovery | Resolved; the clean browser suite restores the paused run. |
| Game missing from the 390 × 664 first screen | Resolved; 148.86 px of live canvas is visible. |
| False run-change wording and ineffective Steady count | Resolved; all six effects have separate observable outcomes in the claim test. |
| Seven unregistered public promises | Resolved; all 16 current public claims have one matching test and command. |
| Inline 404 CSS blocked by CSP | Resolved at the cause; the deployed same-origin stylesheet loads and no CSP error remains. |

## Offer and remaining dependency

Pulse Run Complete remains a **$5 USD one-time offer**, not a subscription. It adds the Copper, Paper, and Glass original percussion sets. The complete free run remains available with Circuit and six run changes.

Public offer metadata is mirrored to `/work/.evidence/billing-offer.json`. The 98-character verb-first catalog description is mirrored to `/work/.evidence/catalog-description.txt`.

The separate billing operator still needs to register `pulse-run-complete` and provide the entitlement-validation contract. Checkout and activation remain unavailable and are stated that way on `/license`. No checkout, payment, or entitlement was attempted or claimed as working.

Offline play, multiplayer, uploads, user charts, and competitive ranking are not advertised modes. No backend, database, shared service, user credential, or unrelated product was accessed for this repair.
