# Pulse Run visual thesis

## Direction

Pulse Run uses a **printed rhythm instrument** direction. The game resembles a compact score reader built from graph paper, illuminated lane strips, and physical control labels. This fits a finite rhythm run because the interface explains timing and input before it decorates the page. It avoids both a generic game neon gradient and a generic software landing page.

The first screen is asymmetrical: direct play instructions sit beside the working four-lane instrument. Narrow coral, yellow, cyan, and green note bars carry lane identity. A sharp lower-right cut on game and price surfaces makes the thumbnail recognizable.

## Palette

- `night #101722`: page background
- `night-deep #090e15`: game field and hard shadows
- `panel #172330`: primary surface
- `panel-raised #20313f`: active choices
- `ink #f5f1df`: primary text
- `ink-muted #b9c2c7`: supporting text; verified above 4.5:1 on both dark surfaces
- `line #496071`: large boundaries and inactive controls
- `cyan #66e3e0`: primary action and lane three
- `cyan-ink #082626`: text on cyan
- `coral #ff735e`, `yellow #f7cf66`, `success #7ae49c`: other lanes and game feedback
- `danger #ff8776`: destructive or failed state

This is an explicitly dark, single-mode instrument panel. A light theme would weaken the screen-to-lane contrast required during timed play.

## Type and spacing

Rockwell or a local slab-serif fallback gives the play title the cadence of printed music equipment. Avenir Next, Segoe UI, or system sans handles instructions and controls. No font files or external font services load. Monospace numerals label keys, score, seed, and time.

Spacing follows 8 px increments. The working width is 1,180 px, text measures stay below 70 characters, controls are at least 44 px, and mobile layouts start at 320 px with the four lane controls retained.

## Interaction grammar

Buttons depress against hard offset shadows. Notes travel only toward a fixed judgement line. Each lane always keeps one color and one key label. Modifier selection stops time and uses two large text choices. The game offers keyboard, touch, remapped keys, and a wider-timing setting.

The difficulty curve spans six 30-second tracks. The base pattern asks for two hits per four-note phrase. Each track adds one player-selected modifier. Three missed phrases end the run, so the loss state is clear and finite.

## Motion policy

The fixed-timestep simulation runs at 60 updates per second and renders through `requestAnimationFrame`. Motion is clamped after stalls and pauses when the document is hidden. Notes use continuous position changes; interface transitions use transform and opacity within 160 ms. Reduced-motion mode removes interface movement and keeps notes as the minimum functional game movement. No element flashes.

## Original asset provenance

All game visuals are hand-authored Canvas 2D geometry and CSS in this repository. The favicon and social card are hand-authored SVG geometry derived from the four-lane game. Circuit, Copper, Paper, and Glass use distinct 16-step percussion arrangements synthesized at runtime with Web Audio oscillators and generated noise after a user gesture. No recordings, external art, stock assets, generated images, copyrighted songs, or third-party fonts are used.

Assets authored by Param Factory on 6 September 2026 under the repository MIT license.
