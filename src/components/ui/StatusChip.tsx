const TONES = {
  ok: "bg-signal/15 text-ink",
  alert: "bg-coral/20 text-ink",
  neutral: "bg-sunk text-steel",
} as const;

export function StatusChip({
  label,
  tone,
}: {
  label: string;
  tone: keyof typeof TONES;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${TONES[tone]}`}
    >
      {label}
    </span>
  );
}
