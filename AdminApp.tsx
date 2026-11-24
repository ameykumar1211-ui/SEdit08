import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  formatTime,
  parseVideoId,
  thumbUrl,
  useInquiries,
  usePortfolio,
  waLink,
  type Inquiry,
} from "@/lib/store";
import { WHATSAPP_NUMBER, firebaseConfig } from "@/lib/firebase";
import { Mark, Wordmark } from "@/components/ui";

const PASSCODE = "sedit08";
const AUTH_KEY = "sedit08:auth";

const inputCls =
  "w-full border-b border-line bg-transparent py-3 text-bone placeholder:text-muted/60 outline-none transition-colors focus:border-amber";

/* --------------------------------------------------------------------- gate */

function Gate({ onPass }: { onPass: () => void }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim().toLowerCase() === PASSCODE) onPass();
    else {
      setError(true);
      setTimeout(() => setError(false), 600);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink px-5">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(233,161,59,0.14),transparent_60%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(242,239,233,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(242,239,233,0.05) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      <motion.form
        onSubmit={submit}
        animate={error ? { x: [0, -10, 9, -6, 0] } : { x: 0 }}
        transition={{ duration: 0.45 }}
        className="relative w-full max-w-md border border-line bg-panel/70 p-8 backdrop-blur-md"
      >
        <div className="flex items-center gap-3 text-amber">
          <Mark className="h-9 w-9" />
          <Wordmark />
        </div>
        <p className="label mt-7 text-muted">Control room access</p>
        <h1 className="display mt-3 text-4xl">
          SEdit08 <span className="italic text-amber">admin</span>
        </h1>

        <label className="mt-8 block">
          <span className="label text-muted">Passcode</span>
          <input
            autoFocus
            type="password"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="••••••"
            className={`${inputCls} font-mono tracking-[0.3em]`}
          />
        </label>

        {error && <p className="mt-2 text-xs text-rec">Incorrect passcode — try again.</p>}

        <button
          type="submit"
          className="label group relative mt-7 w-full overflow-hidden border border-amber py-4 text-amber transition-colors hover:text-ink"
        >
          <span className="absolute inset-0 -translate-x-full bg-amber transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0" />
          <span className="relative z-10">Enter panel →</span>
        </button>

        <p className="mt-5 text-xs leading-relaxed text-muted">
          Demo passcode: <span className="font-mono text-amber">sedit08</span>
        </p>
        <a href="index.html" className="label mt-6 inline-block text-muted hover:text-amber">
          ← Back to website
        </a>
      </motion.form>
    </div>
  );
}

/* ---------------------------------------------------------------- inquiries */

function InquiryCard({
  item,
  onStatus,
  onDelete,
}: {
  item: Inquiry;
  onStatus: (id: string, s: Inquiry["status"]) => void;
  onDelete: (id: string) => void;
}) {
  const reply = waLink(
    `Hi ${item.name.split(" ")[0]}, thanks for reaching out to SEdit08 about "${item.service}". Here's what I need to quote it:`,
  );
  return (
    <article
      className={`relative border bg-panel/60 p-5 transition-colors ${
        item.status === "new" ? "border-amber/45" : "border-line"
      }`}
    >
      <span
        className={`absolute top-0 left-0 h-full w-[3px] ${item.status === "new" ? "bg-amber" : "bg-line"}`}
      />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="display text-2xl leading-none">{item.name}</p>
          <p className="mt-2 font-mono text-sm tnum text-amber">{item.phone}</p>
        </div>
        <div className="text-right">
          <span
            className={`label inline-block border px-2 py-1 ${
              item.status === "new" ? "border-amber text-amber" : "border-line text-muted"
            }`}
          >
            {item.status}
          </span>
          <p className="label mt-2 text-muted">{formatTime(item.createdAt)}</p>
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 border-y border-line py-3">
        <div>
          <dt className="label text-muted">Service</dt>
          <dd className="mt-1 text-sm text-bone/85">{item.service}</dd>
        </div>
        <div>
          <dt className="label text-muted">Budget</dt>
          <dd className="mt-1 text-sm text-bone/85">{item.budget}</dd>
        </div>
      </dl>

      <p className="mt-3 text-sm leading-relaxed whitespace-pre-line text-bone/70">
        {item.message}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <a
          href={reply}
          target="_blank"
          rel="noopener noreferrer"
          className="label border border-[#25D366] px-3 py-2 text-[#25D366] transition-colors hover:bg-[#25D366] hover:text-ink"
        >
          Reply on WhatsApp
        </a>
        <button
          onClick={() => onStatus(item.id, item.status === "new" ? "read" : "new")}
          className="label border border-line px-3 py-2 text-muted transition-colors hover:border-amber hover:text-amber"
        >
          {item.status === "new" ? "Mark read" : "Mark new"}
        </button>
        <button
          onClick={() => onDelete(item.id)}
          className="label border border-line px-3 py-2 text-muted transition-colors hover:border-rec hover:text-rec"
        >
          Delete
        </button>
      </div>
    </article>
  );
}

function Inquiries() {
  const { items, setStatus, removeInquiry } = useInquiries();
  const [filter, setFilter] = useState<"all" | "new" | "read">("all");

  const list = useMemo(
    () => (filter === "all" ? items : items.filter((i) => i.status === filter)),
    [items, filter],
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2">
          {(["all", "new", "read"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`label border px-3.5 py-2 transition-colors ${
                filter === f ? "border-amber bg-amber/10 text-amber" : "border-line text-muted hover:text-bone"
              }`}
            >
              {f} ({f === "all" ? items.length : items.filter((i) => i.status === f).length})
            </button>
          ))}
        </div>
        <span className="label text-muted">Live · synced to Firestore + this browser</span>
      </div>

      {list.length === 0 ? (
        <div className="mt-8 border border-dashed border-line p-12 text-center">
          <p className="display text-3xl text-muted">No briefs in this view.</p>
          <p className="mt-3 text-sm text-bone/50">
            Inquiries sent from the website appear here the moment they land.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          {list.map((item) => (
            <InquiryCard key={item.id} item={item} onStatus={setStatus} onDelete={removeInquiry} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- portfolio */

function Portfolio() {
  const { items, addItem, removeItem, moveItem } = usePortfolio();
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Short-form");
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const previewId = parseVideoId(url);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewId) {
      setError("Paste a valid YouTube link or Shorts URL.");
      return;
    }
    const item = addItem({ url, title, category });
    if (!item) {
      setError("Could not read that link.");
      return;
    }
    setUrl("");
    setTitle("");
    setError("");
    setOk(`“${item.title}” published to the portfolio.`);
    setTimeout(() => setOk(""), 4000);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
      {/* add form */}
      <form onSubmit={submit} className="border border-line bg-panel/60 p-6">
        <p className="label text-amber">Add a YouTube Short</p>
        <p className="mt-2 text-sm text-bone/60">
          It is saved to Firestore <span className="font-mono text-bone/80">network-high</span> and
          mirrored locally — then shows up straight away in the portfolio section of the website.
        </p>

        <label className="mt-6 block">
          <span className="label text-muted">YouTube / Shorts link *</span>
          <input
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setError("");
            }}
            placeholder="https://www.youtube.com/shorts/AbCdEfGhIjK"
            className={`${inputCls} font-mono text-sm`}
          />
        </label>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="label text-muted">Title</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Festive Sale — 15s"
              className={inputCls}
            />
          </label>
          <label className="block">
            <span className="label text-muted">Category</span>
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Performance ad"
              className={inputCls}
            />
          </label>
        </div>

        {error && <p className="mt-4 text-xs text-rec">{error}</p>}
        {ok && <p className="mt-4 text-xs text-[#25D366]">{ok}</p>}

        <div className="mt-7 flex items-center gap-5">
          <button
            type="submit"
            className="label group relative overflow-hidden border border-amber px-6 py-3.5 text-amber transition-colors hover:text-ink"
          >
            <span className="absolute inset-0 -translate-x-full bg-amber transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0" />
            <span className="relative z-10">Publish →</span>
          </button>
          <span className="label text-muted">
            ID: <span className="text-bone/80">{previewId || "—"}</span>
          </span>
        </div>

        {/* live preview */}
        <div className="mt-7 border-t border-line pt-6">
          <p className="label text-muted">Preview</p>
          <div className="mt-3 flex gap-4">
            <div className="relative h-[132px] w-[74px] shrink-0 overflow-hidden border border-line bg-panel2">
              {previewId ? (
                <img
                  src={thumbUrl(previewId)}
                  alt=""
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "images/short-1.jpg";
                  }}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-[10px] text-muted">
                  no id
                </div>
              )}
            </div>
            <div>
              <p className="display text-2xl">{title || "Untitled cut"}</p>
              <p className="label mt-2 text-amber">{category}</p>
              <p className="mt-3 font-mono text-[11px] break-all text-muted">
                {previewId ? `youtube.com/shorts/${previewId}` : "paste a link to preview"}
              </p>
            </div>
          </div>
        </div>
      </form>

      {/* list */}
      <div>
        <div className="flex items-center justify-between">
          <p className="label text-amber">Published · {items.length}</p>
          <p className="label text-muted">Order = display order</p>
        </div>

        <div className="mt-4 space-y-3">
          {items.length === 0 && (
            <div className="border border-dashed border-line p-10 text-center">
              <p className="display text-2xl text-muted">Nothing published yet.</p>
              <p className="mt-2 text-sm text-bone/50">Add the first Short on the left.</p>
            </div>
          )}
          {items.map((it, i) => (
            <div
              key={it.id}
              className="flex items-center gap-4 border border-line bg-panel/50 p-3 transition-colors hover:border-amber/40"
            >
              <span className="label w-6 shrink-0 text-muted">{String(i + 1).padStart(2, "0")}</span>
              <div className="relative h-16 w-11 shrink-0 overflow-hidden bg-panel2">
                <img
                  src={thumbUrl(it.videoId)}
                  alt=""
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      it.cover || "images/short-1.jpg";
                  }}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-bone">{it.title}</p>
                <p className="label mt-1 truncate text-amber/85">{it.category}</p>
                <p className="mt-1 font-mono text-[10px] text-muted">{it.videoId}</p>
              </div>
              <div className="flex shrink-0 flex-col gap-1">
                <button
                  onClick={() => moveItem(it.id, -1)}
                  aria-label="Move up"
                  className="label border border-line px-2 py-1 text-muted hover:border-amber hover:text-amber"
                >
                  ↑
                </button>
                <button
                  onClick={() => moveItem(it.id, 1)}
                  aria-label="Move down"
                  className="label border border-line px-2 py-1 text-muted hover:border-amber hover:text-amber"
                >
                  ↓
                </button>
              </div>
              <a
                href={it.url}
                target="_blank"
                rel="noopener noreferrer"
                className="label shrink-0 border border-line px-2.5 py-2 text-muted hover:border-amber hover:text-amber"
              >
                ↗
              </a>
              <button
                onClick={() => removeItem(it.id)}
                className="label shrink-0 border border-line px-2.5 py-2 text-muted hover:border-rec hover:text-rec"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------- panel */

export default function AdminApp() {
  const [authed, setAuthed] = useState(
    () => typeof window !== "undefined" && sessionStorage.getItem(AUTH_KEY) === "1",
  );
  const [tab, setTab] = useState<"inquiries" | "portfolio">("inquiries");
  const { items: inquiries } = useInquiries();
  const { items: portfolio } = usePortfolio();

  if (!authed)
    return (
      <Gate
        onPass={() => {
          sessionStorage.setItem(AUTH_KEY, "1");
          setAuthed(true);
        }}
      />
    );

  const stats = [
    ["Awaiting reply", String(inquiries.filter((i) => i.status === "new").length)],
    ["Briefs total", String(inquiries.length)],
    ["Published cuts", String(portfolio.length)],
    ["WhatsApp", `+91 ${WHATSAPP_NUMBER}`],
  ];

  return (
    <div className="min-h-screen bg-ink">
      <div
        className="pointer-events-none fixed inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(242,239,233,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(242,239,233,0.04) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      <header className="sticky top-0 z-40 border-b border-line bg-ink/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-5 py-4 md:px-8">
          <div className="flex items-center gap-3">
            <span className="text-amber">
              <Mark className="h-8 w-8" />
            </span>
            <div>
              <Wordmark />
              <p className="label text-muted">Control room</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 sm:flex">
              <span className="anim-rec h-1.5 w-1.5 rounded-full bg-[#25D366]" />
              <span className="label text-muted">Firestore · {firebaseConfig.projectId}</span>
            </span>
            <a
              href="index.html"
              className="label border border-line px-3.5 py-2.5 text-muted transition-colors hover:border-amber hover:text-amber"
            >
              View site
            </a>
            <button
              onClick={() => {
                sessionStorage.removeItem(AUTH_KEY);
                setAuthed(false);
              }}
              className="label border border-line px-3.5 py-2.5 text-muted transition-colors hover:border-rec hover:text-rec"
            >
              Lock
            </button>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-[1400px] px-5 py-8 md:px-8 md:py-10">
        <h1 className="display text-[clamp(2.4rem,6vw,4.5rem)]">
          The desk, <span className="italic text-amber">unlocked.</span>
        </h1>

        <div className="mt-7 grid grid-cols-2 gap-px border border-line bg-line md:grid-cols-4">
          {stats.map(([k, v]) => (
            <div key={k} className="bg-ink p-4">
              <p className="label text-muted">{k}</p>
              <p className="mt-2 font-mono text-xl tnum text-amber">{v}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex gap-2 border-b border-line">
          {(
            [
              ["inquiries", `Inquiries (${inquiries.length})`],
              ["portfolio", `Portfolio (${portfolio.length})`],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`label relative -mb-px border-b-2 px-4 py-3 transition-colors ${
                tab === id
                  ? "border-amber text-amber"
                  : "border-transparent text-muted hover:text-bone"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-7 pb-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              {tab === "inquiries" ? <Inquiries /> : <Portfolio />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
