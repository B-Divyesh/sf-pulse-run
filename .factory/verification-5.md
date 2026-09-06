# Pulse Run verification 5

Date: 6 September 2026

## Verdict: PASS

Finding count: **0**. Untested claim count: **0**.

Implementation candidate reviewed: `79fb623379d8142c929b7b0e3c1d73364897328d` (`fix mobile wordmark accessible name`).

Documentation baseline reviewed: `5fedbf7c283804bc810df4feff4925b40af588c5` (`record repair 4 verification`). Its only change from the implementation candidate is `.factory/handoff.md`. The deployed application JavaScript SHA-256 is `6bcece92d5fb0cf5998f0da964415fe26a5185ae95a388eca55750bff3f01ba7`, identical to the clean candidate build.

Live URL: <https://pulse-run.sociobot.in>

Pulse Run is a finite single-player keyboard rhythm run for people who want original percussion without an account or download. Before scrolling, fresh desktop and 390 × 664 phone browsers show **Play a three-minute rhythm run**, name that audience, offer **Try it with sample data**, and show the active game canvas.

## Clean candidate and claims

From the repository checkout, `npm ci`, `npm test`, and `npm run build` passed. `npm test` passed 6 Vitest simulation tests and 34 Chromium browser tests; the build produced `dist/`. The application JavaScript is 36,596 bytes (11.40 kB gzip) and CSS is 12,236 bytes (3.65 kB gzip).

Each of the 16 declared commands in `.factory/claims.json` was run separately and passed: `complete-run`, `three-misses`, `restart-reset`, `settings-persist`, `local-play-data`, `demo-isolation`, `one-time-offer`, `input-modes`, `remappable-input`, `free-run-changes`, `no-account-ads-tracking`, `audio-gesture`, `assist-timing`, `delete-play-data`, `built-in-scope`, and `frame-rate`.

The registry maps all public play, storage, input, privacy, scope, and $5 one-time-offer statements in the site and README to exactly one outcome-based test. Checkout and activation are explicitly unavailable, so no unsupported payment claim is present.

## Live browser checks

- Fresh Chromium, Firefox, and WebKit phone contexts checked `/`, `/demo`, `/privacy`, `/terms`, and `/license`. Every route had its expected title, exactly one `h1`, one main landmark, a visible **Pulse Run home** link, and no serious or critical axe result.
- Fresh desktop had 395.81 px of visible canvas in its first viewport. Fresh 390 × 664 phone had 148.86 px, zero horizontal overflow, the job title, audience sentence, and first action.
- `verify-url.sh` passed: HTTPS 200, title, `lang=en`, one h1, main, image alternatives, labelled buttons, and no landing-page console error.
- One click entered the populated sample. It displayed **Demo — sample data, nothing is saved** and prior score **18,420**. Reset restored track `1 / 6` and score `0`; a seeded real-data sentinel was unchanged.
- A no-input live sample reached the actual **Run ended** screen at `0:06 played`. **Play again** returned it to track `1 / 6`, score `0`, with the sample banner still visible.
- A separate fresh live client started a real run, used normal D/F/J/K browser keyboard events, selected five deployed choice buttons, and reached the actual **Run complete** screen after `3:00 played`. End-screen evidence is `live-win-end-screen.png`.
- Duplicate key settings show the visible error and keep the dialog open. The privacy control removed all local storage and announced deletion. Reduced-motion transition duration was `0.00001s`.
- The phone-sized live game measured 60.45 fps under 4× Chromium CPU throttling, exceeding the registered 50 fps minimum.
- The designed unknown-route page returned the deliberate HTTP 404 with **Page not found**, a main landmark, a return link, the expected dark styling, and no serious or critical axe result. Chromium reports the expected failed-resource message for the 404 status only; that is not a broken-page finding.
- `/`, `/demo`, `/privacy`, `/terms`, `/license`, `/billing-offer.json`, `/robots.txt`, and `/sitemap.xml` returned 200. The response has CSP, HSTS, referrer policy, content-type protection, permissions policy, and frame denial.

## Earlier findings

| Earlier item | Current disposition |
| --- | --- |
| Phone wordmark lacked an accessible name | Resolved: **Pulse Run home** is present on every application route in Chromium, Firefox, and WebKit phone checks. |
| Sample-banner contrast | Resolved: the persistent label is visible and axe has no serious or critical result. |
| Phone targets, 200% text, overflow, and no first-screen game | Resolved by the browser suite and fresh phone canvas measurement. |
| Modifier wording and ineffective Steady count | Resolved: the current wording includes each effect and all six changes have outcome tests. |
| Unregistered public claims | Resolved: all 16 public claims have one isolated tagged command, all of which passed. |
| Real-run recovery | Resolved by the clean browser suite. |
| Paid content price/catalog clarity | Resolved: public pages and metadata agree on $5 USD once for Copper, Paper, and Glass. |
| 404 styling blocked by CSP | Resolved: live 404 styling loads under production CSP without a CSP error. |

## Scope and remaining dependency

Pulse Run Complete is **$5 USD once**, not a subscription. It adds Copper, Paper, and Glass. The free Circuit run and six changes remain available. Billing registration and entitlement validation remain an operator dependency; checkout and activation are visibly unavailable and were not attempted or reported as working.

The product does not promise offline reload, multiplayer, uploads, user charts, rankings, a backend, a database, health endpoints, rate limits, or a CLI/library/desktop artifact. Those checks do not apply. No product code, deployment, infrastructure, secret, unrelated service, or shared database was accessed or changed.

## Evidence

Evidence is in `/work/.evidence/pulse-run-verify-5/`, including fresh desktop and phone first screens, active sample, live loss and win end screens, and `verify-url/verify.json`.
