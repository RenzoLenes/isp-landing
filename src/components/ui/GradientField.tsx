/**
 * Atmospheric background: soft, blurred patches of blue and lavender over the
 * fog surface, concentrated behind the hero and fading out before the next
 * section. Server Component — no client JS, nothing animated, `aria-hidden`
 * so assistive tech skips it entirely.
 *
 * Opacity budget (see chunk-a-report.md for the full contrast workup): the
 * hero subtitle sits in `moss` on `fog`, which is only 4.75:1 to start with —
 * barely above the 4.5:1 AA floor for normal text. That leaves very little
 * headroom, so every patch here is capped low enough that even where two
 * patches overlap at full blur-centre strength, the composited background
 * still keeps `moss` at >=4.5:1. `ink` (the headline) has enormous headroom
 * by comparison (~13:1+ at any opacity used here) and isn't the constraint.
 *
 * The container's own `mask-image` fades the whole field to transparent by
 * ~78% of its height, so intensity dissolves downward and nothing bleeds
 * into the Problem section.
 */
export function GradientField() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[820px] overflow-hidden [mask-image:linear-gradient(to_bottom,black,black_32%,transparent_78%)] sm:h-[900px] lg:h-[980px]"
    >
      {/* Lavender — upper field, biased right (behind where the product
          composition sits), well clear of the text column's left edge. */}
      <div className="absolute -top-32 right-[-6%] size-[30rem] rounded-full bg-lavender/[0.045] blur-[130px] sm:size-[36rem] lg:size-[40rem]" />

      {/* Blue — lower and further right, the second "light source" that
          gives the field its two-tone read. Deliberately smaller than the
          lavender patch above and offset so their overlap band stays inside
          the contrast budget (verified empirically, see chunk-a-report.md). */}
      <div className="absolute top-[34%] right-[0%] size-[22rem] rounded-full bg-blue/[0.035] blur-[110px] sm:size-[26rem] lg:size-[30rem]" />

      {/* A faint, wide wash across the top so the field reads as one
          continuous atmosphere rather than two isolated dots. */}
      <div className="absolute -top-16 left-[10%] size-[26rem] rounded-full bg-lavender/[0.025] blur-[140px] sm:size-[32rem]" />
    </div>
  );
}
