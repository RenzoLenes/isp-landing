export function ResultCard({ title, meta }: { title: string; meta: string }) {
  return (
    // Unlike DataCard/DecisionChain, this card has no opaque white base of
    // its own — `bg-signal/10` is a translucent tint over whatever sits
    // behind it. On light registers that's ~white-with-a-hint-of-Señal, so
    // ink/steel are safe; on `night` the same tint composites toward a dark
    // green instead, and ink/steel would nearly vanish. Reading the register
    // vars fixes both cases with the same markup: they resolve to ink/steel
    // by default and flip to surface/mist under `data-register="night"`,
    // same as SectionHeading. `border-signal/35` needs no equivalent swap —
    // Señal reads as a visible border against either a light or a dark-
    // tinted background.
    <div className="rounded-2xl border border-signal/35 bg-signal/10 px-5 py-4">
      <div className="flex items-center gap-2.5">
        <span aria-hidden className="size-2 rounded-full bg-signal" />
        <p className="text-sm font-medium text-[color:var(--text-primary)] [font-variant-numeric:tabular-nums]">
          {title}
        </p>
      </div>
      <p className="mt-1.5 pl-[18px] text-xs leading-relaxed text-[color:var(--text-secondary)] [font-variant-numeric:tabular-nums]">
        {meta}
      </p>
    </div>
  );
}
