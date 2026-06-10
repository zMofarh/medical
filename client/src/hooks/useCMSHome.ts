import { useState, useEffect, useCallback } from "react";
import { type CMSContent } from "@/mocks/cmsData";
import { useDataContext } from "@/context/DataContext";

// ─── Public hook (for public-facing pages) ────────────────────────────────────
export function usePublicHome() {
  const { homeContent: content } = useDataContext();
  return { content };
}

// ─── CMS Admin hook (for CMS admin pages) ────────────────────────────────────
export function useCMSHome() {
  const {
    homeContent: globalContent,
    saveHomeContent,
    resetHomeContent,
  } = useDataContext();

  const [content, setContent]       = useState<CMSContent>(globalContent);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setContent(globalContent);
  }, [globalContent]);

  const save = useCallback(async (data: CMSContent) => {
    setSaveStatus("saving");
    try {
      const dataWithTimestamp: CMSContent = { ...data, lastUpdated: new Date().toISOString() };
      await saveHomeContent(dataWithTimestamp);
      setContent(dataWithTimestamp);
      setSaveStatus("saved");
      setHasChanges(false);
      setTimeout(() => setSaveStatus("idle"), 2500);
      return { success: true };
    } catch (err) {
      setSaveStatus("error");
      return { success: false, error: err };
    }
  }, [saveHomeContent]);

  const updateSection = useCallback(
    <K extends keyof Omit<CMSContent, "lastUpdated">>(section: K, data: CMSContent[K]) => {
      setContent((prev) => ({ ...prev, [section]: data }));
      setHasChanges(true);
    },
    []
  );

  const reset = useCallback(() => {
    resetHomeContent();
    setHasChanges(false);
  }, [resetHomeContent]);

  return {
    content,
    loading: false,
    error: null,
    saveStatus,
    hasChanges,
    updateSection,
    save,
    reset,
    reload: () => {},
  };
}
