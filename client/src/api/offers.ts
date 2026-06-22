import { API_BASE_URL } from './config';
import type { OffersHeroData, SeasonalOffer, FlashDeal, HowToRedeemStep, OffersNotifyData } from '@/types/cms';

const OFFERS_API_URL = `${API_BASE_URL}/offers`;

export interface OffersPageConfig {
  hero: OffersHeroData;
  how_to_redeem: HowToRedeemStep[];
  notify: OffersNotifyData;
}

export async function getOffersPageConfig(): Promise<OffersPageConfig> {
  const res = await fetch(`${OFFERS_API_URL}/page`);
  if (!res.ok) throw new Error("Failed to fetch Offers Config");
  return res.json();
}

export async function updateOffersPageConfig(data: OffersPageConfig, token: string): Promise<OffersPageConfig> {
  const res = await fetch(`${OFFERS_API_URL}/page`, {
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

  if (!res.ok) throw new Error("Failed to update Offers Config");
  return res.json();
}

export async function getOffers(type?: "seasonal" | "flash"): Promise<any[]> {
  const url = type ? `${OFFERS_API_URL}/?type=${type}` : `${OFFERS_API_URL}/`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch offers");
  return res.json();
}

export async function createOffer(data: any, token: string): Promise<any> {
  const res = await fetch(`${OFFERS_API_URL}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create offer");
  return res.json();
}

export async function updateOffer(offerId: string, data: any, token: string): Promise<any> {
  const res = await fetch(`${OFFERS_API_URL}/${offerId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update offer");
  return res.json();
}

export async function deleteOffer(offerId: string, token: string): Promise<void> {
  const res = await fetch(`${OFFERS_API_URL}/${offerId}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to delete offer");
}
