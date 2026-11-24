import { useEffect, useState } from "react";
import { MotionConfig } from "framer-motion";
import { initSmoothScroll } from "@/lib/scroll";
import Nav from "@/components/Nav";
import Hud from "@/components/Hud";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Grade from "@/components/Grade";
import Work from "@/components/Work";
import Studio from "@/components/Studio";
import Services from "@/components/Services";
import Process from "@/components/Process";
import Inquire from "@/components/Inquire";
import Footer from "@/components/Footer";
import AdminApp from "@/admin/AdminApp";

function computeRoute(): "site" | "admin" {
  if (typeof window === "undefined") return "site";
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.replace(/^#\/?/, "").toLowerCase();
  return path.endsWith("admin.html") || hash === "admin" ? "admin" : "site";
}

export default function App() {
  const [route, setRoute] = useState<"site" | "admin">(computeRoute);

  useEffect(() => {
    const on = () => setRoute(computeRoute());
    window.addEventListener("hashchange", on);
    window.addEventListener("popstate", on);
    return () => {
      window.removeEventListener("hashchange", on);
      window.removeEventListener("popstate", on);
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (route === "site") initSmoothScroll();
  }, [route]);

  if (route === "admin") {
    return (
      <MotionConfig reducedMotion="user">
        <AdminApp />
      </MotionConfig>
    );
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative bg-ink">
        <Hud />
        <Nav />
        <main>
          <Hero />
          <Marquee />
          <Grade />
          <Work />
          <Studio />
          <Services />
          <Process />
          <Inquire />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
