import { useEffect } from "react";
import { useLocation } from "wouter";

export function VisitorTracker() {
  const [location] = useLocation();
  useEffect(() => {
    try {
      const nav: any = window.navigator;
      const parts = [
        nav.userAgent || "",
        nav.language || "",
        (nav.languages || []).join(","),
        nav.platform || "",
        String(screen.width || ""),
        String(screen.height || ""),
        String(screen.colorDepth || ""),
        String(nav.hardwareConcurrency || ""),
        String(nav.deviceMemory || ""),
        Intl.DateTimeFormat().resolvedOptions().timeZone || "",
      ].join("|");
      window.crypto.subtle.digest("SHA-256", new TextEncoder().encode(parts)).then((buf) => {
        const fp = Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
        const m = document.cookie.match(/(?:^|;\s*)trial_id=([^;]+)/);
        const trialId = m ? decodeURIComponent(m[1]) : localStorage.getItem("xauto_trial_token") || "";
        fetch("/api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "pageview",
            path: location,
            referrer: document.referrer,
            fingerprint: fp,
            trialId,
          }),
        }).catch(() => {});
      }).catch(() => {});
    } catch {}
  }, [location]);
  return null;
}
