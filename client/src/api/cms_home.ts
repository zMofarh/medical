import { CMSContent } from "@/mocks/cmsData";

import { API_BASE_URL } from './config';
const LOCAL_API_URL = `${API_BASE_URL}/cms/home`;

export interface CMSHomeResponse {
  hero: any;
  why_us: any;
  cta: any;
  trust_bar: any;
  testimonials: any;
  id: string;
  created_at: string;
  updated_at: string;
}

export function adaptToFrontend(data: CMSHomeResponse): CMSContent {
  return {
    hero: data.hero || {},
    whyUs: data.why_us || {},
    cta: data.cta || {},
    trustBar: data.trust_bar || {},
    testimonials: data.testimonials || {},
    lastUpdated: data.updated_at || new Date().toISOString()
  };
}

export function adaptToBackend(data: CMSContent) {
  return {
    hero: data.hero,
    why_us: data.whyUs,
    cta: data.cta,
    trust_bar: data.trustBar,
    testimonials: data.testimonials
  };
}

export async function getHomeContent(): Promise<CMSContent> {
  const res = await fetch(`${LOCAL_API_URL}/`);
  if (!res.ok) throw new Error("Failed to fetch home CMS content");
  const data = await res.json();
  return adaptToFrontend(data);
}

export async function updateHomeContent(data: CMSContent): Promise<CMSContent> {
  const token = localStorage.getItem("access_token");
  const backendData = adaptToBackend(data);
  const res = await fetch(`${LOCAL_API_URL}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(backendData),
  });

  if (res.status === 401) {
    window.dispatchEvent(new CustomEvent("auth-error"));
    throw new Error("انتهت جلسة الدخول");
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.detail || "Failed to update home CMS content");
  }

  const updated = await res.json();
  return adaptToFrontend(updated);
}

