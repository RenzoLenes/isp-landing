import type { ReactNode } from "react";

export function GlassCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-3xl border border-whisper bg-surface/80 p-5 shadow-float backdrop-blur-md ${className}`}
    >
      {children}
    </div>
  );
}
