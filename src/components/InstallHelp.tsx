"use client";

import { useEffect, useState } from "react";
import {
  chromeIntentUrl,
  detectPlatform,
  isRestrictiveAndroidSkin,
  isStandalone,
  promptInstall,
  startInstallListener,
  useInstallState,
  type Platform,
} from "@/lib/pwaInstall";

type Section = { id: string; title: string; for: Platform[]; body: React.ReactNode };

const SECTIONS: Section[] = [
  {
    id: "android-chrome",
    title: "Android phone, Chrome",
    for: ["android-chrome"],
    body: (
      <ol>
        <li>Tap the <b>⋮</b> menu at the top right of Chrome.</li>
        <li>Tap <b>Install app</b> (on some phones it says <b>Add to Home screen</b>, then <b>Install</b>).</li>
        <li>Tap <b>Install</b> in the box that opens.</li>
        <li>Wait about 10 seconds. Fitly appears in your app list, and on most phones on the home screen too.</li>
      </ol>
    ),
  },
  {
    id: "android-blocked",
    title: "Tapped Install but no icon appeared (Xiaomi, Redmi, POCO, Oppo, Realme, Vivo, OnePlus)",
    for: [],
    body: (
      <>
        <p>
          These phones block Chrome from adding home screen icons until you allow it. The install then fails silently. Fix it once:
        </p>
        <ol>
          <li>Open your phone&apos;s <b>Settings</b> → <b>Apps</b> (or <b>App management</b>) → <b>Chrome</b>.</li>
          <li>
            Open <b>Permissions</b> or <b>Other permissions</b>.
          </li>
          <li>
            Allow <b>Home screen shortcuts</b> (may be called <b>Desktop shortcuts</b> or <b>Create shortcuts</b>).
          </li>
          <li>Come back to Fitly in Chrome and install again.</li>
        </ol>
        <p className="small muted">Menu names differ a little between phone models and Android versions.</p>
      </>
    ),
  },
  {
    id: "android-missing",
    title: "It says installed, but I can't find the icon",
    for: [],
    body: (
      <ul>
        <li>Swipe up to open your <b>app list</b> (app drawer) and look for <b>Fitly</b>, or search for it.</li>
        <li>Long-press the Fitly icon there and drag it to your home screen.</li>
        <li>In Chrome, open the <b>⋮</b> menu: if it shows <b>Open Fitly</b>, it is installed.</li>
      </ul>
    ),
  },
  {
    id: "android-samsung",
    title: "Samsung Internet",
    for: ["android-samsung"],
    body: (
      <ol>
        <li>Tap the install icon in the address bar if you see one, or tap the <b>≡</b> menu.</li>
        <li>Tap <b>Add page to</b> → <b>Home screen</b>.</li>
        <li>Tap <b>Add</b>.</li>
      </ol>
    ),
  },
  {
    id: "android-other",
    title: "Mi Browser, Opera, UC Browser or another browser",
    for: ["android-other"],
    body: (
      <p>
        Many of these browsers can&apos;t install apps properly. Open <b>fitly-virid-phi.vercel.app</b> in <b>Chrome</b> and follow the
        Chrome steps.
      </p>
    ),
  },
  {
    id: "ios-safari",
    title: "iPhone or iPad, Safari",
    for: ["ios-safari"],
    body: (
      <ol>
        <li>
          Tap the <b>Share</b> button (square with an arrow) at the bottom of Safari.
        </li>
        <li>Scroll down and tap <b>Add to Home Screen</b>.</li>
        <li>Tap <b>Add</b> at the top right.</li>
      </ol>
    ),
  },
  {
    id: "ios-other",
    title: "iPhone, Chrome or another browser",
    for: ["ios-other"],
    body: (
      <p>
        On recent iOS versions, tap the <b>Share</b> button in the address bar, then <b>Add to Home Screen</b>. If you don&apos;t see it,
        open this page in <b>Safari</b> and follow the Safari steps.
      </p>
    ),
  },
  {
    id: "in-app",
    title: "Opened from WhatsApp, Instagram or Facebook",
    for: ["in-app"],
    body: (
      <p>
        Apps like WhatsApp open links in their own browser, which can&apos;t install apps. Tap the <b>⋮</b> or <b>⋯</b> menu and choose{" "}
        <b>Open in Chrome</b> (Android) or <b>Open in Safari</b> (iPhone), then install from there.
      </p>
    ),
  },
  {
    id: "desktop",
    title: "Computer (Chrome or Edge)",
    for: ["desktop"],
    body: (
      <p>
        Click the install icon at the right end of the address bar, or open the browser menu and choose <b>Install Fitly</b>.
      </p>
    ),
  },
];

export default function InstallHelp() {
  const install = useInstallState();
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [restrictive, setRestrictive] = useState(false);
  const [standalone, setStandalone] = useState(false);

  useEffect(() => {
    startInstallListener();
    setPlatform(detectPlatform());
    setRestrictive(isRestrictiveAndroidSkin());
    setStandalone(isStandalone());
  }, []);

  if (!platform) return null;
  const s = install.status;
  const isAndroid = platform.startsWith("android");
  const openFirst = new Set<string>([
    ...SECTIONS.filter((x) => x.for.includes(platform)).map((x) => x.id),
    ...(s === "failed" || (isAndroid && restrictive) ? ["android-blocked"] : []),
    ...(s === "installed" || s === "failed" ? ["android-missing"] : []),
  ]);
  const ordered = [...SECTIONS.filter((x) => openFirst.has(x.id)), ...SECTIONS.filter((x) => !openFirst.has(x.id))];

  return (
    <>
      <div className="card" style={{ margin: "16px 0 24px" }}>
        {standalone ? (
          <p style={{ margin: 0 }}>
            <b>You&apos;re using the installed Fitly app.</b> Nothing else to do.
          </p>
        ) : s === "available" ? (
          <>
            <p style={{ marginTop: 0 }}>Your browser can install Fitly right now.</p>
            <button className="btn" onClick={() => promptInstall()}>
              Install Fitly
            </button>
          </>
        ) : s === "prompting" || s === "installing" ? (
          <p style={{ margin: 0 }}>
            <b>Installing…</b> This takes a few seconds. Look for Fitly in your app list.
          </p>
        ) : s === "installed" ? (
          <p style={{ margin: 0 }}>
            <b>Fitly is installed.</b> Open it from your home screen or app list.
          </p>
        ) : s === "failed" ? (
          <p style={{ margin: 0 }}>
            <b>The install didn&apos;t finish.</b> On Xiaomi, Redmi, POCO, Oppo, Realme and Vivo phones this usually means Chrome isn&apos;t
            allowed to add home screen icons. Follow the fix below, then try again.
          </p>
        ) : platform === "in-app" ? (
          <>
            <p style={{ marginTop: 0 }}>You opened Fitly inside another app, which can&apos;t install it.</p>
            {/Android/.test(navigator.userAgent) && (
              <a className="btn" href={chromeIntentUrl()}>
                Open in Chrome
              </a>
            )}
          </>
        ) : (
          <p style={{ margin: 0 }}>Follow the steps for your phone below.</p>
        )}
      </div>

      <div className="faq">
        {ordered.map((x) => (
          <details key={x.id} open={openFirst.has(x.id)}>
            <summary>{x.title}</summary>
            {x.body}
          </details>
        ))}
      </div>
      <p className="muted small section">
        Can&apos;t install? Everything in Fitly also works in your browser. Bookmark this site and your tracker data stays on this device.
      </p>
    </>
  );
}
