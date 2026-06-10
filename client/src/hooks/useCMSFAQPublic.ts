import { useState, useEffect, useCallback } from "react";
import { type FAQItem, type FAQCategory } from "@/mocks/faqData";
import { useDataContext } from "@/context/DataContext";

// ─── Public-facing FAQ hook ──────────────────────────────────────────────────
export function usePublicFAQ() {
  const { faqs, faqCategories: categories } = useDataContext();
  return { faqs, categories };
}

// ─── CMS FAQ hook (read + write) ──────────────────────────────────────────────
export function useCMSFAQStore() {
  const {
    faqs: globalFaqs,
    faqCategories: globalCategories,
    saveFAQs,
  } = useDataContext();

  const [faqs, setFaqs] = useState<FAQItem[]>(globalFaqs);
  const [categories, setCategories] = useState<FAQCategory[]>(globalCategories);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  useEffect(() => {
    setFaqs(globalFaqs);
  }, [globalFaqs]);

  useEffect(() => {
    setCategories(globalCategories);
  }, [globalCategories]);

  const save = useCallback(async (newFaqs: FAQItem[], newCats: FAQCategory[]) => {
    setSaveStatus("saving");
    try {
      await saveFAQs(newFaqs, newCats);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2500);
      return { success: true };
    } catch (err) {
      setSaveStatus("error");
      return { success: false, error: err };
    }
  }, [saveFAQs]);

  return { faqs, categories, saveStatus, save };
}
