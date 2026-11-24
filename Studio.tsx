import { Reveal, SectionTag } from "./ui";

const FACTS = [
  ["Founded", "2016", "Mumbai · remote-first"],
  ["Edits shipped", "2,400+", "across 9 formats"],
  ["Views cut", "180M+", "on client channels"],
  ["First draft", "48 hrs", "average, not a promise"],
];

export default function Studio() {
  return (
    <section id="studio" className="relative border-b border-line py-20 md:py-28 lg:pl-24">
      <div className="mx-auto grid max-w-[1500px] gap-12 px-5 md:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <Reveal y={44} className="relative">
          <div className="relative aspect-[4/5] overflow-hidden border border-line bg-panel">
            <img
              src="images/studio.jpg"
              alt="An editor working late in the SEdit08 studio"
              loading="lazy"
              className="h-full w-full object-cover object-[60%_50%] opacity-85 transition-transform duration-[1600ms] hover:scale-105"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,8,10,0.35),rgba(8,8,10,0.1)_45%,rgba(8,8,10,0.9))]" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
              <span className="label text-bone/75">Suite B · 02:41 AM</span>
              <span className="anim-rec flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-rec" />
                <span className="label text-rec">On air</span>
              </span>
            </div>
            <span className="absolute top-4 left-4 h-4 w-4 border-t border-l border-amber/70" />
            <span className="absolute top-4 right-4 h-4 w-4 border-t border-r border-amber/70" />
          </div>
        </Reveal>

        <div>
          <Reveal>
            <SectionTag index="04" title="The studio" />
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="display mt-6 text-[clamp(2.2rem,4.6vw,4.2rem)]">
              A small room of people who are <span className="italic text-amber">obsessive</span>{" "}
              about the cut.
            </h2>
          </Reveal>
          <Reveal delay={0.14}>
            <div className="mt-7 grid gap-6 text-bone/70 md:grid-cols-2">
              <p className="leading-relaxed">
                SEdit08 started as one editor, one monitor and a stubborn belief that
                most content dies in the first two seconds. We now run a tight
                post-production bench: editors, a colourist and a sound mixer, all on
                the same timeline conventions so any project can pass between them
                without losing its rhythm.
              </p>
              <p className="leading-relaxed">
                We work with founders, wedding cinematographers, creators and performance
                teams who need volume without looking like volume. Every file leaves with
                a master, a vertical cutdown, burned or clean captions, and an archive
                you actually keep.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <dl className="mt-10 grid grid-cols-2 gap-px border border-line bg-line md:grid-cols-4">
              {FACTS.map(([k, v, sub]) => (
                <div key={k} className="group bg-ink p-5 transition-colors duration-500 hover:bg-panel">
                  <dt className="label text-muted">{k}</dt>
                  <dd className="mt-3 font-mono text-2xl tnum text-amber transition-transform duration-500 group-hover:-translate-y-0.5">
                    {v}
                  </dd>
                  <dd className="mt-1 text-[0.72rem] leading-snug text-bone/45">{sub}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
