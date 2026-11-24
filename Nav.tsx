import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { scrollToTarget, scrollToTop } from "@/lib/scroll";
import { EASE, Mark, Wordmark } from "./ui";

const LINKS = [
  { id: "#work", label: "Work" },
  { id: "#studio", label: "Studio" },
  { id: "#services", label: "Services" },
  { id: "#process", label: "Process" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const go = (selector: string) => {
    setOpen(false);
    setTimeout(() => scrollToTarget(selector), open ? 260 : 0);
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "border-b border-line bg-ink/80 backdrop-blur-xl"
            : "border-b border-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between px-5 md:h-[74px] md:px-8 lg:pl-24">
          <button
            onClick={() => {
              scrollToTop();
            }}
            className="group flex items-center gap-3 text-bone"
            aria-label="SEdit08 home"
          >
            <span className="text-amber transition-transform duration-700 group-hover:rotate-[190deg]">
              <Mark className="h-8 w-8 md:h-9 md:w-9" />
            </span>
            <Wordmark className="group-hover:text-amber" />
          </button>

          <nav className="hidden items-center gap-9 md:flex">
            {LINKS.map((l) => (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                className="label group relative text-muted transition-colors duration-300 hover:text-bone"
              >
                {l.label}
                <span className="absolute -bottom-2 left-0 h-px w-0 bg-amber transition-all duration-500 group-hover:w-full" />
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="admin.html"
              className="label hidden border border-line px-4 py-3 text-muted transition-colors duration-300 hover:border-amber hover:text-amber sm:inline-flex"
            >
              Admin
            </a>
            <button
              onClick={() => go("#inquire")}
              className="label group relative hidden overflow-hidden border border-amber px-5 py-3 text-amber transition-colors duration-300 hover:text-ink sm:inline-flex"
            >
              <span className="absolute inset-0 -translate-x-full bg-amber transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0" />
              <span className="relative z-10">Start a project</span>
            </button>
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu"
              className="flex h-11 w-11 flex-col items-center justify-center gap-[5px] border border-line md:hidden"
            >
              <span
                className={`h-px w-5 bg-bone transition-transform duration-300 ${open ? "translate-y-[3px] rotate-45" : ""}`}
              />
              <span
                className={`h-px w-5 bg-bone transition-transform duration-300 ${open ? "-translate-y-[3px] -rotate-45" : ""}`}
              />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-40 flex flex-col justify-between bg-ink/97 px-6 pt-24 pb-10 backdrop-blur-2xl md:hidden"
          >
            <div className="flex flex-col gap-1">
              {[...LINKS, { id: "#inquire", label: "Inquiry" }].map((l, i) => (
                <motion.button
                  key={l.id}
                  initial={{ opacity: 0, y: 26 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * i + 0.1, duration: 0.7, ease: EASE }}
                  onClick={() => go(l.id)}
                  className="display border-b border-line py-4 text-left text-5xl text-bone"
                >
                  {l.label}
                </motion.button>
              ))}
            </div>
            <div className="flex items-end justify-between">
              <span className="label text-muted">Mumbai · Worldwide</span>
              <a href="admin.html" className="label text-amber">
                Admin panel →
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
