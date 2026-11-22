import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";
import PwaManager from "@/components/PwaManager";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} — ${SITE.tagline}`, template: `%s | ${SITE.name}` },
  description:
    "Free BMI, calorie, protein and pregnancy calculators, calories in 75+ Indian foods, expert health articles and a daily water, steps and food tracker.",
  openGraph: { siteName: SITE.name, type: "website", locale: "en_IN" },
  alternates: { canonical: "/" },
  applicationName: SITE.name,
  appleWebApp: { capable: true, title: SITE.name, statusBarStyle: "default" },
  formatDetection: { telephone: false },
  icons: {
    icon: [
      { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0f9d6b" },
    { media: "(prefers-color-scheme: dark)", color: "#0e1513" },
  ],
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN">
      <body>
        <header className="site-header">
          <div className="container">
            <Link href="/" className="logo">
              Fit<span>ly</span>
            </Link>
            <nav className="nav" aria-label="Main">
              <Link href="/tools">Tools</Link>
              <Link href="/calories">Food calories</Link>
              <Link href="/blog">Blog</Link>
              <Link href="/tracker">Tracker</Link>
            </nav>
          </div>
        </header>
        <main>
          <div className="container">{children}</div>
        </main>
        <footer className="site-footer">
          <div className="container">
            <nav aria-label="Footer">
              <Link href="/tools">All tools</Link>
              <Link href="/calories">Indian food calories</Link>
              <Link href="/blog">Blog</Link>
              <Link href="/about">About &amp; disclaimer</Link>
            </nav>
            <p>
              Fitly provides general health information, not medical advice. Always consult a qualified doctor for diagnosis or
              treatment.
            </p>
            <p>© {new Date().getFullYear()} Fitly</p>
          </div>
        </footer>
        <PwaManager />
      </body>
    </html>
  );
}
