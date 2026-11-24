import { motion } from "framer-motion";
import { Reveal, SectionTag, BracketButton } from "./ui";

const STEPS = [
  {
    tc: "00:00",
    t: "Brief lands",
    d: "You send footage, references and the deadline on WhatsApp. We reply with scope, quote and a slot.",
  },
  {
    tc: "00:01",
    t: "Assembly cut",
    d: "First draft inside 48 hours — structure, pacing, temp score, captions roughed in.",
  },
  {
    tc: "00:02",
    t: "Notes round",
    d: "Timestamped feedback. Two revision passes included; more are quoted flat, never hourly.",
  },
  {
    tc: "00:03",
    t: "Grade & masters",
    d: "Final grade, sound mix, then 16:9, 9:16 and 1:1 masters plus the project archive.",
  },
];

export default function Process() {
  return (
    <section id="process" className="relative overflow-hidden border-b border-line">
      <div className="absolute inset-0">
        <img
          src="images/console.jpg"
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#08080A_0%,rgba(8,8,10,0.86)_35%,rgba(8,8,10,0.92)_100%)]" />
      </div>

      <div className="relative mx-auto max-w-[1500px] px-5 py-20 md:px-8 md:py-28 lg:pl-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <SectionTag index="06" title="Process" />
            <h2 className="display mt-5 text-[clamp(2.4rem,6vw,5rem)]">
              Four marks on <span className="italic text-amber">one</span> timeline.
            </h2>
          </div>
          <span className="label text-muted">Avg. project · 4 days start to master</span>
        </div>

        {/* ruler */}
        <div className="relative mt-12 h-px w-full bg-line">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-x-0 top-0 h-px origin-left bg-amber"
          />
          <div className="absolute inset-x-0 -top-1 flex justify-between">
            {STEPS.map((s) => (
              <span key={s.tc} className="h-2 w-2 rotate-45 border border-amber/70 bg-ink" />
            ))}
          </div>
        </div>

        <div className="grid gap-px bg-line md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <Reveal key={s.tc} delay={i * 0.1} y={30}>
              <div className="group relative h-full bg-ink/85 p-6 backdrop-blur-sm transition-colors duration-500 hover:bg-panel md:p-7">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs tnum tracking-[0.2em] text-amber">{s.tc}</span>
                  <span className="h-2 w-2 rotate-45 border border-amber/60 transition-colors duration-500 group-hover:bg-amber" />
                </div>
                <h3 className="display mt-6 text-3xl md:text-4xl">{s.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-bone/60">{s.d}</p>
                <span className="absolute bottom-0 left-0 h-px w-0 bg-amber transition-all duration-700 group-hover:w-full" />
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <BracketButton href="#inquire" variant="ghost">
              Book a slot this week
            </BracketButton>
            <span className="label text-muted">
              Rush deliveries available · +30% for 24h turnaround
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
