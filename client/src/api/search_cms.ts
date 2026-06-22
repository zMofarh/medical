import { API_BASE_URL } from './config';
import type { SearchHeroData, PopularSearch, QuickLink, SearchCTAData, SearchResultsConfig } from '@/types/cms';

const SEARCH_API_URL = `${API_BASE_URL}/cms-search`;

export interface SearchCMSContent {
  hero: SearchHeroData;
  popular_searches: PopularSearch[];
  quick_links: QuickLink[];
  cta: SearchCTAData;
  results_config: SearchResultsConfig;
}

export async function getSearchCMS(): Promise<SearchCMSContent> {
  const res = await fetch(`${SEARCH_API_URL}/`);
  if (!res.ok) throw new Error("Failed to fetch Search CMS");
  return res.json();
}

export async function updateSearchCMS(data: SearchCMSContent, token: string): Promise<SearchCMSContent> {
  const res = await fetch(`${SEARCH_API_URL}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });

  if (res.status === 401) {
    window.dispatchEvent(new CustomEvent("auth-error"));
    throw new Error("انتهت جلسة الدخول");
  }

  if (!res.ok) throw new Error("Failed to update Search CMS");
  return res.json();
}
