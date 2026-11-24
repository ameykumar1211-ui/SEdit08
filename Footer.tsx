import { scrollToTarget, scrollToTop } from "@/lib/scroll";
import { WHATSAPP_NUMBER } from "@/lib/firebase";
import { Mark } from "./ui";

type Col = { head: string; items: { label: string; to?: string }[] };

const COLS: Col[] = [
  {
    head: "Sitemap",
    items: [
      { label: "Selected work", to: "#work" },
      { label: "The studio", to: "#studio" },
      { label: "Services", to: "#services" },
      { label: "Process", to: "#process" },
      { label: "Inquiry", to: "#inquire" },
    ],
  },
  {
    head: "Formats",
    items: [
      { label: "9:16 · Shorts & Reels" },
      { label: "16:9 · YouTube & films" },
      { label: "1:1 · Feed & placements" },
      { label: "ProRes / H.264 masters" },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden lg:pl-24">
      <div className="mx-auto max-w-[1500px] px-5 pt-16 md:px-8 md:pt-20">
        <div className="grid gap-10 border-b border-line pb-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <button
              onClick={scrollToTop}
              className="group flex items-center gap-3 text-amber"
              aria-label="Back to top"
            >
              <Mark className="h-9 w-9 transition-transform duration-700 group-hover:rotate-[190deg]" />
            </button>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-bone/55">
              SEdit08 is a post-production studio cutting short-form, YouTube and brand
              work from India, for clients everywhere.
            </p>
            <a
              href={`https://wa.me/91${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="label mt-5 inline-flex items-center gap-2 text-[#25D366] transition-opacity hover:opacity-75"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#25D366]" />
              +91 {WHATSAPP_NUMBER}
            </a>
            <p className="label mt-3 text-muted">hello@sedit08.studio</p>
          </div>

          {COLS.map((col) => (
            <div key={col.head}>
              <p className="label text-amber">{col.head}</p>
              <ul className="mt-5 space-y-3">
                {col.items.map((it) => (
                  <li key={it.label}>
                    {it.to ? (
                      <button
                        onClick={() => scrollToTarget(it.to!)}
                        className="text-sm text-bone/65 transition-colors duration-300 hover:text-amber"
                      >
                        {it.label}
                      </button>
                    ) : (
                      <span className="text-sm text-bone/65">{it.label}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p className="label text-amber">Studio</p>
            <ul className="mt-5 space-y-3 text-sm text-bone/65">
              <li>Mon–Sat · 10:00–20:00 IST</li>
              <li>Rush cuts in 24 hours</li>
              <li>Remote onboarding, all India</li>
            </ul>
            <a
              href="admin.html"
              className="label mt-6 inline-flex border border-line px-4 py-3 text-muted transition-colors hover:border-amber hover:text-amber"
            >
              Admin panel →
            </a>
          </div>
        </div>

        {/* oversized wordmark */}
        <div className="relative mt-10 select-none overflow-hidden">
          <p
            className="display text-center text-[clamp(3.6rem,17vw,15rem)] leading-[0.82] text-transparent"
            style={{ WebkitTextStroke: "1px rgba(242,239,233,0.22)" }}
          >
            SEdit08
          </p>
          <p
            aria-hidden="true"
            className="display absolute inset-x-0 bottom-0 text-center text-[clamp(3.6rem,17vw,15rem)] leading-[0.82] text-amber/90 transition-all duration-700"
            style={{
              WebkitTextStroke: "0px transparent",
              clipPath: "inset(0 0 55% 0)",
              opacity: 0.16,
            }}
          >
            SEdit08
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-line py-6">
          <span className="label text-muted">© {year} SEdit08 · All frames reserved</span>
          <span className="label tnum text-muted">Cut in India · 24 fps · Rec.709</span>
          <button onClick={scrollToTop} className="label text-amber hover:underline">
            Back to top ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
