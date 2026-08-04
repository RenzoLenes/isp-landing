"use client";

import { useState } from "react";
import { LANDING } from "@/content/landing";
import { ButtonLink } from "@/components/ui/ButtonLink";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { brand, links, cta } = LANDING.nav;

  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4">
      <div className="mx-auto flex max-w-content items-center justify-between rounded-full border border-whisper bg-surface/75 py-2.5 pl-6 pr-2.5 shadow-card backdrop-blur-md md:max-w-3xl">
        <a href="#" className="font-serif text-2xl leading-none text-ink">
          {brand}
        </a>
        <nav aria-label="Principal" className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-moss transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="hidden md:block">
          <ButtonLink href={cta.href} className="min-h-10 px-5 py-2">
            {cta.label}
          </ButtonLink>
        </div>
        <button
          type="button"
          aria-expanded={open}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen((v) => !v)}
          className="flex size-11 items-center justify-center rounded-full text-ink md:hidden"
        >
          <span aria-hidden className="relative block h-3 w-5">
            <span
              className={`absolute left-0 top-0 h-px w-full bg-ink transition-transform duration-200 ${open ? "translate-y-[5.5px] rotate-45" : ""}`}
            />
            <span
              className={`absolute bottom-0 left-0 h-px w-full bg-ink transition-transform duration-200 ${open ? "-translate-y-[5.5px] -rotate-45" : ""}`}
            />
          </span>
        </button>
      </div>

      {open ? (
        <div className="mx-auto mt-2 max-w-content rounded-3xl border border-whisper bg-surface/95 p-6 shadow-float backdrop-blur-md md:hidden">
          <nav aria-label="Principal móvil" className="flex flex-col gap-4">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-lg text-ink"
              >
                {link.label}
              </a>
            ))}
            <ButtonLink
              href={cta.href}
              className="mt-2 w-full"
            >
              {cta.label}
            </ButtonLink>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
