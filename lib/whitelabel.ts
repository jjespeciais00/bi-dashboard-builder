// lib/whitelabel.ts
"use client";

import { useState, useEffect, useCallback } from "react";

export interface WhiteLabel {
  appName: string;
  logoSrc: string;   // base64 ou URL
  faviconSrc: string; // base64 ou URL
}

export const DEFAULT_WHITELABEL: WhiteLabel = {
  appName: "BI Builder",
  logoSrc: "",
  faviconSrc: "",
};

const STORAGE_KEY = "bi_dashboard_whitelabel";

function applyFavicon(src: string) {
  if (typeof document === "undefined") return;
  let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }
  link.href = src || "/favicon.ico";
}

export function useWhiteLabel() {
  const [wl, setWlState] = useState<WhiteLabel>(DEFAULT_WHITELABEL);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const loaded = saved
        ? { ...DEFAULT_WHITELABEL, ...JSON.parse(saved) }
        : DEFAULT_WHITELABEL;
      setWlState(loaded);
      applyFavicon(loaded.faviconSrc);
      if (loaded.appName) document.title = loaded.appName;
    } catch {
      // ignore
    }
  }, []);

  const setWl = useCallback((updater: Partial<WhiteLabel>) => {
    setWlState((prev) => {
      const next = { ...prev, ...updater };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      if (updater.faviconSrc !== undefined) applyFavicon(next.faviconSrc);
      if (updater.appName !== undefined) document.title = next.appName;
      return next;
    });
  }, []);

  const resetWl = useCallback(() => {
    setWlState(DEFAULT_WHITELABEL);
    applyFavicon("");
    document.title = DEFAULT_WHITELABEL.appName;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  return { wl, setWl, resetWl };
}
