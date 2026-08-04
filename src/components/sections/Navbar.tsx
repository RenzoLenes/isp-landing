"use client";

import { useEffect, useState } from "react";
import { LANDING } from "@/content/landing";
import { ButtonLink } from "@/components/ui/ButtonLink";

const SCROLL_THRESHOLD = 24;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { brand, links, cta } = LANDING.nav;

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > SCROLL_THRESHOLD);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 z-50 px-4 transition-[top] duration-300 ease-out motion-reduce:transition-none ${
        scrolled ? "top-2" : "top-4"
      }`}
    >
      <div
        className={`mx-auto flex max-w-content items-center justify-between rounded-full border border-whisper bg-surface/60 pl-6 pr-2.5 py-1 shadow-[0_6px_16px_-10px_rgb(23_32_27/0.16)] backdrop-blur-md transition-transform duration-300 ease-out motion-reduce:transition-none md:max-w-3xl ${
          scrolled ? "scale-[0.97]" : ""
        }`}
      >
        <a
          href="#"
          className="flex min-h-11 items-center font-display text-2xl leading-none text-ink"
        >
          {brand}
        </a>
        <nav aria-label="Principal" className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="flex items-center py-4 text-[13px] leading-none text-moss/80 transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="hidden md:block">
          {/* Fix 4 (hero-fixes-report.md): unify the two primary CTAs — the
              hero's is `ink`, so the nav's now matches instead of staying
              `blue`, per the references (Qipeline uses the same dark
              treatment in both). Blue remains the accent for links, focus
              rings, and the triad's context node; it's no longer used as a
              CTA fill anywhere on the page. */}
          <ButtonLink href={cta.href} variant="ink" size="sm">
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
                className="flex min-h-11 items-center text-lg text-ink"
              >
                {link.label}
              </a>
            ))}
            <ButtonLink href={cta.href} variant="ink" className="mt-2 w-full">
              {cta.label}
            </ButtonLink>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
