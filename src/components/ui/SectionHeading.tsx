export function SectionHeading({
  eyebrow,
  title,
  body,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  body?: string;
  align?: "left" | "center";
}) {
  const alignClass = align === "center" ? "text-center mx-auto" : "";
  return (
    <div className={`max-w-2xl ${alignClass}`}>
      <p className="text-sm font-medium uppercase tracking-[0.18em] text-moss">
        {eyebrow}
      </p>
      <h2 className="mt-4 font-serif text-4xl leading-[1.08] text-balance md:text-5xl">
        {title}
      </h2>
      {body ? (
        <p className="mt-5 max-w-[65ch] text-lg leading-relaxed text-moss">
          {body}
        </p>
      ) : null}
    </div>
  );
}
