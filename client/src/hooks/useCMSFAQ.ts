import { useState, useEffect, useCallback } from "react";
import { type FAQItem, type FAQCategory } from "@/mocks/faqData";
import { useDataContext } from "@/context/DataContext";

// ─── Public hook (read-only, reactive) ───────────────────────────────────────
export function usePublicFAQData() {
  const { faqs, faqCategories: categories } = useDataContext();
  return { faqs, categories };
}

// ─── CMS Admin hook (read + write) ───────────────────────────────────────────
export function useCMSFAQ() {
  const {
    faqs: globalFaqs,
    faqCategories: globalCategories,
    saveFAQs,
    resetFAQs,
  } = useDataContext();

  const [faqs, setFaqs] = useState<FAQItem[]>(globalFaqs);
  const [categories, setCategories] = useState<FAQCategory[]>(globalCategories);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [hasChanges, setHasChanges] = useState(false);

  // Sync with global state
  useEffect(() => {
    setFaqs(globalFaqs);
  }, [globalFaqs]);

  useEffect(() => {
    setCategories(globalCategories);
  }, [globalCategories]);

  const save = useCallback(async (data: FAQItem[], cats: FAQCategory[]) => {
    setSaveStatus("saving");
    try {
      await saveFAQs(data, cats);
      setSaveStatus("saved");
      setHasChanges(false);
      setTimeout(() => setSaveStatus("idle"), 2500);
      return { success: true };
    } catch (err) {
      setSaveStatus("error");
      return { success: false, error: err };
    }
  }, [saveFAQs]);

  const updateFaqs = useCallback((data: FAQItem[]) => {
    setFaqs(data);
    setHasChanges(true);
  }, []);

  const updateCategories = useCallback((data: FAQCategory[]) => {
    setCategories(data);
    setHasChanges(true);
  }, []);

  const reset = useCallback(() => {
    resetFAQs();
    setHasChanges(false);
  }, [resetFAQs]);

  return {
    faqs,
    categories,
    loading: false,
    error: null,
    saveStatus,
    hasChanges,
    updateFaqs,
    updateCategories,
    save,
    reset,
    reload: () => {},
  };
}
