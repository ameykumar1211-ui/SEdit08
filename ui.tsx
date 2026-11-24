import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { scrollToTarget } from "@/lib/scroll";

export const EASE = [0.16, 1, 0.3, 1] as const;

/** Hand-drawn SEdit08 mark: a film frame with sprockets and a cut "S". */
export function Mark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true" fill="none">
      <rect
        x="1.6"
        y="1.6"
        width="36.8"
        height="36.8"
        rx="8.5"
        stroke="currentColor"
        strokeWidth="2.2"
      />
      <rect x="5.6" y="7.4" width="5.2" height="3.6" rx="1.1" fill="currentColor" />
      <rect x="5.6" y="29" width="5.2" height="3.6" rx="1.1" fill="currentColor" />
      <rect x="29.2" y="7.4" width="5.2" height="3.6" rx="1.1" fill="currentColor" />
      <rect x="29.2" y="29" width="5.2" height="3.6" rx="1.1" fill="currentColor" />
      <path
        d="M27.4 13.9c-1.7-2.1-4.4-3.2-7.3-3.2-3.8 0-6.4 2-6.4 4.9 0 6.9 14.2 3.5 14.2 10.8 0 3.1-2.9 5.3-7.2 5.3-3.4 0-6.3-1.3-8.1-3.6"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-sans text-[1.05rem] font-semibold tracking-[-0.03em] ${className}`}>
      SEdit<span className="font-mono font-medium text-amber">08</span>
    </span>
  );
}

export function Reveal({
  children,
  delay = 0,
  y = 30,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: "blur(7px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.95, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Section marker: 03 / INQUIRY ——————— */
export function SectionTag({ index, title }: { index: string; title: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="label text-amber">{index}</span>
      <span className="h-px w-8 bg-line" />
      <span className="label text-muted">{title}</span>
    </div>
  );
}

export function BracketButton({
  children,
  href,
  onClick,
  variant = "solid",
  type = "button",
  className = "",
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "solid" | "ghost";
  type?: "button" | "submit";
  className?: string;
}) {
  const base =
    "group relative inline-flex items-center justify-center gap-3 overflow-hidden border px-7 py-4 transition-colors duration-300";
  const skin =
    variant === "solid"
      ? "border-amber text-amber hover:text-ink"
      : "border-bone/25 text-bone hover:border-amber hover:text-amber";
  const sweep = variant === "solid" ? "bg-amber" : "bg-amber/15";

  const inner = (
    <>
      <span
        className={`absolute inset-0 -translate-x-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0 ${sweep}`}
      />
      <span className="label relative z-10">{children}</span>
      <svg
        viewBox="0 0 24 24"
        className="relative z-10 h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        aria-hidden="true"
      >
        <path d="M4 12h15M13 6l6 6-6 6" />
      </svg>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        onClick={(e) => {
          if (href.startsWith("#")) {
            e.preventDefault();
            scrollToTarget(href);
          }
        }}
        className={`${base} ${skin} ${className}`}
      >
        {inner}
      </a>
    );
  }
  return (
    <button type={type} onClick={onClick} className={`${base} ${skin} ${className}`}>
      {inner}
    </button>
  );
}
