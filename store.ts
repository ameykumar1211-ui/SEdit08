import { useCallback, useEffect, useRef, useState } from "react";
import { collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore";
import { db, track, WHATSAPP_LINK_NUMBER, WHATSAPP_NUMBER } from "./firebase";

/* ------------------------------------------------------------------ types */

export type PortfolioItem = {
  id: string;
  videoId: string;
  url: string;
  title: string;
  category: string;
  cover?: string;
  order: number;
  createdAt: number;
  updatedAt: number;
};

export type Inquiry = {
  id: string;
  name: string;
  phone: string;
  service: string;
  budget: string;
  message: string;
  status: "new" | "read";
  createdAt: number;
};

export const SERVICES = [
  "Short-form edits (Reels / Shorts)",
  "YouTube long-form editing",
  "Brand films & commercials",
  "Colour grading",
  "Motion graphics & titles",
  "Wedding & event films",
];

export const BUDGETS = [
  "Under ₹10,000",
  "₹10,000 – ₹25,000",
  "₹25,000 – ₹75,000",
  "₹75,000+",
  "Monthly retainer",
  "Not sure yet",
];

/* --------------------------------------------------------------- constants */

const P_KEY = "sedit08:portfolio";
const I_KEY = "sedit08:inquiries";
const SYNC = "sedit08:sync";

const COVERS = ["images/short-1.jpg", "images/short-2.jpg", "images/short-3.jpg"];

const SEED: PortfolioItem[] = [
  {
    id: "p1",
    videoId: "LXb3EKWsInQ",
    url: "https://www.youtube.com/watch?v=LXb3EKWsInQ",
    title: "Glow Ritual",
    category: "Beauty · Short-form",
    cover: COVERS[0],
    order: 0,
    createdAt: 1,
    updatedAt: 1,
  },
  {
    id: "p2",
    videoId: "9bZkp7q19f0",
    url: "https://www.youtube.com/watch?v=9bZkp7q19f0",
    title: "Saanjh — Teaser",
    category: "Wedding film",
    cover: COVERS[1],
    order: 1,
    createdAt: 1,
    updatedAt: 1,
  },
  {
    id: "p3",
    videoId: "kJQP7kiw5Fk",
    url: "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
    title: "Tandoor Nights",
    category: "F&B · Reel",
    cover: COVERS[2],
    order: 2,
    createdAt: 1,
    updatedAt: 1,
  },
  {
    id: "p4",
    videoId: "RgKAFK5djSk",
    url: "https://www.youtube.com/watch?v=RgKAFK5djSk",
    title: "Founder Story",
    category: "YouTube · Long-form",
    cover: COVERS[0],
    order: 3,
    createdAt: 1,
    updatedAt: 1,
  },
  {
    id: "p5",
    videoId: "aqz-KE-bpKQ",
    url: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    title: "Festive Sale 15s",
    category: "Performance ad",
    cover: COVERS[1],
    order: 4,
    createdAt: 1,
    updatedAt: 1,
  },
  {
    id: "p6",
    videoId: "ScMzIvxBSi4",
    url: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
    title: "Midnight Drive",
    category: "Colour grade only",
    cover: COVERS[2],
    order: 5,
    createdAt: 1,
    updatedAt: 1,
  },
];

/* --------------------------------------------------------------- storage io */

function read<T>(key: string, fallback: () => T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      const seed = fallback();
      localStorage.setItem(key, JSON.stringify(seed));
      return seed;
    }
    const parsed = JSON.parse(raw) as T;
    if (Array.isArray(parsed) && parsed.length === 0) return parsed;
    return parsed ?? fallback();
  } catch {
    return fallback();
  }
}

function write<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent(SYNC));
  } catch {
    /* storage full / blocked */
  }
}

function useShared<T>(key: string, fallback: () => T): [T, (next: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => read(key, fallback));
  const ref = useRef(value);
  ref.current = value;

  useEffect(() => {
    const sync = () => setValue(read(key, fallback));
    window.addEventListener("storage", sync);
    window.addEventListener(SYNC, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(SYNC, sync);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // NOTE: the resolver + side effects run *outside* React's updater so that
  // broadcasting the SYNC event never happens while a component is rendering.
  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      const resolved =
        typeof next === "function" ? (next as (p: T) => T)(ref.current) : next;
      ref.current = resolved;
      setValue(resolved);
      write(key, resolved);
    },
    [key],
  );

  return [value, update];
}

/* --------------------------------------------------- best effort firestore */

async function pullRemote() {
  try {
    const [pSnap, iSnap] = await Promise.all([
      getDocs(collection(db, "portfolio")),
      getDocs(collection(db, "inquiries")),
    ]);

    if (!pSnap.empty) {
      const remote = pSnap.docs.map((d) => d.data() as PortfolioItem);
      const local = read<PortfolioItem[]>(P_KEY, () => SEED);
      const merged = [...local];
      remote.forEach((r) => {
        if (!r?.id) return;
        const idx = merged.findIndex((m) => m.id === r.id);
        if (idx < 0) merged.push(r);
        else if ((r.updatedAt || 0) > (merged[idx].updatedAt || 0)) merged[idx] = r;
      });
      merged.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      write(P_KEY, merged);
    }

    if (!iSnap.empty) {
      const remote = iSnap.docs.map((d) => d.data() as Inquiry);
      const local = read<Inquiry[]>(I_KEY, () => []);
      const merged = [...local];
      remote.forEach((r) => {
        if (!r?.id) return;
        if (!merged.some((m) => m.id === r.id)) merged.push(r);
      });
      merged.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      write(I_KEY, merged);
    }
  } catch {
    /* firestore rules / offline — local storage stays authoritative */
  }
}

function pushRemote(collectionName: "portfolio" | "inquiries", item: { id: string }) {
  try {
    void setDoc(doc(db, collectionName, item.id), item as never).catch(() => {});
  } catch {
    /* noop */
  }
}

async function removeRemote(collectionName: "portfolio" | "inquiries", id: string) {
  try {
    void deleteDoc(doc(db, collectionName, id)).catch(() => {});
  } catch {
    /* noop */
  }
}

/* --------------------------------------------------------------------- hooks */

export function usePortfolio() {
  const [items, setItems] = useShared<PortfolioItem[]>(P_KEY, () => SEED);

  useEffect(() => {
    void pullRemote();
  }, []);

  const addItem = useCallback(
    (data: { url: string; title: string; category: string }) => {
      const videoId = parseVideoId(data.url);
      if (!videoId) return null;
      const now = Date.now();
      const item: PortfolioItem = {
        id: `p_${now.toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
        videoId,
        url: `https://www.youtube.com/shorts/${videoId}`,
        title: data.title.trim() || "Untitled cut",
        category: data.category.trim() || "Short-form",
        cover: COVERS[Math.floor(Math.random() * COVERS.length)],
        order: 0,
        createdAt: now,
        updatedAt: now,
      };
      pushRemote("portfolio", item);
      setItems((prev) => [item, ...prev.map((p) => ({ ...p, order: (p.order ?? 0) + 1 }))]);
      track("add_to_portfolio", { item_title: item.title });
      return item;
    },
    [setItems],
  );

  const removeItem = useCallback(
    (id: string) => {
      setItems((prev) => prev.filter((p) => p.id !== id));
      void removeRemote("portfolio", id);
    },
    [setItems],
  );

  const moveItem = useCallback(
    (id: string, dir: -1 | 1) => {
      setItems((prev) => {
        const list = [...prev].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        const i = list.findIndex((p) => p.id === id);
        const j = i + dir;
        if (i < 0 || j < 0 || j >= list.length) return prev;
        [list[i], list[j]] = [list[j], list[i]];
        const next = list.map((p, idx) => ({
          ...p,
          order: idx,
          updatedAt: idx === i || idx === j ? Date.now() : p.updatedAt,
        }));
        next.forEach((p) => pushRemote("portfolio", p));
        return next;
      });
    },
    [setItems],
  );

  const sorted = [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  return { items: sorted, addItem, removeItem, moveItem };
}

export function useInquiries() {
  const [items, setItems] = useShared<Inquiry[]>(I_KEY, () => []);

  const addInquiry = useCallback(
    (data: Omit<Inquiry, "id" | "status" | "createdAt">) => {
      const inquiry: Inquiry = {
        ...data,
        id: `i_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
        status: "new",
        createdAt: Date.now(),
      };
      pushRemote("inquiries", inquiry);
      setItems((prev) => [inquiry, ...prev]);
      track("generate_lead", { service: inquiry.service });
      return inquiry;
    },
    [setItems],
  );

  const setStatus = useCallback(
    (id: string, status: Inquiry["status"]) => {
      setItems((prev) =>
        prev.map((i) => {
          if (i.id !== id) return i;
          const next = { ...i, status };
          pushRemote("inquiries", next);
          return next;
        }),
      );
    },
    [setItems],
  );

  const removeInquiry = useCallback(
    (id: string) => {
      setItems((prev) => prev.filter((i) => i.id !== id));
      void removeRemote("inquiries", id);
    },
    [setItems],
  );

  return { items, addInquiry, setStatus, removeInquiry };
}

/* --------------------------------------------------------------- utilities */

export function parseVideoId(input: string): string | null {
  const raw = (input || "").trim();
  if (!raw) return null;
  if (/^[a-zA-Z0-9_-]{11}$/.test(raw)) return raw;

  const patterns = [
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/i,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/i,
    /youtube\.com\/watch\?[^#]*v=([a-zA-Z0-9_-]{11})/i,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/i,
    /youtube\.com\/live\/([a-zA-Z0-9_-]{11})/i,
  ];
  for (const p of patterns) {
    const m = raw.match(p);
    if (m) return m[1];
  }
  const fallback = raw.match(/([a-zA-Z0-9_-]{11})(?:[?&#/]|$)/);
  return fallback ? fallback[1] : null;
}

export function thumbUrl(videoId: string) {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

export function buildWhatsAppMessage(d: {
  name: string;
  phone: string;
  service: string;
  budget: string;
  message: string;
}) {
  return [
    "Hi SEdit08! 👋 — New project inquiry from your website.",
    "",
    `👤 Name: ${d.name}`,
    `📞 WhatsApp / Phone: ${d.phone}`,
    `🎬 Service: ${d.service}`,
    `💸 Budget: ${d.budget}`,
    "",
    "📝 Brief:",
    d.message,
    "",
    "Please get back to me with availability and a quote. 🙏",
  ].join("\n");
}

export function waLink(message: string) {
  return `https://wa.me/${WHATSAPP_LINK_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function openWhatsApp(message: string) {
  const url = waLink(message);
  let opened = false;
  try {
    opened = !!window.open(url, "_blank");
  } catch {
    opened = false;
  }
  return { url, opened };
}

export function formatTime(ms: number) {
  const d = new Date(ms);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${String(d.getFullYear()).slice(2)} · ${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
}

export const ADMIN_NUMBER = WHATSAPP_NUMBER;
