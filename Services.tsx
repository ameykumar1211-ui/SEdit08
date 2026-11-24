import { useRef, useState } from "react";
import { Reveal, SectionTag } from "./ui";

const ROWS = [
  {
    n: "01",
    t: "Short-form edits",
    d: "Reels, Shorts & TikToks. Hook inside 1.5s, kinetic captions, 9:16 masters.",
    img: "images/short-1.jpg",
  },
  {
    n: "02",
    t: "YouTube long-form",
    d: "Retention-first assembly, B-roll sourcing, pattern interrupts, chapter marks.",
    img: "images/studio.jpg",
  },
  {
    n: "03",
    t: "Brand films & ads",
    d: "Concept to delivery for performance creative — hook variants included.",
    img: "images/grade.jpg",
  },
  {
    n: "04",
    t: "Colour grading",
    d: "Shot-matched grades, skin protection, film emulation, LUT builds for teams.",
    img: "images/console.jpg",
  },
  {
    n: "05",
    t: "Motion & titles",
    d: "Lower thirds, logo stings, callout systems and end-cards that stay on brand.",
    img: "images/short-3.jpg",
  },
  {
    n: "06",
    t: "Wedding & events",
    d: "Teaser, highlight and film edits — coloured, scored and delivered in sequence.",
    img: "images/short-2.jpg",
  },
];

export default function Services() {
  const [hover, setHover] = useState<number | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const raf = useRef(0);

  const onMove = (e: React.MouseEvent) => {
    const el = previewRef.current;
    if (!el) return;
    const x = e.clientX;
    const y = e.clientY;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      el.style.transform = `translate3d(${x + 26}px, ${y - 150}px, 0) rotate(${
        (x / window.innerWidth - 0.5) * 5
      }deg)`;
    });
  };

  return (
    <section
      id="services"
      onMouseMove={onMove}
      onMouseLeave={() => setHover(null)}
      className="relative border-b border-line py-20 md:py-28 lg:pl-24"
    >
      <div className="mx-auto max-w-[1500px] px-5 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <SectionTag index="05" title="Services" />
            <h2 className="display mt-5 text-[clamp(2.4rem,6vw,5rem)]">
              What lands in <span className="italic text-amber">your</span> drive.
            </h2>
          </div>
          <p className="label max-w-xs text-muted">
            Fixed quotes per deliverable · retainers available for teams shipping weekly
          </p>
        </div>

        <div className="mt-12 border-t border-line">
          {ROWS.map((r, i) => (
            <Reveal key={r.n} delay={i * 0.05} y={22}>
              <div
                onMouseEnter={() => setHover(i)}
                className="group relative flex cursor-default items-baseline gap-4 border-b border-line py-6 transition-colors duration-500 hover:bg-panel/45 md:gap-8 md:py-8"
              >
                <span className="label w-8 shrink-0 text-muted transition-colors duration-300 group-hover:text-amber md:w-12">
                  {r.n}
                </span>
                <div className="flex-1 md:flex md:items-baseline md:justify-between md:gap-8">
                  <h3 className="display text-[clamp(1.8rem,4vw,3.4rem)] transition-all duration-500 group-hover:translate-x-2 group-hover:text-amber">
                    {r.t}
                  </h3>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-bone/55 transition-colors duration-500 group-hover:text-bone/85 md:mt-0 md:max-w-sm md:text-right">
                    {r.d}
                  </p>
                </div>
                <span className="hidden shrink-0 text-amber opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100 md:block">
                  →
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* cursor-following frame preview */}
      <div
        ref={previewRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-30 hidden lg:block"
        style={{ opacity: hover !== null ? 1 : 0, transition: "opacity 400ms ease" }}
      >
        <div
          className={`h-[210px] w-[150px] overflow-hidden border border-amber/40 bg-panel shadow-[0_30px_70px_rgba(0,0,0,0.6)] ${
            hover !== null ? "scale-100" : "scale-95"
          }`}
          style={{ transition: "transform 500ms cubic-bezier(0.16,1,0.3,1)" }}
        >
          <img
            src={hover !== null ? ROWS[hover].img : ROWS[0].img}
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/85 to-transparent" />
          <span className="label absolute bottom-2 left-2 text-amber">
            {hover !== null ? `${ROWS[hover].n} · clip` : "· clip"}
          </span>
        </div>
      </div>
    </section>
  );
}
