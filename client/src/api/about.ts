import { API_BASE_URL } from './config';
import type { AboutHeroData, AboutStoryData, AboutMission, AboutValue, AboutTimelineEvent, AboutTeamMember, AboutAward } from '@/types/cms';

const ABOUT_API_URL = `${API_BASE_URL}/cms-about`;

export interface AboutCMSContent {
  hero: AboutHeroData;
  story: AboutStoryData;
  mission: AboutMission[];
  values: AboutValue[];
  timeline: AboutTimelineEvent[];
  team: AboutTeamMember[];
  awards: AboutAward[];
}

export async function getAboutCMS(): Promise<AboutCMSContent> {
  const res = await fetch(`${ABOUT_API_URL}/`);
  if (!res.ok) throw new Error("Failed to fetch About CMS");
  return res.json();
}

export async function updateAboutCMS(data: AboutCMSContent, token: string): Promise<AboutCMSContent> {
  const res = await fetch(`${ABOUT_API_URL}/`, {
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

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.detail || "Failed to update About CMS");
  }

  return res.json();
}
