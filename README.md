# Every Drop Has a Story

An interactive 3D science exhibit for **Ahmadi Begum, Class 7B** — *El Niño and Water Conservation: Rainwater Harvesting and Drip Irrigation.*

The site follows one drop of water from the Pacific Ocean to a plant's root: a warming Pacific, an uncertain monsoon, a rooftop catchment, filtration, storage, a small pump, and a drip-irrigated field. Every scene is procedural 3D, built with React Three Fiber, and choreographed by a scroll-driven camera.

## Run locally

```bash
npm install
npm run dev
```

Open the URL printed by Vite (usually `http://localhost:5173`).

```bash
npm run typecheck   # TypeScript project check
npm run build       # production build in dist/
npm run preview     # preview the production build
```

## Controls

| Action | Input |
| --- | --- |
| Follow the story | Scroll, or press **Play** |
| Move between chapters | **← / →**, prev/next buttons, or the chapter index |
| Pause / resume | **Space** or the play button |
| Inspect a system | Select a labelled part in the 3D model |
| Orbit and zoom freely | **Explore the model**, then drag / scroll |
| Close a panel | **Esc** |
| Listen | **Listen** in the top bar (browser narration) |
| Replay | Replay button in the chapter index or final panel |

## What is modelled

1. **Pacific engine** — a simplified ocean cross-section with normal and El Niño states.
2. **Monsoon odds** — El Niño tilts the odds; it does not guarantee drought.
3. **Water gap** — dry soil and low storage as a local experience of climate variability.
4. **Rooftop catchment** — roof → gutter → downpipe.
5. **Filtration** — a multi-stage media filter; clearing water is not the same as making it safe to drink.
6. **Storage** — a low tank with a finite useful capacity.
7. **Pump and drip field** — a DC pump, main line, drip laterals, emitters, and a root-zone cutaway.
8. **Whole system** — the full diorama in one connected view.

The wetting bulb and root cutaway are explicitly labelled illustrative. The digital filter media are illustrative until matched to the finished physical model.

## Scientific position

- El Niño can make a weaker Indian summer monsoon more likely, but it is not the only driver and does not guarantee drought.
- A simple filter improves physical clarity; it does not assure drinking-water safety. Treatment and testing are still required.
- Water savings from drip irrigation depend on soil, crop, climate, maintenance, and how the system is operated. The exhibit does not claim a universal saving percentage.
- Harvest estimates in the calculator are estimates, not measurements.

Sources and project notes are available inside the site under **Science** and **The Project**.

## Stack

React 19 · TypeScript · Vite · React Three Fiber · Drei · Three.js · Zustand · Lenis · Motion · postprocessing. All geometry, textures, and labels are generated in code; no external 3D assets are downloaded.

## Accessibility and performance

- Keyboard chapter navigation, visible focus, focus trapping in dialogs, and `Esc` to close.
- Reduced-motion preference is respected; camera flights and ambient motion settle immediately.
- A 2D schematic fallback appears when WebGL is unavailable.
- Captions are available for every chapter; browser narration is optional.
- The 3D scene is aria-hidden, while the story is duplicated in accessible page sections.

## Deploy on Vercel

1. Push this repository to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new).
3. Framework preset: **Vite**. Build command: `npm run build`. Output directory: `dist`.
4. Deploy.

No environment variables or server functions are required.

## Credits

Concept, research, and physical model: **Ahmadi Begum**, Class 7B.
Digital exhibit: built as a companion to the physical science-fair model.
Scientific references: NOAA, NASA Earth Science, India Meteorological Department, Central Ground Water Board, and WHO — linked in the site's Science panel.
