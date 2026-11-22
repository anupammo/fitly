"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  chromeIntentUrl,
  detectPlatform,
  isStandalone,
  promptInstall,
  resetInstallStatus,
  startInstallListener,
  useInstallState,
  type Platform,
} from "@/lib/pwaInstall";

// While the app isn't installed, the install banner shows on every visit. Closing it (×) hides it
// only for the current tab session, so it's back the next time Fitly is opened.
const DISMISS_KEY = "fitly:install-dismissed";
const LEGACY_DISMISS_KEY = "fitly:install-dismissed-at"; // older versions hid the banner for days
// How long to wait for the browser to offer installation before showing manual steps instead.
const FALLBACK_DELAY_MS = 2500;

const recentlyDismissed = () => {
  try {
    localStorage.removeItem(LEGACY_DISMISS_KEY);
    return sessionStorage.getItem(DISMISS_KEY) === "1";
  } catch {
    return false;
  }
};
const rememberDismissed = () => {
  try {
    sessionStorage.setItem(DISMISS_KEY, "1");
  } catch {
    /* storage blocked */
  }
};

function Icon() {
  return <img src="/icons/icon-192.png" alt="" width={36} height={36} />;
}

/** Registers the service worker and shows install, install-progress, update and offline banners. */
export default function PwaManager() {
  const install = useInstallState();
  const pathname = usePathname();
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [dismissed, setDismissed] = useState(true);
  const [standalone, setStandalone] = useState(true);
  const [waiting, setWaiting] = useState<ServiceWorker | null>(null);
  const [offline, setOffline] = useState(false);
  const [fallbackReady, setFallbackReady] = useState(false);

  useEffect(() => {
    startInstallListener();
    setPlatform(detectPlatform());
    setDismissed(recentlyDismissed());
    setStandalone(isStandalone());
    const t = window.setTimeout(() => setFallbackReady(true), FALLBACK_DELAY_MS);
    return () => window.clearTimeout(t);
  }, []);

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
        if (reg.waiting && navigator.serviceWorker.controller) setWaiting(reg.waiting);
        reg.addEventListener("updatefound", () => {
          const sw = reg.installing;
          sw?.addEventListener("statechange", () => {
            if (sw.state === "installed" && navigator.serviceWorker.controller) setWaiting(sw);
          });
        });
        document.addEventListener("visibilitychange", () => {
          if (document.visibilityState === "visible") reg.update().catch(() => {});
        });
      })
      .catch(() => {});
    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);
    return () => navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
  }, []);

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

  const dismiss = () => {
    rememberDismissed();
    setDismissed(true);
  };

  // Cancelling the browser's own dialog doesn't hide the banner; only the × does.
  const onInstall = () => promptInstall();

  // The /install page has its own full UI; don't stack the banner on top of it.
  const onInstallPage = pathname === "/install";
  const s = install.status;

  let banner: React.ReactNode = null;
  if (waiting) {
    banner = (
      <div className="pwa-banner" role="status">
        <span>A new version of Fitly is ready.</span>
        <button className="btn" onClick={() => waiting.postMessage({ type: "SKIP_WAITING" })}>
          Update
        </button>
      </div>
    );
  } else if (s === "prompting" || s === "installing") {
    banner = (
      <div className="pwa-banner" role="status">
        <Icon />
        <span>
          <b>Installing Fitly…</b>
          <br />
          <span className="small muted">This takes a few seconds. The icon appears in your app list, and on most phones on the home screen.</span>
        </span>
      </div>
    );
  } else if (s === "installed" && !standalone && !onInstallPage) {
    banner = (
      <div className="pwa-banner" role="status">
        <Icon />
        <span>
          <b>Fitly is installed.</b>
          <br />
          <span className="small muted">Open it from your home screen or app list. Can&apos;t find it?</span>{" "}
          <Link href="/install" className="small">
            Get help
          </Link>
        </span>
        <button className="pwa-close" onClick={() => setStandalone(true)} aria-label="Close">
          ×
        </button>
      </div>
    );
  } else if (s === "failed" && !onInstallPage) {
    banner = (
      <div className="pwa-banner pwa-offline" role="alert">
        <Icon />
        <span>
          <b>Fitly didn&apos;t finish installing.</b>
          <br />
          <span className="small muted">Your phone may be blocking home screen icons.</span>{" "}
          <Link href="/install" className="small">
            See how to fix it
          </Link>
        </span>
        <button className="pwa-close" onClick={resetInstallStatus} aria-label="Close">
          ×
        </button>
      </div>
    );
  } else if (!standalone && !dismissed && !onInstallPage) {
    if (s === "available") {
      banner = (
        <div className="pwa-banner">
          <Icon />
          <span>
            <b>Install Fitly</b>
            <br />
            <span className="small muted">Works offline, opens from your home screen.</span>
          </span>
          <button className="btn" onClick={onInstall}>
            Install
          </button>
          <button className="pwa-close" onClick={dismiss} aria-label="Not now">
            ×
          </button>
        </div>
      );
    } else if (platform === "in-app") {
      const android = /Android/.test(navigator.userAgent);
      banner = (
        <div className="pwa-banner">
          <Icon />
          <span className="small">
            <b>To install Fitly, open this page in {android ? "Chrome" : "Safari"}.</b>{" "}
            {android ? "" : "Tap ⋯ and choose Open in Safari."}
          </span>
          {android && (
            <a className="btn" href={chromeIntentUrl()}>
              Open
            </a>
          )}
          <button className="pwa-close" onClick={dismiss} aria-label="Close">
            ×
          </button>
        </div>
      );
    } else if (
      fallbackReady &&
      s === "idle" &&
      (platform === "android-chrome" || platform === "android-samsung" || platform === "desktop")
    ) {
      // The browser didn't offer installation (e.g. it's holding back after a cancelled prompt),
      // so point to its own menu instead.
      banner = (
        <div className="pwa-banner">
          <Icon />
          <span className="small">
            <b>Install Fitly:</b>{" "}
            {platform === "android-samsung" ? (
              <>tap ≡ then <b>Add page to → Home screen</b>.</>
            ) : platform === "desktop" ? (
              <>click the install icon in the address bar.</>
            ) : (
              <>tap <b>⋮</b> at the top right, then <b>Install app</b>.</>
            )}{" "}
            <Link href="/install">Show me how</Link>
          </span>
          <button className="pwa-close" onClick={dismiss} aria-label="Close">
            ×
          </button>
        </div>
      );
    } else if (platform === "ios-safari" || platform === "ios-other") {
      banner = (
        <div className="pwa-banner">
          <Icon />
          <span className="small">
            <b>Install Fitly:</b> tap Share, then <b>Add to Home Screen</b>.{" "}
            <Link href="/install">Show me how</Link>
          </span>
          <button className="pwa-close" onClick={dismiss} aria-label="Close">
            ×
          </button>
        </div>
      );
    }
  }

  return (
    <div className="pwa-stack" aria-live="polite">
      {offline && (
        <div className="pwa-banner pwa-offline" role="status">
          <span>You&apos;re offline. Saved pages and your tracker still work.</span>
        </div>
      )}
      {banner}
    </div>
  );
}
