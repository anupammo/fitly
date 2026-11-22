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
const recentlyDismissed = () => {
  const at = Number(safeGet(DISMISS_KEY));
  return at > 0 && Date.now() - at < DISMISS_DAYS * 86_400_000;
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

  useEffect(() => {
    startInstallListener();
    setPlatform(detectPlatform());
    setDismissed(recentlyDismissed());
    setStandalone(isStandalone());
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
    safeSet(DISMISS_KEY, String(Date.now()));
    setDismissed(true);
  };

  const onInstall = async () => {
    const result = await promptInstall();
    if (result === "dismissed") dismiss();
  };

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
