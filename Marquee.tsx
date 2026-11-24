const ITEMS = [
  "Colour grading",
  "Reels & Shorts",
  "YouTube long-form",
  "Motion titles",
  "Sound design",
  "Brand commercials",
  "Wedding films",
  "Performance ads",
];

export default function Marquee() {
  const row = [...ITEMS, ...ITEMS];
  return (
    <div className="relative select-none border-y border-line bg-panel/50 py-5 md:py-6">
      <div className="anim-marquee flex w-max items-center gap-8 md:gap-12">
        {row.map((item, i) => (
          <span key={`${item}-${i}`} className="flex items-center gap-8 md:gap-12">
            <span
              className={`display text-2xl whitespace-nowrap md:text-4xl ${
                i % 3 === 1 ? "italic text-amber" : "text-bone/85"
              }`}
            >
              {item}
            </span>
            <span className="h-1.5 w-1.5 rotate-45 bg-amber/70" />
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-ink to-transparent" />
    </div>
  );
}
