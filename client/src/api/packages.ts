import { API_BASE_URL } from './config';
const LOCAL_API_URL = `${API_BASE_URL}/packages`;

export interface CMSPackageCreate {
  package_id: string;
  name: string;
  category: string;
  price: number;
  original_price?: number;
  badge?: string;
  icon?: string;
  features?: any[];
  accent_color?: string;
  description?: string;
  duration?: string;
  target_audience?: string;
  preparation?: string[];
  includes?: { label: string; icon: string }[];
  faqs?: any[];
}

export interface CMSPackageUpdate extends Partial<CMSPackageCreate> {}

export interface CMSPackageResponse extends CMSPackageCreate {
  id: string;
  created_at: string;
  updated_at: string;
}

// ─── API Functions ────────────────────────────────────────────────────────────

export async function getPackages(skip = 0, limit = 100): Promise<CMSPackageResponse[]> {
  const res = await fetch(`${LOCAL_API_URL}/?skip=${skip}&limit=${limit}`);
  if (!res.ok) throw new Error("Failed to fetch packages");
  return res.json();
}

export async function getPackageById(id: string): Promise<CMSPackageResponse> {
  const res = await fetch(`${LOCAL_API_URL}/${id}`);
  if (!res.ok) throw new Error("Failed to fetch package details");
  return res.json();
}

export async function createPackage(data: CMSPackageCreate): Promise<CMSPackageResponse> {
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
    throw new Error(errorData?.detail || "Failed to create package");
  }

  return res.json();
}

export async function updatePackage(id: string, data: CMSPackageUpdate): Promise<CMSPackageResponse> {
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
    throw new Error(errorData?.detail || "Failed to update package");
  }

  return res.json();
}

export async function deletePackage(id: string): Promise<{ message: string }> {
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
    throw new Error(errorData?.detail || "Failed to delete package");
  }

  return res.json();
}

