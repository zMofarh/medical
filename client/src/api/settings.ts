import { API_BASE_URL } from './config';
import type { ClinicInfo, WorkingHours, SocialMedia, EmergencyContact } from '@/types/cms';

const SETTINGS_API_URL = `${API_BASE_URL}/settings`;

export interface SystemSettingsContent {
  clinic_info: ClinicInfo;
  working_hours: WorkingHours;
  social_media: SocialMedia;
  emergency_contact: EmergencyContact;
  seo_defaults?: any;
  custom_scripts?: any;
}

export async function getSettings(): Promise<SystemSettingsContent> {
  const res = await fetch(`${SETTINGS_API_URL}/`);
  if (!res.ok) throw new Error("Failed to fetch settings");
  return res.json();
}

export async function updateSettings(data: SystemSettingsContent, token: string): Promise<SystemSettingsContent> {
  const res = await fetch(`${SETTINGS_API_URL}/`, {
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

  if (!res.ok) throw new Error("Failed to update settings");
  return res.json();
}
