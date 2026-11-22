// Serves the service worker at /sw.js. Generated at build time so the cache version
// changes with every deploy and old caches are cleaned up automatically.
import { TOOLS } from "@/lib/tools";

export const dynamic = "force-static";

const VERSION = (process.env.VERCEL_GIT_COMMIT_SHA ?? String(Date.now())).slice(0, 12);

// Pages available offline from the first visit. Food and blog pages are cached as people open them.
const PRECACHE_PAGES = ["/", "/offline", "/tracker", "/tools", "/calories", "/blog", "/about", ...TOOLS.map((t) => `/tools/${t.slug}`)];
const PRECACHE_FILES = ["/manifest.webmanifest", "/icons/icon-192.png", "/icons/icon-512.png", "/icons/favicon-32.png", "/icons/icon.svg"];

function serviceWorker(version: string, pages: string[], files: string[]) {
  const CACHE = `fitly-${version}`;
  const RUNTIME = `fitly-runtime-${version}`;
  const MAX_RUNTIME_ENTRIES = 200;

  const sw = self as unknown as {
    addEventListener: (type: string, fn: (e: any) => void) => void;
    skipWaiting: () => Promise<void>;
    clients: { claim: () => Promise<void> };
    location: Location;
  };

  // Cache each page plus the JS/CSS it references, so precached pages also work (hydrate) offline.
  async function precache() {
    const cache = await caches.open(CACHE);
    await cache.addAll(files);
    const assets = new Set<string>();
    await Promise.all(
      pages.map(async (url) => {
        const res = await fetch(url, { cache: "reload" });
        if (!res.ok) throw new Error(`precache ${url}: ${res.status}`);
        const html = await res.clone().text();
        for (const m of html.matchAll(/\/_next\/static\/[^"'\s)\\]+/g)) assets.add(m[0]);
        await cache.put(url, res);
      }),
    );
    await cache.addAll([...assets]);
  }

  async function trim(cacheName: string, max: number) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    for (const k of keys.slice(0, Math.max(0, keys.length - max))) await cache.delete(k);
  }

  async function networkFirstPage(request: Request) {
    try {
      const res = await fetch(request);
      if (res.ok) {
        const copy = res.clone();
        caches.open(RUNTIME).then((c) => c.put(request.url.split("?")[0], copy).then(() => trim(RUNTIME, MAX_RUNTIME_ENTRIES)));
      }
      return res;
    } catch {
      const path = new URL(request.url).pathname;
      return (
        (await caches.match(path)) ??
        (await caches.match(request.url.split("?")[0])) ??
        ((await caches.match("/offline")) as Response)
      );
    }
  }

  async function cacheFirst(request: Request) {
    const hit = await caches.match(request);
    if (hit) return hit;
    const res = await fetch(request);
    if (res.ok) {
      const copy = res.clone();
      caches.open(RUNTIME).then((c) => c.put(request, copy));
    }
    return res;
  }

  async function staleWhileRevalidate(request: Request) {
    const hit = await caches.match(request);
    const update = fetch(request)
      .then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(RUNTIME).then((c) => c.put(request, copy));
        }
        return res;
      })
      .catch(() => hit as Response);
    return hit ?? update;
  }

  sw.addEventListener("install", (event) => {
    event.waitUntil(precache());
  });

  sw.addEventListener("activate", (event) => {
    event.waitUntil(
      (async () => {
        const keep = new Set([CACHE, RUNTIME]);
        for (const key of await caches.keys()) if (key.startsWith("fitly-") && !keep.has(key)) await caches.delete(key);
        await sw.clients.claim();
      })(),
    );
  });

  // The page asks the waiting worker to take over when the user taps "Update".
  sw.addEventListener("message", (event) => {
    if (event.data?.type === "SKIP_WAITING") sw.skipWaiting();
  });

  sw.addEventListener("fetch", (event) => {
    const request: Request = event.request;
    if (request.method !== "GET") return;
    const url = new URL(request.url);
    if (url.origin !== sw.location.origin) return;
    // Next.js client-side navigation payloads: let them go to the network. If offline they fail
    // and Next.js falls back to a full page load, which the navigation handler below serves from cache.
    if (request.headers.get("RSC") || url.searchParams.has("_rsc")) return;
    if (url.pathname === "/sw.js") return;

    if (request.mode === "navigate") return event.respondWith(networkFirstPage(request));
    if (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/icons/") || url.pathname.startsWith("/screenshots/"))
      return event.respondWith(cacheFirst(request));
    event.respondWith(staleWhileRevalidate(request));
  });
}

export function GET() {
  const body = `(${serviceWorker.toString()})(${JSON.stringify(VERSION)}, ${JSON.stringify(PRECACHE_PAGES)}, ${JSON.stringify(PRECACHE_FILES)});`;
  return new Response(body, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Service-Worker-Allowed": "/",
    },
  });
}
