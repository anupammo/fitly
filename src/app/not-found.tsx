import Link from "next/link";

export default function NotFound() {
  return (
    <div className="prose">
      <h1>Page not found</h1>
      <p>
        Try our <Link href="/tools">free tools</Link>, <Link href="/calories">Indian food calories</Link> or the{" "}
        <Link href="/tracker">daily tracker</Link>.
      </p>
    </div>
  );
}
