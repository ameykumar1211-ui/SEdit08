import { useEffect, useRef, useState } from "react";
import { usePortfolio, thumbUrl, type PortfolioItem } from "@/lib/store";
import { scrollToTarget } from "@/lib/scroll";
import { SectionTag } from "./ui";

function Thumb({ item }: { item: PortfolioItem }) {
  const [stage, setStage] = useState(0);
  if (stage > 2) return null;
  const src =
    stage === 0
      ? `https://i.ytimg.com/vi/${item.videoId}/oardefault.jpg`
      : stage === 1
        ? thumbUrl(item.videoId)
        : item.cover || "images/short-1.jpg";

  return (
    <img
      src={src}
      alt={item.title}
      loading="lazy"
      onError={() => setStage((s) => s + 1)}
      className="absolute inset-0 h-full w-full scale-105 object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.14]"
    />
  );
}

function Card({ item, index }: { item: PortfolioItem; index: number }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block w-[76vw] max-w-[310px] shrink-0 sm:w-[270px] lg:w-[clamp(250px,18vw,320px)]"
    >
      <div className="relative aspect-[9/16] overflow-hidden border border-line bg-[linear-gradient(150deg,#1a1a20,#0c0c10)]">
        <Thumb item={item} />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,8,10,0.62)_0%,rgba(8,8,10,0.05)_38%,rgba(8,8,10,0.92)_100%)]" />

        <span className="absolute top-3 left-3 font-mono text-[10px] tnum tracking-[0.2em] text-bone/70">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="label absolute top-3 right-3 border border-amber/45 bg-ink/60 px-2 py-1 text-amber backdrop-blur-sm">
          Shorts
        </span>

        <span className="absolute top-1/2 left-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 scale-75 items-center justify-center rounded-full border border-bone/40 bg-ink/50 opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:scale-100 group-hover:opacity-100">
          <svg viewBox="0 0 24 24" className="ml-1 h-5 w-5 fill-bone" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>

        <div className="absolute inset-x-0 bottom-0 p-4">
          <p className="display text-2xl leading-none text-bone">{item.title}</p>
          <div className="mt-2 flex items-center justify-between gap-2">
            <span className="label text-amber/90">{item.category}</span>
            <span className="label text-bone/40 transition-colors group-hover:text-bone">
              Watch ↗
            </span>
          </div>
        </div>

        {/* corner ticks */}
        <span className="absolute top-0 left-0 h-3 w-3 border-t border-l border-amber/60" />
        <span className="absolute right-0 bottom-0 h-3 w-3 border-r border-b border-amber/60" />
      </div>
      <div className="mt-3 h-px w-full origin-left scale-x-0 bg-amber transition-transform duration-700 group-hover:scale-x-100" />
    </a>
  );
}

function Head({ count, hint }: { count: number; hint: string }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <SectionTag index="03" title="Selected work" />
        <h2 className="display mt-4 text-[clamp(2rem,4.2vw,3.4rem)]">
          Scroll is the <span className="italic text-amber">playhead</span>.
        </h2>
      </div>
      <p className="label max-w-[16rem] text-right text-muted">
        {count} cuts · 2024—2026
        <span className="mt-2 block text-amber">{hint}</span>
      </p>
    </div>
  );
}

export default function Work() {
  const { items } = usePortfolio();
  const sectionRef = useRef<HTMLElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [travel, setTravel] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const on = () => setIsDesktop(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  useEffect(() => {
    if (!isDesktop) {
      setTravel(0);
      return;
    }
    const measure = () => {
      const strip = stripRef.current;
      if (!strip) return;
      const dist = Math.max(0, strip.scrollWidth - window.innerWidth + 120);
      setTravel(Math.round(dist * 1.06));
    };
    measure();
    const t1 = window.setTimeout(measure, 350);
    const t2 = window.setTimeout(measure, 1200);
    window.addEventListener("resize", measure);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener("resize", measure);
    };
  }, [isDesktop, items.length]);

  useEffect(() => {
    if (!isDesktop || travel <= 0) return;
    let raf = 0;
    const tick = () => {
      const sec = sectionRef.current;
      const strip = stripRef.current;
      if (sec && strip) {
        const rect = sec.getBoundingClientRect();
        const total = Math.max(1, sec.offsetHeight - window.innerHeight);
        const p = Math.min(1, Math.max(0, -rect.top / total));
        const dist = Math.max(0, strip.scrollWidth - window.innerWidth + 120);
        strip.style.transform = `translate3d(${-p * dist}px,0,0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isDesktop, travel]);

  if (items.length === 0) {
    return (
      <section id="work" className="border-b border-line px-5 py-28 md:px-8 lg:pl-24">
        <div className="mx-auto max-w-[1500px]">
          <SectionTag index="03" title="Selected work" />
          <p className="display mt-8 max-w-2xl text-3xl text-muted md:text-5xl">
            The bin is empty — the studio is cutting new work. Add a Short from the
            admin panel and it lands right here.
          </p>
        </div>
      </section>
    );
  }

  if (!isDesktop) {
    return (
      <section id="work" className="border-b border-line py-20">
        <div className="px-5 md:px-8">
          <Head count={items.length} hint="Swipe →" />
        </div>
        <div
          data-lenis-prevent
          className="mt-9 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 md:px-8"
        >
          {items.map((item, i) => (
            <div key={item.id} className="shrink-0 snap-start">
              <Card item={item} index={i} />
            </div>
          ))}
          <div className="w-2 shrink-0" />
        </div>
      </section>
    );
  }

  return (
    <section
      id="work"
      ref={sectionRef}
      style={{ height: `calc(100vh + ${travel}px)` }}
      className="relative border-b border-line"
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="mx-auto w-full max-w-[1500px] px-5 pt-20 pb-4 md:px-8 lg:pl-24">
          <Head count={items.length} hint="Keep scrolling ↓" />
        </div>
        <div
          ref={stripRef}
          className="flex w-max items-start gap-7 pt-6 pl-5 will-change-transform md:pl-8 lg:pl-24"
        >
          {items.map((item, i) => (
            <Card key={item.id} item={item} index={i} />
          ))}

          {/* end-of-reel panel */}
          <div className="flex w-[76vw] max-w-[340px] shrink-0 flex-col justify-between border border-dashed border-line bg-panel/40 p-7 sm:w-[300px] lg:w-[360px]">
            <div>
              <span className="label text-amber">End of reel</span>
              <p className="display mt-5 text-4xl leading-[0.95]">
                Your brand
                <br />
                <span className="italic">goes here.</span>
              </p>
            </div>
            <p className="text-sm leading-relaxed text-bone/60">
              Send the brief, get a first cut inside 48 hours. Two revision passes are
              always included.
            </p>
            <button
              onClick={() => scrollToTarget("#inquire")}
              className="label group relative mt-6 overflow-hidden border border-amber py-4 text-amber transition-colors duration-300 hover:text-ink"
            >
              <span className="absolute inset-0 -translate-x-full bg-amber transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0" />
              <span className="relative z-10">Start a project →</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
