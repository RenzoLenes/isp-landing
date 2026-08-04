/**
 * Atmospheric background: soft, blurred patches of blue and lavender over the
 * fog surface, concentrated behind the hero and fading out before the next
 * section. Server Component — no client JS, nothing animated, `aria-hidden`
 * so assistive tech skips it entirely.
 *
 * Opacity budget (chunk C, spec Part 1a — see chunk-c-report.md for the full
 * contrast workup, chunk-a-report.md for the original, much fainter pass):
 * chunk A shipped this field at ~4-4.5% peak opacity because the hero copy
 * sat directly in `moss` (4.75:1 on plain `fog` to start with) and left
 * almost no headroom. Chunk C resolves that the other way round, per the
 * brief: the field is now several times stronger, and the hero eyebrow and
 * subtitle moved from `moss` to `ink/75` and `ink/70` (see `Hero.tsx`) to
 * buy back the contrast margin instead of keeping the sky weak. `ink` at
 * those opacities starts with enormous headroom on plain `fog`, so it stays
 * comfortably above 4.5:1 even under the strongest patch overlap — verified
 * by sampling the actual rendered screenshot, not CSS math (see report).
 *
 * The container's own `mask-image` fades the whole field to transparent by
 * ~78% of its height, so intensity dissolves downward and nothing bleeds
 * into the Problem section.
 */
export function GradientField() {
  return (
    <div
      id="gradient-field"
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[820px] overflow-hidden [mask-image:linear-gradient(to_bottom,black,black_32%,transparent_78%)] sm:h-[900px] lg:h-[980px]"
    >
      {/* Lavender — upper field, biased right (behind where the product
          composition sits), well clear of the text column's left edge. */}
      <div className="absolute -top-32 right-[-6%] size-[30rem] rounded-full bg-lavender/[0.16] blur-[130px] sm:size-[36rem] lg:size-[40rem]" />

      {/* Blue — lower and further right, the second "light source" that
          gives the field its two-tone read. Deliberately smaller than the
          lavender patch above and offset so their overlap band stays inside
          the contrast budget (verified empirically, see chunk-c-report.md). */}
      <div className="absolute top-[34%] right-[0%] size-[22rem] rounded-full bg-blue/[0.13] blur-[110px] sm:size-[26rem] lg:size-[30rem]" />

      {/* A wide wash across the top so the field reads as one continuous
          atmosphere rather than two isolated dots. */}
      <div className="absolute -top-16 left-[10%] size-[26rem] rounded-full bg-lavender/[0.09] blur-[140px] sm:size-[32rem]" />
    </div>
  );
}
