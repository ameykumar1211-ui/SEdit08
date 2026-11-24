import { useCallback, useRef, useState } from "react";
import { Reveal, SectionTag } from "./ui";

const NOTES = [
  ["ACEScct", "scene-referred pipeline, shot-matched"],
  ["Skin first", "highlight rolloff before anything else"],
  ["Delivery", "Rec.709 · H.264 · vertical + 16:9 masters"],
];

export default function Grade() {
  const [pos, setPos] = useState(54);
  const boxRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const setFromX = useCallback((clientX: number) => {
    const box = boxRef.current;
    if (!box) return;
    const r = box.getBoundingClientRect();
    setPos(Math.min(97, Math.max(3, ((clientX - r.left) / r.width) * 100)));
  }, []);

  return (
    <section className="relative border-b border-line py-20 md:py-28 lg:pl-24">
      <div className="mx-auto grid max-w-[1500px] items-center gap-10 px-5 md:px-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
        <div>
          <Reveal>
            <SectionTag index="02" title="The grade" />
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="display mt-6 text-[clamp(2.4rem,5vw,4.4rem)]">
              Colour is <span className="italic text-amber">half</span> the story.
            </h2>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mt-5 max-w-md leading-relaxed text-bone/65">
              Every frame that leaves SEdit08 gets a proper grade pass — matched shots,
              protected skin, honest blacks. Drag the handle and watch the same frame
              go from flat log to finished.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <dl className="mt-8 space-y-4 border-t border-line pt-6">
              {NOTES.map(([k, v]) => (
                <div key={k} className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <dt className="label w-28 shrink-0 text-amber">{k}</dt>
                  <dd className="text-sm text-bone/70">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <Reveal delay={0.1} y={44}>
          <div
            ref={boxRef}
            onPointerDown={(e) => {
              dragging.current = true;
              (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
              setFromX(e.clientX);
            }}
            onPointerMove={(e) => {
              if (dragging.current) setFromX(e.clientX);
            }}
            onPointerUp={() => (dragging.current = false)}
            onPointerLeave={() => (dragging.current = false)}
            className="group relative aspect-[16/10] w-full cursor-ew-resize touch-none overflow-hidden border border-line bg-panel select-none"
          >
            <img
              src="images/grade.jpg"
              alt="Graded film still of a car on a coastal road"
              className="absolute inset-0 h-full w-full object-cover"
              draggable={false}
            />
            <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
              <img
                src="images/grade.jpg"
                alt=""
                aria-hidden="true"
                className="h-full w-full object-cover"
                style={{ filter: "saturate(0.18) contrast(0.86) brightness(0.92)" }}
                draggable={false}
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(120,126,132,0.18),rgba(90,96,102,0.12))]" />
            </div>

            <span className="label absolute top-4 left-4 border border-bone/25 bg-ink/70 px-2.5 py-1.5 text-bone/80 backdrop-blur-sm">
              Before · Log
            </span>
            <span className="label absolute top-4 right-4 border border-amber/50 bg-ink/70 px-2.5 py-1.5 text-amber backdrop-blur-sm">
              After · Graded
            </span>

            <div
              className="absolute inset-y-0 w-px bg-amber shadow-[0_0_18px_rgba(233,161,59,0.7)]"
              style={{ left: `${pos}%` }}
            >
              <div
                tabIndex={0}
                role="slider"
                aria-label="Colour grade comparison"
                aria-valuenow={Math.round(pos)}
                aria-valuemin={0}
                aria-valuemax={100}
                onKeyDown={(e) => {
                  if (e.key === "ArrowLeft") setPos((p) => Math.max(3, p - 4));
                  if (e.key === "ArrowRight") setPos((p) => Math.min(97, p + 4));
                }}
                className="absolute top-1/2 left-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-amber bg-ink/85 text-xs text-amber backdrop-blur transition-transform duration-300 group-hover:scale-110"
              >
                ◀▶
              </div>
            </div>

            <span className="absolute bottom-3 left-4 font-mono text-[10px] tnum tracking-[0.2em] text-bone/55">
              00:00:14:07
            </span>
            <span className="absolute right-4 bottom-3 font-mono text-[10px] tnum tracking-[0.2em] text-bone/55">
              3840×2160 · 23.976
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
