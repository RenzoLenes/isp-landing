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
 * `feColorMatrix` zeroes the R/G/B channels and keeps only (a scaled-down
 * fraction of) the alpha channel, so the tile is pure black at a noisy,
 * varying transparency rather than colour-tinted static — that reads as
 * neutral grain on every register instead of favouring light or dark ones.
 * The `0.035` page-level opacity (tuned by rendering and looking at a real
 * screenshot, not guessed) is where the CSS-level strength knob lives —
 * turn it here, not in the filter values, if this ever needs retuning.
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
  "<feColorMatrix type='matrix' values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0'/>" +
  "</filter>" +
  "<rect width='100%' height='100%' filter='url(#grain)'/>" +
  "</svg>";

const NOISE_DATA_URI = `url("data:image/svg+xml,${encodeURIComponent(NOISE_SVG)}")`;

export function GrainOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-40 opacity-[0.035]"
      style={{ backgroundImage: NOISE_DATA_URI }}
    />
  );
}
