import { useState, useEffect, useCallback } from "react";
import {
  testimonialsData as initialData,
  testimonialsConfig as initialConfig,
  testimonialsStats as initialStats,
} from "@/mocks/testimonialsData";
import { useDataContext } from "@/context/DataContext";

type Testimonial = typeof initialData[0];
type Config = typeof initialConfig;
type Stats = typeof initialStats;

export function useCMSTestimonials() {
  const {
    testimonials: globalTestimonials,
    testimonialsConfig: globalConfig,
    testimonialsStats: stats,
    saveTestimonials,
    resetTestimonials,
  } = useDataContext();

  const [testimonials, setTestimonials] = useState<Testimonial[]>(globalTestimonials);
  const [config, setConfig]             = useState<Config>(globalConfig);
  const [saveStatus, setSaveStatus]     = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [hasChanges, setHasChanges]     = useState(false);

  useEffect(() => {
    setTestimonials(globalTestimonials);
    setConfig(globalConfig);
  }, [globalTestimonials, globalConfig]);

  const save = useCallback(async (data: Testimonial[], cfg: Config) => {
    setSaveStatus("saving");
    try {
      await saveTestimonials(data, cfg);
      setSaveStatus("saved");
      setHasChanges(false);
      setTimeout(() => setSaveStatus("idle"), 2500);
      return { success: true };
    } catch (err) {
      setSaveStatus("error");
      return { success: false, error: err };
    }
  }, [saveTestimonials]);

  const updateTestimonials = useCallback((data: Testimonial[]) => {
    setTestimonials(data);
    setHasChanges(true);
  }, []);

  const updateConfig = useCallback((cfg: Config) => {
    setConfig(cfg);
    setHasChanges(true);
  }, []);

  const reset = useCallback(() => {
    resetTestimonials();
    setHasChanges(false);
  }, [resetTestimonials]);

  return {
    testimonials,
    config,
    stats,
    loading: false,
    error: null,
    saveStatus,
    hasChanges,
    updateTestimonials,
    updateConfig,
    save,
    reset,
    reload: () => {},
  };
}

// ─── Public-facing hook (read-only, reactive) ─────────────────────────────────
export function usePublicTestimonials() {
  const { testimonials, testimonialsConfig: config } = useDataContext();

  // Only published testimonials for public display
  const published = testimonials.filter((t) => t.published);
  const featured = published.filter((t) => t.featured);

  return { testimonials: published, featured, config };
}
export type { Testimonial, Config, Stats };
