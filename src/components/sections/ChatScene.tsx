"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ChatMessage } from "@/content/landing";
import { ChatBubble } from "@/components/ui/ChatBubble";
import { GlassCard } from "@/components/ui/GlassCard";

export function ChatScene({
  label,
  chat,
}: {
  label: string;
  chat: readonly ChatMessage[];
}) {
  const reduceMotion = useReducedMotion();
  return (
    <GlassCard>
      <p className="mb-4 text-xs font-medium text-moss">{label}</p>
      <div className="flex flex-col gap-3">
        {chat.map((message, i) => (
          <motion.div
            key={i}
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
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
