import { useState, useEffect, useCallback } from "react";
import {
  searchHeroData,
  popularSearchesData,
  quickLinksData,
  searchCTAData,
  searchResultsConfig,
  type SearchHeroData,
  type PopularSearch,
  type QuickLink,
  type SearchCTAData,
  type SearchResultsConfig,
} from "@/mocks/searchPageData";
import { useDataContext } from "@/context/DataContext";

export function useCMSSearch() {
  const {
    searchHero: globalHero,
    searchPopular: globalPopular,
    searchQuickLinks: globalQuickLinks,
    searchCTA: globalCTA,
    searchResultsConfig: globalResultsConfig,
    saveSearch,
    resetSearch,
  } = useDataContext();

  const [hero, setHero]                   = useState<SearchHeroData>(globalHero);
  const [popular, setPopular]             = useState<PopularSearch[]>(globalPopular);
  const [quickLinks, setQuickLinks]       = useState<QuickLink[]>(globalQuickLinks);
  const [cta, setCta]                     = useState<SearchCTAData>(globalCTA);
  const [resultsConfig, setResultsConfig] = useState<SearchResultsConfig>(globalResultsConfig);
  
  const [saveStatus, setSaveStatus]       = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [hasChanges, setHasChanges]       = useState(false);

  useEffect(() => {
    setHero(globalHero);
    setPopular(globalPopular);
    setQuickLinks(globalQuickLinks);
    setCta(globalCTA);
    setResultsConfig(globalResultsConfig);
  }, [globalHero, globalPopular, globalQuickLinks, globalCTA, globalResultsConfig]);

  const save = useCallback(async (data: {
    hero: SearchHeroData;
    popular: PopularSearch[];
    quickLinks: QuickLink[];
    cta: SearchCTAData;
    resultsConfig: SearchResultsConfig;
  }) => {
    setSaveStatus("saving");
    try {
      await saveSearch(data);
      setSaveStatus("saved");
      setHasChanges(false);
      setTimeout(() => setSaveStatus("idle"), 2500);
      return { success: true };
    } catch (err) {
      setSaveStatus("error");
      return { success: false, error: err };
    }
  }, [saveSearch]);

  const updateHero = useCallback((d: SearchHeroData) => { setHero(d); setHasChanges(true); }, []);
  const updatePopular = useCallback((d: PopularSearch[]) => { setPopular(d); setHasChanges(true); }, []);
  const updateQuickLinks = useCallback((d: QuickLink[]) => { setQuickLinks(d); setHasChanges(true); }, []);
  const updateCta = useCallback((d: SearchCTAData) => { setCta(d); setHasChanges(true); }, []);
  const updateResultsConfig = useCallback((d: SearchResultsConfig) => { setResultsConfig(d); setHasChanges(true); }, []);

  const reset = useCallback(() => {
    resetSearch();
    setHasChanges(false);
  }, [resetSearch]);

  return {
    hero, popular, quickLinks, cta, resultsConfig,
    saveStatus, hasChanges,
    updateHero, updatePopular, updateQuickLinks, updateCta, updateResultsConfig,
    save, reset,
  };
}

// ─── Public-facing hook ───────────────────────────────────────────────────────
export function usePublicSearch() {
  const {
    searchHero: hero,
    searchPopular: popular,
    searchQuickLinks: quickLinks,
    searchCTA: cta,
    searchResultsConfig: resultsConfig,
  } = useDataContext();

  return {
    hero,
    popular: popular.filter((p) => p.active),
    quickLinks: quickLinks.filter((q) => q.active),
    cta,
    resultsConfig,
  };
}
export type { SearchHeroData, PopularSearch, QuickLink, SearchCTAData, SearchResultsConfig };
