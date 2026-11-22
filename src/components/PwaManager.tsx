"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "fitly:install-dismissed-at";
const DISMISS_DAYS = 14;

const safeGet = (k: string) => {
  try {
    return localStorage.getItem(k);
  } catch {
    return null;
  }
};
const safeSet = (k: string, v: string) => {
  try {
    localStorage.setItem(k, v);
  } catch {
    /* storage blocked */
  }
};

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function isIosSafari() {
  const ua = navigator.userAgent;
  const ios = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  return ios && /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua);
}

function recentlyDismissed() {
  const at = Number(safeGet(DISMISS_KEY));
  return at > 0 && Date.now() - at < DISMISS_DAYS * 86_400_000;
}

/** Registers the service worker and shows install, update and offline banners. */
export default function PwaManager() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIosHint, setShowIosHint] = useState(false);
  const [waiting, setWaiting] = useState<ServiceWorker | null>(null);
  const [offline, setOffline] = useState(false);

  // Service worker registration and update detection.
  useEffect(() => {
    if (!("serviceWorker" in navigator) || process.env.NODE_ENV !== "production") return;
    let reloading = false;
    const onControllerChange = () => {
      if (reloading) return;
      reloading = true;
      window.location.reload();
    };

    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then((reg) => {
        // A new version is already waiting (e.g. downloaded on a previous visit).
        if (reg.waiting && navigator.serviceWorker.controller) setWaiting(reg.waiting);
        reg.addEventListener("updatefound", () => {
          const sw = reg.installing;
          sw?.addEventListener("statechange", () => {
            if (sw.state === "installed" && navigator.serviceWorker.controller) setWaiting(sw);
          });
        });
        // Check for a new deploy when the app comes back to the foreground.
        const onVisible = () => document.visibilityState === "visible" && reg.update().catch(() => {});
        document.addEventListener("visibilitychange", onVisible);
      })
      .catch(() => {});

    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);
    return () => navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
  }, []);

  // Install prompt (Chrome, Edge, Samsung Internet) and iOS Safari instructions.
  useEffect(() => {
    if (isStandalone()) return;
    const onPrompt = (e: Event) => {
      e.preventDefault();
      if (!recentlyDismissed()) setInstallEvent(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => setInstallEvent(null);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    if (isIosSafari() && !recentlyDismissed()) setShowIosHint(true);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  // Online/offline indicator.
  useEffect(() => {
    const update = () => setOffline(!navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  const dismissInstall = () => {
    safeSet(DISMISS_KEY, String(Date.now()));
    setInstallEvent(null);
    setShowIosHint(false);
  };

  const install = async () => {
    if (!installEvent) return;
    await installEvent.prompt();
    const { outcome } = await installEvent.userChoice;
    if (outcome === "dismissed") safeSet(DISMISS_KEY, String(Date.now()));
    setInstallEvent(null);
  };

  return (
    <div className="pwa-stack" aria-live="polite">
      {offline && (
        <div className="pwa-banner pwa-offline" role="status">
          <span>You&apos;re offline. Saved pages and your tracker still work.</span>
        </div>
      )}
      {waiting && (
        <div className="pwa-banner" role="status">
          <span>A new version of Fitly is ready.</span>
          <button className="btn" onClick={() => waiting.postMessage({ type: "SKIP_WAITING" })}>
            Update
          </button>
        </div>
      )}
      {!waiting && installEvent && (
        <div className="pwa-banner">
          <img src="/icons/icon-192.png" alt="" width={36} height={36} />
          <span>
            <b>Install Fitly</b>
            <br />
            <span className="small muted">Works offline, opens from your home screen.</span>
          </span>
          <button className="btn" onClick={install}>
            Install
          </button>
          <button className="pwa-close" onClick={dismissInstall} aria-label="Not now">
            ×
          </button>
        </div>
      )}
      {!waiting && !installEvent && showIosHint && (
        <div className="pwa-banner">
          <img src="/icons/icon-192.png" alt="" width={36} height={36} />
          <span className="small">
            <b>Install Fitly:</b> tap the Share button{" "}
            <svg aria-hidden width="14" height="16" viewBox="0 0 14 18" style={{ verticalAlign: "-2px" }}>
              <path d="M7 1v11M3 5l4-4 4 4M2 8H1v9h12V8h-1" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>{" "}
            then <b>Add to Home Screen</b>.
          </span>
          <button className="pwa-close" onClick={dismissInstall} aria-label="Close">
            ×
          </button>
        </div>
      )}
    </div>
  );
}
