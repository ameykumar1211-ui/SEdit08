import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BUDGETS,
  SERVICES,
  buildWhatsAppMessage,
  openWhatsApp,
  useInquiries,
} from "@/lib/store";
import { WHATSAPP_NUMBER } from "@/lib/firebase";
import { EASE, Reveal, SectionTag } from "./ui";

type Form = { name: string; phone: string; service: string; budget: string; message: string };
const EMPTY: Form = { name: "", phone: "", service: SERVICES[0], budget: BUDGETS[1], message: "" };

const fieldBase =
  "w-full border-b border-line bg-transparent px-0 py-3.5 text-bone placeholder:text-muted/60 outline-none transition-colors duration-300 focus:border-amber";

export default function Inquire() {
  const { addInquiry } = useInquiries();
  const [form, setForm] = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [sent, setSent] = useState<{ url: string; opened: boolean; name: string } | null>(null);

  const set = (k: keyof Form, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Partial<Record<keyof Form, string>> = {};
    if (form.name.trim().length < 2) next.name = "Tell us who you are";
    if (!/^[+\d][\d\s-]{7,}$/.test(form.phone.trim()))
      next.phone = "A WhatsApp number we can reach";
    if (form.message.trim().length < 12) next.message = "A few lines about the project";
    setErrors(next);
    if (Object.keys(next).length) return;

    const payload = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      service: form.service,
      budget: form.budget,
      message: form.message.trim(),
    };

    const message = buildWhatsAppMessage(payload);
    const { url, opened } = openWhatsApp(message);
    addInquiry(payload);
    setSent({ url, opened, name: payload.name.split(" ")[0] });
    setForm(EMPTY);
  };

  return (
    <section id="inquire" className="relative overflow-hidden border-b border-line lg:pl-24">
      <div className="pointer-events-none absolute -top-40 -right-40 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(233,161,59,0.16),transparent_65%)] blur-2xl" />

      <div className="relative mx-auto max-w-[1500px] px-5 py-20 md:px-8 md:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          {/* left column */}
          <div>
            <Reveal>
              <SectionTag index="07" title="Inquiry" />
            </Reveal>
            <Reveal delay={0.07}>
              <h2 className="display mt-6 text-[clamp(2.6rem,6vw,5.2rem)]">
                Send the brief.
                <br />
                <span className="italic text-amber">Get the cut.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.13}>
              <p className="mt-6 max-w-md leading-relaxed text-bone/65">
                Fill this in and it goes straight to our WhatsApp as a formatted message —
                plus it is logged in the studio panel so nothing slips. Prefer to talk?
                Tap the number.
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <a
                href={`https://wa.me/91${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-9 block border border-line bg-panel/50 p-6 transition-colors duration-500 hover:border-amber"
              >
                <span className="label text-muted">WhatsApp · direct line</span>
                <p className="mt-2 font-mono text-[clamp(1.7rem,4vw,2.6rem)] tnum leading-none text-bone transition-colors duration-500 group-hover:text-amber">
                  +91 {WHATSAPP_NUMBER}
                </p>
                <span className="mt-4 flex items-center gap-2 text-xs text-bone/50 transition-colors group-hover:text-amber">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#25D366]" />
                  Usually replies within 20 minutes, 10:00–20:00 IST
                </span>
              </a>
            </Reveal>

            <Reveal delay={0.26}>
              <ul className="mt-8 grid gap-3 text-sm text-bone/55">
                {[
                  "Quote within the same day, flat per deliverable",
                  "Two revision passes included as standard",
                  "Footage via Drive, WeTransfer or Frame.io",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-amber" />
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* form */}
          <Reveal delay={0.1} y={44}>
            <div className="relative border border-line bg-panel/60 p-6 backdrop-blur-sm md:p-9">
              <div className="mb-7 flex items-center justify-between border-b border-line pb-4">
                <span className="label text-amber">Project brief</span>
                <span className="label tnum text-muted">FORM · 05 FIELDS</span>
              </div>

              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.div
                    key="sent"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.6, ease: EASE }}
                    className="py-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="relative flex h-3 w-3">
                        <span className="anim-pulsering absolute inline-flex h-full w-full rounded-full bg-[#25D366]" />
                        <span className="relative inline-flex h-3 w-3 rounded-full bg-[#25D366]" />
                      </span>
                      <span className="label text-[#25D366]">
                        {sent.opened ? "Sent to WhatsApp" : "Brief ready"}
                      </span>
                    </div>
                    <h3 className="display mt-5 text-4xl">
                      Thanks{sent.name ? `, ${sent.name}` : ""} — your brief is logged.
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-bone/65">
                      {sent.opened
                        ? "WhatsApp opened in a new tab with your message pre-typed. Hit send there and we'll take it from the studio panel."
                        : "Your browser blocked the WhatsApp pop-up. Use the button below to open the chat — the message is already written."}
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <a
                        href={sent.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="label border border-[#25D366] px-5 py-3.5 text-[#25D366] transition-colors hover:bg-[#25D366] hover:text-ink"
                      >
                        Open WhatsApp again
                      </a>
                      <button
                        onClick={() => setSent(null)}
                        className="label border border-line px-5 py-3.5 text-muted transition-colors hover:border-amber hover:text-amber"
                      >
                        Send another
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={submit}
                    noValidate
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="grid gap-6 sm:grid-cols-2"
                  >
                    <label className="block">
                      <span className="label text-muted">Name *</span>
                      <input
                        value={form.name}
                        onChange={(e) => set("name", e.target.value)}
                        placeholder="Aarav Sharma"
                        className={fieldBase}
                      />
                      {errors.name && <span className="mt-1 block text-xs text-rec">{errors.name}</span>}
                    </label>

                    <label className="block">
                      <span className="label text-muted">WhatsApp no. *</span>
                      <input
                        value={form.phone}
                        onChange={(e) => set("phone", e.target.value)}
                        inputMode="tel"
                        placeholder="+91 98765 43210"
                        className={fieldBase}
                      />
                      {errors.phone && (
                        <span className="mt-1 block text-xs text-rec">{errors.phone}</span>
                      )}
                    </label>

                    <label className="block">
                      <span className="label text-muted">Service</span>
                      <span className="relative block">
                        <select
                          value={form.service}
                          onChange={(e) => set("service", e.target.value)}
                          className={`${fieldBase} appearance-none pr-7`}
                        >
                          {SERVICES.map((s) => (
                            <option key={s} value={s} className="bg-panel text-bone">
                              {s}
                            </option>
                          ))}
                        </select>
                        <span className="pointer-events-none absolute right-1 bottom-4 text-xs text-amber">
                          ▾
                        </span>
                      </span>
                    </label>

                    <label className="block">
                      <span className="label text-muted">Budget</span>
                      <span className="relative block">
                        <select
                          value={form.budget}
                          onChange={(e) => set("budget", e.target.value)}
                          className={`${fieldBase} appearance-none pr-7`}
                        >
                          {BUDGETS.map((b) => (
                            <option key={b} value={b} className="bg-panel text-bone">
                              {b}
                            </option>
                          ))}
                        </select>
                        <span className="pointer-events-none absolute right-1 bottom-4 text-xs text-amber">
                          ▾
                        </span>
                      </span>
                    </label>

                    <label className="block sm:col-span-2">
                      <span className="label text-muted">Description *</span>
                      <textarea
                        value={form.message}
                        onChange={(e) => set("message", e.target.value)}
                        rows={4}
                        placeholder="What are we cutting? Footage length, deadline, references, deliverable formats…"
                        className={`${fieldBase} resize-none`}
                      />
                      <span className="mt-1 flex items-baseline justify-between">
                        {errors.message ? (
                          <span className="text-xs text-rec">{errors.message}</span>
                        ) : (
                          <span className="text-xs text-muted/70">
                            This becomes the pre-typed WhatsApp message
                          </span>
                        )}
                        <span className="font-mono text-[10px] tnum text-muted/70">
                          {String(form.message.length).padStart(3, "0")}
                        </span>
                      </span>
                    </label>

                    <button
                      type="submit"
                      className="label group relative mt-1 overflow-hidden border border-amber py-4 text-amber transition-colors duration-300 hover:text-ink sm:col-span-2"
                    >
                      <span className="absolute inset-0 -translate-x-full bg-amber transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0" />
                      <span className="relative z-10">Send to WhatsApp →</span>
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
