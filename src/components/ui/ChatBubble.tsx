import type { ReactNode } from "react";
import { LANDING } from "@/content/landing";

export function ChatBubble({
  from,
  children,
}: {
  from: "cliente" | "bot";
  children: ReactNode;
}) {
  const isCliente = from === "cliente";
  return (
    <div className={`flex ${isCliente ? "justify-start" : "justify-end"}`}>
      <p
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isCliente
            ? "rounded-bl-md border border-whisper bg-surface text-ink"
            : "rounded-br-md bg-fog-deep text-ink"
        }`}
      >
        <span className="sr-only">{LANDING.chatSpeakers[from]}: </span>
        {children}
      </p>
    </div>
  );
}
