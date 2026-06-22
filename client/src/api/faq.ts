import { API_BASE_URL } from './config';
const LOCAL_API_URL = `${API_BASE_URL}/faqs`;
export const CATEGORY_API_BASE_URL = `${API_BASE_URL}/faq-categories`;

import { FAQItem, FAQCategory } from "@/mocks/faqData";

// ─── Categories ───────────────────────────────────────────────────────────────

export async function getFaqCategories(): Promise<FAQCategory[]> {
  const res = await fetch(CATEGORY_API_BASE_URL);
  if (!res.ok) throw new Error("Failed to fetch FAQ categories");
  return res.json();
}

export async function createFaqCategory(data: FAQCategory): Promise<FAQCategory> {
  const token = localStorage.getItem("access_token");
  const res = await fetch(`${CATEGORY_API_BASE_URL}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });
  if (res.status === 401) { window.dispatchEvent(new CustomEvent("auth-error")); throw new Error("انتهت جلسة الدخول"); }
  if (!res.ok) { const err = await res.json().catch(()=>null); throw new Error(err?.detail || "Failed to create category"); }
  return res.json();
}

export async function updateFaqCategory(id: string, data: FAQCategory): Promise<FAQCategory> {
  const token = localStorage.getItem("access_token");
  const res = await fetch(`${CATEGORY_API_BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });
  if (res.status === 401) { window.dispatchEvent(new CustomEvent("auth-error")); throw new Error("انتهت جلسة الدخول"); }
  if (!res.ok) { const err = await res.json().catch(()=>null); throw new Error(err?.detail || "Failed to update category"); }
  return res.json();
}

export async function deleteFaqCategory(id: string): Promise<{ message: string }> {
  const token = localStorage.getItem("access_token");
  const res = await fetch(`${CATEGORY_API_BASE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    },
  });
  if (res.status === 401) { window.dispatchEvent(new CustomEvent("auth-error")); throw new Error("انتهت جلسة الدخول"); }
  if (!res.ok) { const err = await res.json().catch(()=>null); throw new Error(err?.detail || "Failed to delete category"); }
  return res.json();
}

// ─── FAQs ─────────────────────────────────────────────────────────────────────

export async function getFaqs(category?: string): Promise<FAQItem[]> {
  const url = category ? `${LOCAL_API_URL}?category=${category}` : `${LOCAL_API_URL}/`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch FAQs");
  return res.json();
}

export async function createFaq(data: FAQItem): Promise<FAQItem> {
  const token = localStorage.getItem("access_token");
  const res = await fetch(`${LOCAL_API_URL}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });
  if (res.status === 401) { window.dispatchEvent(new CustomEvent("auth-error")); throw new Error("انتهت جلسة الدخول"); }
  if (!res.ok) { const err = await res.json().catch(()=>null); throw new Error(err?.detail || "Failed to create FAQ"); }
  return res.json();
}

export async function updateFaq(id: string, data: FAQItem): Promise<FAQItem> {
  const token = localStorage.getItem("access_token");
  const res = await fetch(`${LOCAL_API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });
  if (res.status === 401) { window.dispatchEvent(new CustomEvent("auth-error")); throw new Error("انتهت جلسة الدخول"); }
  if (!res.ok) { const err = await res.json().catch(()=>null); throw new Error(err?.detail || "Failed to update FAQ"); }
  return res.json();
}

export async function deleteFaq(id: string): Promise<{ message: string }> {
  const token = localStorage.getItem("access_token");
  const res = await fetch(`${LOCAL_API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    },
  });
  if (res.status === 401) { window.dispatchEvent(new CustomEvent("auth-error")); throw new Error("انتهت جلسة الدخول"); }
  if (!res.ok) { const err = await res.json().catch(()=>null); throw new Error(err?.detail || "Failed to delete FAQ"); }
  return res.json();
}

// ─── Mass Save ────────────────────────────────────────────────────────────────

export async function massSaveFaqs(newFaqs: FAQItem[], oldFaqs: FAQItem[], newCats: FAQCategory[], oldCats: FAQCategory[]): Promise<void> {
  const oldCatsMap = new Map(oldCats.map(c => [c.id, c]));
  const newCatsMap = new Map(newCats.map(c => [c.id, c]));

  console.log("Mass saving FAQs. Old cats:", oldCats.length, "New cats:", newCats.length);

  for (const c of oldCats) {
    if (!newCatsMap.has(c.id)) {
      try { await deleteFaqCategory(c.id); } catch (e) { console.error("Failed to delete category", c.id, e); }
    }
  }
  for (const c of newCats) {
    if (!oldCatsMap.has(c.id)) {
      try { await createFaqCategory(c); } catch (e) { console.error("Failed to create category", c.id, e); }
    } else {
      try { 
        await updateFaqCategory(c.id, c); 
      } catch (e: any) { 
        console.error("Failed to update category", c.id, e);
        // If update failed (e.g. 404), try create
        if (e.message && e.message.toLowerCase().includes("not found")) {
          try { await createFaqCategory(c); } catch (err) { console.error("Fallback create category failed", c.id, err); }
        }
      }
    }
  }

  const oldFaqsMap = new Map(oldFaqs.map(f => [f.id, f]));
  const newFaqsMap = new Map(newFaqs.map(f => [f.id, f]));

  console.log("Old FAQs:", oldFaqs.length, "New FAQs:", newFaqs.length);

  for (const f of oldFaqs) {
    if (!newFaqsMap.has(f.id)) {
      try { await deleteFaq(f.id); } catch (e) { console.error("Failed to delete FAQ", f.id, e); }
    }
  }
  for (const f of newFaqs) {
    // Only update if something changed, but since we don't do deep equality, we just update everything that exists
    // However, to optimize, we can just do it.
    if (!oldFaqsMap.has(f.id)) {
      try { await createFaq(f); } catch (e) { console.error("Failed to create FAQ", f.id, e); }
    } else {
      try { 
        await updateFaq(f.id, f); 
      } catch (e: any) { 
        console.error("Failed to update FAQ", f.id, e);
        if (e.message && e.message.toLowerCase().includes("not found")) {
          try { await createFaq(f); } catch (err) { console.error("Fallback create FAQ failed", f.id, err); }
        }
      }
    }
  }
}

