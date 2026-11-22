"use client";
// Shared install state, so the banner and the /install page use the same captured prompt.

import { useSyncExternalStore } from "react";

export type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export type InstallStatus = "idle" | "available" | "prompting" | "installing" | "installed" | "failed";

type State = { status: InstallStatus; event: BeforeInstallPromptEvent | null; error?: string };

let state: State = { status: "idle", event: null };
const listeners = new Set<() => void>();
const set = (next: Partial<State>) => {
  state = { ...state, ...next };
  listeners.forEach((l) => l());
};

let started = false;
/** Call once on the client. Captures the browser's install prompt and the "installed" signal. */
export function startInstallListener() {
  if (started || typeof window === "undefined") return;
  started = true;
  if (isStandalone()) set({ status: "installed" });
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    set({ status: "available", event: e as BeforeInstallPromptEvent });
  });
  window.addEventListener("appinstalled", () => set({ status: "installed", event: null }));
}

/** Opens the browser's install dialog. Must be called from a tap/click. */
export async function promptInstall(): Promise<"accepted" | "dismissed" | "unavailable"> {
  const e = state.event;
  if (!e) return "unavailable";
  set({ status: "prompting" });
  try {
    await e.prompt();
    const { outcome } = await e.userChoice;
    // The event can only be used once; the browser fires a new one if the user can try again.
    set({ status: outcome === "accepted" ? "installing" : "idle", event: null });
    if (outcome === "accepted") {
      // Android builds the app in the background. If "appinstalled" never arrives, the
      // install was most likely blocked by the phone (e.g. the home screen shortcut permission).
      window.setTimeout(() => {
        if (state.status === "installing") set({ status: "failed", error: "timeout" });
      }, 45_000);
    }
    return outcome;
  } catch (err) {
    set({ status: "failed", event: null, error: err instanceof Error ? err.message : String(err) });
    return "unavailable";
  }
}

export const resetInstallStatus = () => set({ status: state.event ? "available" : "idle", error: undefined });

export function useInstallState(): State {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => state,
    () => state,
  );
}

// ---------- Environment detection ----------

export function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export type Platform =
  | "in-app"
  | "ios-safari"
  | "ios-other"
  | "android-chrome"
  | "android-samsung"
  | "android-other"
  | "desktop";

/** In-app browsers (WhatsApp, Instagram, Facebook, etc.) can't install web apps. */
export function detectPlatform(ua = navigator.userAgent): Platform {
  const iPadDesktopMode = typeof navigator !== "undefined" && navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  const ios = /iPad|iPhone|iPod/.test(ua) || (iPadDesktopMode && /Macintosh/.test(ua));
  const android = /Android/.test(ua);
  if (/FBAN|FBAV|FB_IAB|Instagram|WhatsApp|Line\/|Snapchat|LinkedInApp|Twitter|GSA\/|\bwv\b/.test(ua)) return "in-app";
  if (ios) return /CriOS|FxiOS|EdgiOS|OPiOS/.test(ua) ? "ios-other" : "ios-safari";
  if (android) {
    if (/SamsungBrowser/.test(ua)) return "android-samsung";
    if (/Chrome\//.test(ua) && !/EdgA|OPR|MiuiBrowser|HeyTapBrowser|VivoBrowser|UCBrowser|YaBrowser|Firefox/.test(ua)) return "android-chrome";
    return "android-other";
  }
  return "desktop";
}

/** Phone brands whose Android skins block Chrome's home screen icons by default. */
export function isRestrictiveAndroidSkin(ua = navigator.userAgent) {
  return /Xiaomi|Redmi|POCO|\bMi\b|MIUI|HyperOS|OPPO|CPH\d|Realme|RMX\d|vivo|\bV\d{4}|OnePlus|Infinix|TECNO|itel/i.test(ua);
}

/** Opens the current page in Chrome from an Android in-app browser. */
export function chromeIntentUrl(href = window.location.href) {
  const u = new URL(href);
  return `intent://${u.host}${u.pathname}${u.search}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(href)};end`;
}
