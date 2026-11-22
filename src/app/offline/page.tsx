import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "You're offline",
  robots: { index: false, follow: false },
};

export default function Offline() {
  return (
    <div className="prose">
      <h1>You&apos;re offline</h1>
      <p className="lead">This page hasn&apos;t been saved on your device yet. These still work without internet:</p>
      <ul>
        <li>
          <Link href="/tracker">Daily tracker</Link> — your entries save on this device and stay there
        </li>
        <li>
          <Link href="/tools">All 16 calculators</Link>
        </li>
        <li>
          <Link href="/calories">Food calorie list</Link> and any food page you opened before
        </li>
      </ul>
      <p className="muted">Pages you open while online are saved automatically for next time.</p>
    </div>
  );
}
