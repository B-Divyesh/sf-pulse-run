# Pulse Run

Pulse Run is a single-player browser rhythm game for keyboard players who want a short run without an account or downloaded client. A run lasts three minutes: play six 30-second tracks, choose one run change between tracks, and avoid missing three phrases.

Live: <https://pulse-run.sociobot.in>

## Play

Use D, F, J, and K, remap every lane key, or use the four touch controls. The game creates synthesized percussion only after a play control or rhythm key is pressed. A wider timing setting reduces the precision required.

The free game includes one complete run, the Circuit percussion set, and six run changes. Pulse Run Complete is a $5 USD one-time offer with the Copper, Paper, and Glass percussion sets. It is not a subscription. Checkout and license activation require registration by the Sociobot billing operator. No purchase or activation is presented as working.

Pulse Run is a single-player built-in game. It has no song uploads, user charts, rankings, or multiplayer rooms.

## Try the isolated sample

Open <https://pulse-run.sociobot.in/demo> or select **Try it with sample data** on the first screen. The sample starts the deterministic `pulse-run-sample-2026` run and shows a realistic previous score. Its banner remains visible, **Reset demo** returns to track one, and **Start for real** discards the sample.

Sample state stays in JavaScript memory. It does not read or write the `pulse-run:*` local-storage keys used by real runs.

## Local data and privacy

Real runs store settings, an in-progress run, completed-run counts, and the best score in local storage. Real and sample play data stays in this browser. Pulse Run, including Complete, has no accounts, ads, analytics, tracking pixels, external scripts, or gameplay requests to another origin. The `/privacy` page can delete all product storage.

## Clean setup

Requirements: Node.js 20 or newer and npm.

```sh
git clone https://github.com/B-Divyesh/sf-pulse-run.git
cd sf-pulse-run
npm ci
npm test
npm run build
```

`npm test` runs deterministic Vitest simulation checks and Playwright Chromium checks. Playwright is pinned to 1.58.2. If that browser is not already available, run `npx playwright install chromium` once.

Every public claim and its isolated command is listed in [`.factory/claims.json`](.factory/claims.json). The suite covers win, loss, restart, storage isolation, settings persistence, and both input methods. It also checks throttled frame rate, mobile layout, focus, reduced motion, routes, recovery, console errors, and axe results.

## Develop and build

```sh
npm run dev       # Vite development server
npm run test:unit # deterministic game simulation
npm run test:e2e  # production build plus browser checks
npm run build     # writes the static product to dist/
npm run preview   # serves dist/ locally
```

The production product is static. Deploy the contents of `dist/` to the product-owned Static Web App. `public/staticwebapp.config.json` supplies route rewrites, the designed 404 response, and security headers. No backend, shared database, secret, or third-party runtime service is required.

## Routes

- `/` — real game and product information
- `/demo` — isolated seeded sample
- `/privacy` — local data details and deletion
- `/terms` — free and paid terms
- `/license` — Complete content and honest billing availability

## Product sources

- [`.factory/brief.json`](.factory/brief.json) — researched opportunity and non-goals
- [`.factory/design.md`](.factory/design.md) — visual system, motion, difficulty, and original asset provenance
- [`.factory/demo.md`](.factory/demo.md) — sample contents and storage boundary
- [`.factory/handoff.md`](.factory/handoff.md) — verification and known gaps

Pulse Run is MIT licensed. See [`LICENSE`](LICENSE).
