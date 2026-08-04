/**
 * Atmospheric background: soft, blurred patches of blue and lavender over the
 * fog surface, concentrated behind the hero and fading out before the next
 * section. Server Component — no client JS, nothing animated, `aria-hidden`
 * so assistive tech skips it entirely.
 *
 * Opacity budget (hero-fixes-report.md, 2026-08-04 — see chunk-c-report.md
 * for the prior pass's contrast workup, chunk-a-report.md for the original,
 * much fainter one): chunk A shipped this field at ~4-4.5% peak opacity;
 * chunk C raised it several times over and moved the hero eyebrow/subtitle
 * from `moss` to `ink/75`/`ink/70` to buy back contrast margin. The client's
 * side-by-side still read chunk C's field as flat at 1440 — this pass pushes
 * every patch further again (roughly +60-70% over chunk C's peak opacities,
 * sampled and tuned against a real screenshot, not guessed — an earlier
 * attempt at ~2x plus a fourth full-width wash overshot into a flat pastel
 * rectangle with no gradient character left, which is exactly the "color
 * plano" DESIGN.md §3 bans). The hero eyebrow and subtitle darken further
 * still, from `ink/75`/`ink/70` to `ink/85`, to hold the AA floor under the
 * stronger field — verified by sampling the actual rendered screenshot, not
 * CSS math (see hero-fixes-report.md).
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
      <div className="absolute -top-32 right-[-6%] size-[30rem] rounded-full bg-lavender/[0.32] blur-[130px] sm:size-[36rem] lg:size-[40rem]" />

      {/* Blue — lower and further right, the second "light source" that
          gives the field its two-tone read. Deliberately smaller than the
          lavender patch above and offset so their overlap band stays inside
          the contrast budget (verified empirically, see hero-fixes-report.md). */}
      <div className="absolute top-[34%] right-[0%] size-[22rem] rounded-full bg-blue/[0.27] blur-[110px] sm:size-[26rem] lg:size-[30rem]" />

      {/* A wide wash across the top so the field reads as one continuous
          atmosphere rather than two isolated dots. */}
      <div className="absolute -top-16 left-[10%] size-[26rem] rounded-full bg-lavender/[0.19] blur-[140px] sm:size-[32rem]" />
    </div>
  );
}
