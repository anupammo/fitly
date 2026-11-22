"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isStandalone, promptInstall, startInstallListener, useInstallState } from "@/lib/pwaInstall";

/** Always-visible "Install" button: opens the browser's install dialog, or the help page when the browser won't. */
export default function HeaderInstall() {
  const { status } = useInstallState();
  const router = useRouter();
  const [standalone, setStandalone] = useState(true);

  useEffect(() => {
    startInstallListener();
    setStandalone(isStandalone());
  }, []);

  if (standalone || status === "installed") return null;

  const onClick = async () => {
    const result = status === "available" ? await promptInstall() : "unavailable";
    if (result === "unavailable") router.push("/install");
  };

  return (
    <button className="header-install" onClick={onClick} disabled={status === "prompting" || status === "installing"}>
      <svg aria-hidden width="14" height="14" viewBox="0 0 16 16">
        <path d="M8 2v8M4.5 6.5 8 10l3.5-3.5M3 13h10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {status === "installing" || status === "prompting" ? "Installing" : "Install"}
    </button>
  );
}
