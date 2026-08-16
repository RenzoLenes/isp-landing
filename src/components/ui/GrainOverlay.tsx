/**
 * DESIGN.md §5, "Grano": a very subtle fixed noise layer over the whole
 * page, present in every register (canvas, surface, night, signal field
 * alike) so the flat digital surfaces read as material rather than
 * antiseptic. Server Component — static, nothing animated, nothing to
 * hydrate.
 *
 * The noise itself is an inline SVG `feTurbulence` filter, encoded as a
 * `data:` URI and used as a tiled `background-image` — no image asset, no
 * dependency, per the brief. The filter is rasterised once by the browser
 * when it decodes the (tiny, 200x200) SVG and then the result is tiled like
 * any other background image, so this costs one decode, not a per-frame
 * filter recompute.
 *
 * `feColorMatrix` now maps the turbulence into fully-opaque mid-grey noise
 * (equal R/G/B, alpha forced to 1) instead of the previous "pure black at a
 * varying alpha" tile. That distinction is the fix for this chunk's
 * register rhythm (DESIGN.md's dark-register note): plain black-at-alpha
 * noise is *source-over* compositing, so its visible strength scales with
 * how light the background is — strongly visible on `canvas`/`surface`,
 * almost inert on `night` (black-on-near-black barely moves the pixel), and
 * NOT the "shows far more on the dark register" the brief flags. Rendering
 * and comparing crops confirmed the actual failure mode is different: with
 * `mix-blend-mode: normal`, grey-at-full-alpha noise sits as a uniform grey
 * wash that reads as a visible fog rather than grain on `night` specifically,
 * because there's no other texture behind it to blend with. `overlay` fixes
 * both directions at once — it's the standard film-grain trick: pixels at
 * the noise's own mid-point leave the base untouched, lighter noise pixels
 * lighten, darker ones darken, so the same tile reads as fine, neutral grain
 * whether it's sitting on white, off-white, signal-field blue or near-black
 * `night`, instead of favouring (or fogging) any one of them. The `0.05`
 * page-level opacity is the strength knob — tuned against `night` crops
 * specifically, since that register is where texture reads the strongest at
 * a given opacity; still comfortably imperceptible-unless-sought on the
 * light registers at the same value.
 *
 * `position: fixed` + a z-index below the navbar's `z-50` (see Navbar.tsx)
 * keeps it under interactive chrome; `pointer-events: none` means it can
 * never capture a click or a hover regardless of stacking order;
 * `aria-hidden` removes it from the accessibility tree entirely.
 */
const NOISE_SVG =
  "<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'>" +
  "<filter id='grain'>" +
  "<feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/>" +
  "<feColorMatrix type='matrix' values='0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 0 1'/>" +
  "</filter>" +
  "<rect width='100%' height='100%' filter='url(#grain)'/>" +
  "</svg>";

const NOISE_DATA_URI = `url("data:image/svg+xml,${encodeURIComponent(NOISE_SVG)}")`;

export function GrainOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-40 opacity-[0.05] mix-blend-overlay"
      style={{ backgroundImage: NOISE_DATA_URI }}
    />
  );
}
