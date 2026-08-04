export function ResultCard({ title, meta }: { title: string; meta: string }) {
  return (
    <div className="rounded-2xl border border-fiber/40 bg-fiber/15 px-5 py-4">
      <div className="flex items-center gap-2.5">
        <span aria-hidden className="size-2 rounded-full bg-fiber" />
        <p className="text-sm font-medium text-ink [font-variant-numeric:tabular-nums]">
          {title}
        </p>
      </div>
      <p className="mt-1.5 pl-[18px] text-xs leading-relaxed text-moss [font-variant-numeric:tabular-nums]">
        {meta}
      </p>
    </div>
  );
}
