# AFTER HOURS — inside iamtaw's mind

An interactive 3D website for Tawfeeqoh Hamzat's iamtaw. Built with JavaScript,
Three.js 0.180.0, CSS and the Web Audio API. Geometry, screen textures and sound
are generated in code. Fonts and Three.js are bundled, so the experience does
not depend on a third-party CDN at runtime.

## Run it

1. Extract the ZIP.
2. Open a terminal in this folder.
3. With Node.js 18 or newer installed, run `npm run dev`.
4. Visit **http://localhost:3000**.

No installation or API keys are needed. Alternatively, use VS Code Live Server
on `dist/index.html`, or run `python -m http.server 3000 --directory dist`.
Do not double-click the HTML file: ES modules need an HTTP server.

## Deploy to Vercel

Upload these source files to a GitHub repository, then import that repository
in Vercel. The included `vercel.json` selects `dist` as the output folder.
Use the **Other** framework preset if Vercel asks. Leave build and install
commands empty. There is no build step and no server-side dependency.

You can also deploy only the contents of `dist` to any static web host.

## Explore

- **The desk:** a procedural workstation. Click the screen, mouse, or Step inside.
- **Architecture:** break apart and rebuild a little city of code.
- **Language:** scatter and reassemble MAKE ROOM FOR THE STRANGE.
- **The machine:** connect INPUT, THINK and CREATE, individually or with the
  main action button; reset after powering all three.
- **The reveal:** the workstation in miniature, inside the diamond above the i.
- **Selected work:** links to Tawfeeqoh's portfolio, THE MARGIN and main website.

Move the pointer to look around. Drag horizontally to rotate the active room.
Swipe vertically on the scene to change chapters. Scroll the mouse wheel or
use chapter buttons. When the canvas has keyboard focus, use arrow keys,
Page Up/Down, Home and End. Native buttons support Tab and Enter/Space.
The settings dialog includes reduced motion and a lower-resolution mode.
Sound is off by default and uses synthesized ambient tones, never a microphone.

## Files to edit

| File | Purpose |
| --- | --- |
| `dist/index.html` | HTML, navigation, panels and initial content |
| `dist/style.css` | Layout, colours, typography, responsive styles |
| `dist/app.js` | Chapter content, 3D geometry, animation, interactions, sound |
| `dist/software-renderer.js` | Compatibility renderer for browsers without WebGL 2 |
| `dist/assets/` | Local fonts and favicon |
| `dist/vendor/` | Vendored Three.js and its MIT licence |
| `server.mjs` | Zero-dependency local development server |
| `vercel.json` | Static deployment configuration |

The `chapters` array at the top of `app.js` controls the chapter copy.
The CSS variables in `style.css` and `COLORS` in `app.js` define the palette:
mulberry #641C34, pink #FF79AD, lime #D7F45B, cream #FFF6E8, plum #211B29.
Camera framing is controlled by `cameraPositions`, `mobileCameraPositions`
and `targets()` in `app.js`. All model geometry is editable in that file.

## Rendering and verification

The main renderer uses WebGL 2, lit materials and soft glow sprites. Rendering
resolution is capped separately for mobile and desktop. Animation pauses when
the tab is hidden; reduced motion stops idle movement and shortens transitions.
A lightweight Canvas 2D software renderer projects the same Three.js geometry
when WebGL 2 is unavailable. It preserves interaction and camera movement,
with simpler shading, fewer effects and lower frame rate. If neither renderer
works, an accessible chapter-based HTML fallback remains available.

Checked JavaScript syntax and local asset resolution with `npm run check`.
Browser QA exercised chapter navigation, architecture break/rebuild, sentence
scatter/reassembly, all three machine connections and reset, selected work,
keyboard navigation, settings, and a 390×844 mobile viewport. The QA browser
had WebGL disabled, so visual checks used the software renderer. Native WebGL
appearance, real touch hardware and device frame rates still need review on
physical devices. No claim of universal performance is made.

## Credits and licence

Original project code: MIT (see LICENSE). Brand names and personal identity
remain their owner's. Three.js: MIT, licence in `dist/vendor/LICENSE-three.txt`.
Manrope and DM Sans: SIL Open Font License, included alongside the fonts.
