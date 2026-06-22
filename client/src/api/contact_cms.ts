import { API_BASE_URL } from './config';
import type { ContactHeroData, ContactMethod, ContactFormConfig, ContactMapConfig, ContactCtaBanner, ContactFaqTeaser } from '@/types/cms';

const CONTACT_API_URL = `${API_BASE_URL}/cms-contact`;

export interface ContactCMSContent {
  hero: ContactHeroData;
  methods: ContactMethod[];
  form_config: ContactFormConfig;
  map_config: ContactMapConfig;
  cta_banner: ContactCtaBanner;
  faq_teaser: ContactFaqTeaser;
}

export async function getContactCMS(): Promise<ContactCMSContent> {
  const res = await fetch(`${CONTACT_API_URL}/`);
  if (!res.ok) throw new Error("Failed to fetch Contact CMS");
  return res.json();
}

export async function updateContactCMS(data: ContactCMSContent, token: string): Promise<ContactCMSContent> {
  const res = await fetch(`${CONTACT_API_URL}/`, {
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

  if (!res.ok) throw new Error("Failed to update Contact CMS");
  return res.json();
}
