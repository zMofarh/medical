export const API_BASE_URL = 'http://localhost:8000/api/contact';

export interface ContactMessageCreate {
  full_name: string;
  phone: string;
  email?: string;
  subject: string;
  message: string;
}

export interface ContactMessageResponse extends ContactMessageCreate {
  id: string;
  status: "new" | "read" | "replied" | "archived" | string;
  created_at: string;
}

// ─── Public API ─────────────────────────────────────────────────────────────

export async function submitContactMessage(data: ContactMessageCreate): Promise<{ message: string; id: string }> {
  const res = await fetch(`${API_BASE_URL}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.detail || "Failed to submit contact message");
  }

  return res.json();
}

// ─── Admin APIs ─────────────────────────────────────────────────────────────

export async function getContactMessages(skip = 0, limit = 100): Promise<ContactMessageResponse[]> {
  const token = localStorage.getItem("access_token");
  const res = await fetch(`${API_BASE_URL}/?skip=${skip}&limit=${limit}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (res.status === 401) {
    window.dispatchEvent(new CustomEvent("auth-error"));
    throw new Error("انتهت جلسة الدخول");
  }
  
  if (!res.ok) throw new Error("Failed to fetch contact messages");
  return res.json();
}

export async function updateContactStatus(id: string, status: string): Promise<ContactMessageResponse> {
  const token = localStorage.getItem("access_token");
  const res = await fetch(`${API_BASE_URL}/${id}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ status })
  });

  if (res.status === 401) {
    window.dispatchEvent(new CustomEvent("auth-error"));
    throw new Error("انتهت جلسة الدخول");
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.detail || "Failed to update contact status");
  }

  return res.json();
}

export async function deleteContactMessage(id: string): Promise<{ message: string }> {
  const token = localStorage.getItem("access_token");
  const res = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (res.status === 401) {
    window.dispatchEvent(new CustomEvent("auth-error"));
    throw new Error("انتهت جلسة الدخول");
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.detail || "Failed to delete contact message");
  }

  return res.json();
}
