import { motion } from "framer-motion";
import { scrollToTarget } from "@/lib/scroll";
import { EASE, BracketButton } from "./ui";

const LINE = {
  hidden: { y: "115%" },
  show: (i: number) => ({
    y: "0%",
    transition: { duration: 1.1, delay: 0.15 + i * 0.11, ease: EASE },
  }),
};

const STATS = [
  ["2,400+", "cuts delivered"],
  ["180M+", "views edited"],
  ["48h", "avg turnaround"],
  ["24fps", "always in sync"],
];

export default function Hero() {
  return (
    <section id="top" className="grain relative min-h-[100svh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="images/suite.jpg"
          alt="A colour grading suite lit by tungsten light"
          className="anim-kenburns h-full w-full object-cover object-[72%_50%] opacity-70"
          loading="eager"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#08080A_0%,rgba(8,8,10,0.94)_34%,rgba(8,8,10,0.45)_72%,rgba(8,8,10,0.86)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,8,10,0.95)_0%,rgba(8,8,10,0.1)_26%,rgba(8,8,10,0.15)_58%,#08080A_100%)]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1500px] flex-col justify-between px-5 pt-24 pb-8 md:px-8 md:pt-32 lg:pl-24">
        {/* top marker */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="flex flex-wrap items-center gap-x-5 gap-y-2"
        >
          <span className="flex items-center gap-2">
            <span className="anim-rec h-1.5 w-1.5 rounded-full bg-rec" />
            <span className="label text-rec">Rec</span>
          </span>
          <span className="label text-muted">Seq 01 — SEdit08 master</span>
          <span className="hidden h-px flex-1 bg-line sm:block" />
          <span className="label tnum text-muted">Est. 2016 · India</span>
        </motion.div>

        {/* headline */}
        <div className="py-10 md:py-12">
          <div className="overflow-hidden pb-[0.1em]">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
              className="label mb-6 text-amber md:mb-8"
            >
              Post-production studio
            </motion.p>
          </div>

          <h1 className="display text-[clamp(2.9rem,min(9vw,11svh),7.6rem)]">
            <span className="block overflow-hidden pb-[0.06em]">
              <motion.span custom={0} variants={LINE} initial="hidden" animate="show" className="block">
                Precision edits
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-[0.06em]">
              <motion.span custom={1} variants={LINE} initial="hidden" animate="show" className="block">
                for brands that
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-[0.08em]">
              <motion.span
                custom={2}
                variants={LINE}
                initial="hidden"
                animate="show"
                className="block italic text-amber"
              >
                refuse to blend in.
              </motion.span>
            </span>
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7, ease: EASE }}
            className="mt-8 max-w-xl md:mt-10"
          >
            <p className="text-base leading-relaxed text-bone/70 md:text-lg">
              SEdit08 cuts short-form edits, YouTube films and brand commercials —
              frame-accurate, colour-graded, sound-designed and shipped on a clock you
              can plan around.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <BracketButton href="#inquire">Start a project</BracketButton>
              <BracketButton href="#work" variant="ghost">
                See the work
              </BracketButton>
            </div>
          </motion.div>
        </div>

        {/* bottom transport */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1, ease: EASE }}
          className="border-t border-line pt-5"
        >
          <div className="grid grid-cols-2 gap-y-5 md:grid-cols-4">
            {STATS.map(([n, l]) => (
              <div key={l} className="flex items-baseline gap-3">
                <span className="font-mono text-lg tnum text-amber md:text-xl">{n}</span>
                <span className="label text-muted">{l}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => scrollToTarget("#work")}
            className="label mt-6 flex items-center gap-3 text-muted transition-colors hover:text-bone"
          >
            <span className="relative flex h-8 w-4 items-start justify-center rounded-full border border-line p-1">
              <motion.span
                animate={{ y: [0, 10, 0], opacity: [1, 0.2, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                className="h-1.5 w-px bg-amber"
              />
            </span>
            Scroll to scrub
          </button>
        </motion.div>
      </div>
    </section>
  );
}
