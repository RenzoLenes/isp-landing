import { LANDING } from "@/content/landing";

export function Footer() {
  const { brand, tagline, contact } = LANDING.footer;
  return (
    <footer className="border-t border-whisper px-4 py-10">
      <div className="mx-auto flex max-w-content flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="font-serif text-2xl text-ink">{brand}</p>
          <p className="mt-1 text-sm text-moss">{tagline}</p>
        </div>
        <div className="text-sm text-moss">
          <a href={`mailto:${contact}`} className="hover:text-ink">
            {contact}
          </a>
          <span className="mx-2" aria-hidden>·</span>
          <span>{new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}
