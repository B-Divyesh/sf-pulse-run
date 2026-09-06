# Pulse Run sample sandbox

- URL: `https://pulse-run.sociobot.in/demo` (local: `http://127.0.0.1:4173/demo`)
- Entry: select **Try it with sample data** on the first screen.
- Sample: deterministic seed `pulse-run-sample-2026`, an active track, and a realistic previous score of 18,420 with a 74-note streak.
- Banner: **Demo — sample data, nothing is saved** remains visible until the player starts a real run.
- Reset: **Reset demo** replaces the sample with the original seed and restarts track one.
- Isolation: demo state and settings exist only in JavaScript memory. Demo mode does not read or write the `pulse-run:*` local-storage namespace.
- Exit: **Start for real** discards the demo instance and creates a separate real run.
