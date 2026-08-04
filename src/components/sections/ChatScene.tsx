"use client";

import { motion } from "motion/react";
import type { ChatMessage } from "@/content/landing";
import { ChatBubble } from "@/components/ui/ChatBubble";
import { GlassCard } from "@/components/ui/GlassCard";

// `initial` is a plain, unconditional object here too — see Hero.tsx's
// `Beat` for why it's deliberately not gated on `useReducedMotion()`.
// "Already settled" under reduced motion comes from the `data-motion-settle`
// CSS rule in globals.css instead.
export function ChatScene({
  label,
  chat,
}: {
  label: string;
  chat: readonly ChatMessage[];
}) {
  return (
    <GlassCard>
      <p className="mb-4 text-xs font-medium text-moss">{label}</p>
      <div className="flex flex-col gap-3">
        {chat.map((message, i) => (
          <motion.div
            key={i}
            data-motion-settle
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 20,
              delay: i * 0.28,
            }}
          >
            <ChatBubble from={message.from}>{message.text}</ChatBubble>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
}
