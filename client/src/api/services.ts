import { API_BASE_URL } from './config';
const LOCAL_API_URL = `${API_BASE_URL}/services`;

export interface CMSServiceCreate {
  service_id: string;
  name: string;
  tagline?: string;
  description?: string;
  long_description?: string;
  icon?: string;
  accent_color?: string;
  image?: string;
  hero_image?: string;
  category?: string;
  stats?: any[];
  procedures?: any[];
  prices?: any[];
  doctors?: any[];
  faqs?: any[];
  related_services?: string[];
}

export interface CMSServiceUpdate extends Partial<CMSServiceCreate> {}

export interface CMSServiceResponse extends CMSServiceCreate {
  id: string;
  created_at: string;
  updated_at: string;
}

// ─── API Functions ────────────────────────────────────────────────────────────

export async function getServices(skip = 0, limit = 100): Promise<CMSServiceResponse[]> {
  const res = await fetch(`${LOCAL_API_URL}/?skip=${skip}&limit=${limit}`);
  if (!res.ok) throw new Error("Failed to fetch services");
  return res.json();
}

export async function getServiceById(id: string): Promise<CMSServiceResponse> {
  const res = await fetch(`${LOCAL_API_URL}/${id}`);
  if (!res.ok) throw new Error("Failed to fetch service details");
  return res.json();
}

export async function createService(data: CMSServiceCreate): Promise<CMSServiceResponse> {
  const token = localStorage.getItem("access_token");
  const res = await fetch(`${LOCAL_API_URL}/`, {
    method: "POST",
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
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.detail || "Failed to create service");
  }

  return res.json();
}

export async function updateService(id: string, data: CMSServiceUpdate): Promise<CMSServiceResponse> {
  const token = localStorage.getItem("access_token");
  const res = await fetch(`${LOCAL_API_URL}/${id}`, {
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
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.detail || "Failed to update service");
  }

  return res.json();
}

export async function deleteService(id: string): Promise<{ message: string }> {
  const token = localStorage.getItem("access_token");
  const res = await fetch(`${LOCAL_API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    },
  });

  if (res.status === 401) {
    window.dispatchEvent(new CustomEvent("auth-error"));
    throw new Error("انتهت جلسة الدخول");
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.detail || "Failed to delete service");
  }

  return res.json();
}

