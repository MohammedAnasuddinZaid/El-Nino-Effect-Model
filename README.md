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

### Narration assets

Narration is pre-generated so the voice is smooth and identical on every device.

```bash
py -3.10 -m pip install edge-tts
py -3.10 scripts/generate-narration.py
```

The script writes `public/audio/en/00.mp3`–`08.mp3` with `en-IN-NeerjaExpressiveNeural`
and `public/audio/hi/00.mp3`–`08.mp3` with `hi-IN-SwaraNeural`. If a file is missing,
the hook falls back to the browser speech synthesiser.

## Presentation model

The exhibit is deliberately quiet until the visitor asks for the story.

- **Free exploration never plays the story and never advances the water.** Drag to orbit,
  scroll to zoom, and select any part. Page scrolling is locked while exploring.
- **Present the story** starts the full narration-led chapter sequence.
- **Play this part** inside a chapter runs only that chapter's process (rain, flow,
  filtration, storage, or drip) and stops itself.
- Camera drift, rain, pipe particles, tank bubbles, the pump impeller, and dripper drops
  are all gated so nothing flows while the camera or page is moving.

## Controls

| Action | Input |
| --- | --- |
| Present the whole story | **Present the story** on the opening panel, or **Present** in the dock |
| Follow the story | Scroll, or let the presentation advance |
| Move between chapters | **← / →**, prev/next buttons, or the chapter menu |
| Pause / resume | **Space** or the play button |
| Play one process | **Play this part** in the chapter panel |
| Inspect a system | Select a labelled part in the 3D model |
| Open the filter internals | **Open the filter**, then pick any of the six layers |
| Orbit and zoom freely | **Explore the model**, then drag / scroll |
| Close a panel | **Esc** |
| Switch language | **EN / हिंदी** in the top bar |
| Narration on / off | Speaker button in the top bar |
| Replay | Replay in the chapter menu or final panel |

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

React 19 · TypeScript · Vite · React Three Fiber · Drei · Three.js · Zustand · Lenis · Motion · postprocessing. All geometry, textures, and labels are generated in code; no external 3D assets are downloaded. Type is set in Fraunces, Manrope, Noto Sans Devanagari, and JetBrains Mono via Fontsource (SIL Open Font License).

## Accessibility and performance

- Keyboard chapter navigation, visible focus, focus trapping in dialogs, and `Esc` to close.
- Reduced-motion preference is respected; camera flights and ambient motion settle immediately.
- A 2D schematic fallback appears when WebGL is unavailable.
- Captions are available for every chapter; narration can be muted independently.
- The 3D scene is aria-hidden, while the story is duplicated in accessible page sections.
- The interface is available in English and Hindi, including component names, filter layers, and captions.

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
