import { useState, useEffect, useCallback } from "react";

// ─── CMS Store — Persistent localStorage bridge ───────────────────────────────
// This is the central store that connects CMS admin edits to public pages.
// When admin saves data in CMS, it's stored here. Public pages read from here.

const STORE_KEYS = {
  testimonials: "cms_testimonials_data",
  testimonialsConfig: "cms_testimonials_config",
  offers_hero: "cms_offers_hero",
  offers_seasonal: "cms_offers_seasonal",
  offers_flash: "cms_offers_flash",
  offers_redeem: "cms_offers_redeem",
  offers_notify: "cms_offers_notify",
  search_hero: "cms_search_hero",
  search_popular: "cms_search_popular",
  search_quicklinks: "cms_search_quicklinks",
  search_cta: "cms_search_cta",
  search_results_config: "cms_search_results_config",
  faqs: "cms_faqs",
  faq_categories: "cms_faq_categories",
} as const;

type StoreKey = keyof typeof STORE_KEYS;

// ─── Generic read/write helpers ───────────────────────────────────────────────

export function cmsRead<T>(key: StoreKey, fallback: T): T {
  try {
    const raw = localStorage.getItem(STORE_KEYS[key]);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function cmsWrite<T>(key: StoreKey, value: T): void {
  try {
    localStorage.setItem(STORE_KEYS[key], JSON.stringify(value));
    // Dispatch custom event so other tabs/components can react
    window.dispatchEvent(new CustomEvent("cms-update", { detail: { key } }));
  } catch {
    // localStorage might be full — silently fail
  }
}

// ─── Generic reactive hook ────────────────────────────────────────────────────

export function useCMSData<T>(key: StoreKey, fallback: T): [T, (val: T) => void] {
  const [data, setData] = useState<T>(() => cmsRead(key, fallback));

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.key === key) {
        setData(cmsRead(key, fallback));
      }
    };
    window.addEventListener("cms-update", handler);
    return () => window.removeEventListener("cms-update", handler);
  }, [key, fallback]);

  const write = useCallback(
    (val: T) => {
      cmsWrite(key, val);
      setData(val);
    },
    [key]
  );

  return [data, write];
}

export { STORE_KEYS };
