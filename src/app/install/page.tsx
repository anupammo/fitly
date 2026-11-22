import type { Metadata } from "next";
import InstallHelp from "@/components/InstallHelp";

export const metadata: Metadata = {
  title: "Install the Fitly App",
  description: "Install Fitly on your Android phone, iPhone or computer. Free, works offline, no app store needed.",
  alternates: { canonical: "/install" },
};

export default function InstallPage() {
  return (
    <div className="prose">
      <h1>Install the Fitly app</h1>
      <p className="lead">Free, about 1 MB, works offline. No app store or sign-up needed.</p>
      <InstallHelp />
    </div>
  );
}
