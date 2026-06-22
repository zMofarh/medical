import { API_BASE_URL } from './config';
const LOCAL_API_URL = `${API_BASE_URL}/doctors`;

export interface CMSDoctorCreate {
  doctor_id: string;
  name: string;
  specialty?: string;
  experience?: string;
  image?: string;
  rating?: number;
  reviews_count?: number;
  title?: string;
  education?: string;
  languages?: string[];
  available_days?: string[];
  bio?: string;
  specializations?: string[];
  achievements?: string[];
  consultation_fee?: string;
  reviews?: any[];
}

export interface CMSDoctorUpdate extends Partial<CMSDoctorCreate> {}

export interface CMSDoctorResponse extends CMSDoctorCreate {
  id: string;
  created_at: string;
  updated_at: string;
}

// ─── API Functions ────────────────────────────────────────────────────────────

export async function getDoctors(skip = 0, limit = 100): Promise<CMSDoctorResponse[]> {
  const res = await fetch(`${LOCAL_API_URL}/?skip=${skip}&limit=${limit}`);
  if (!res.ok) throw new Error("Failed to fetch doctors");
  return res.json();
}

export async function getDoctorById(id: string): Promise<CMSDoctorResponse> {
  const res = await fetch(`${LOCAL_API_URL}/${id}`);
  if (!res.ok) throw new Error("Failed to fetch doctor details");
  return res.json();
}

export async function createDoctor(data: CMSDoctorCreate): Promise<CMSDoctorResponse> {
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
    throw new Error(errorData?.detail || "Failed to create doctor");
  }

  return res.json();
}

export async function updateDoctor(id: string, data: CMSDoctorUpdate): Promise<CMSDoctorResponse> {
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
    throw new Error(errorData?.detail || "Failed to update doctor");
  }

  return res.json();
}

export async function deleteDoctor(id: string): Promise<{ message: string }> {
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
    throw new Error(errorData?.detail || "Failed to delete doctor");
  }

  return res.json();
}

