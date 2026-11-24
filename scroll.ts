import Lenis from "lenis";

let lenis: Lenis | null = null;
let started = false;

export function initSmoothScroll() {
  if (started) return lenis;
  started = true;

  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduce) return null;

  try {
    lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.7,
      gestureOrientation: "vertical",
    });

    const raf = (time: number) => {
      lenis?.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  } catch {
    lenis = null;
  }

  return lenis;
}

export function getLenis() {
  return lenis;
}

export function scrollToTarget(target: string | HTMLElement, offset = -72) {
  const el =
    typeof target === "string" ? document.querySelector(target) : target;
  if (!el) return;

  if (lenis) {
    lenis.scrollTo(el as HTMLElement, { offset, duration: 1.4 });
  } else {
    const top =
      (el as HTMLElement).getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  }
}

export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { duration: 1.2 });
  else window.scrollTo({ top: 0, behavior: "smooth" });
}
