import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported, logEvent } from "firebase/analytics";

export const firebaseConfig = {
  apiKey: "AIzaSyA4xff2ih3WIwu--vVwgiY9uFpWS7RbN34",
  authDomain: "network-high.firebaseapp.com",
  projectId: "network-high",
  storageBucket: "network-high.firebasestorage.app",
  messagingSenderId: "373475652710",
  appId: "1:373475652710:web:221457575c1e6847d569a7",
  measurementId: "G-G7T0CVV01J",
};

export const WHATSAPP_NUMBER = "7977697173";
export const WHATSAPP_LINK_NUMBER = `91${WHATSAPP_NUMBER}`;

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

let analytics: ReturnType<typeof getAnalytics> | null = null;
isSupported()
  .then((ok) => {
    if (ok) analytics = getAnalytics(app);
  })
  .catch(() => {
    /* analytics unavailable (file://, blocked, etc.) — ignore */
  });

/** Best-effort event logging. Never throws. */
export function track(name: string, params: Record<string, unknown> = {}) {
  try {
    if (analytics) logEvent(analytics, name as never, params as never);
  } catch {
    /* noop */
  }
}
