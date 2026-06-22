import { API_BASE_URL } from './config';

const DNA_API_URL = `${API_BASE_URL}/dna-config`;

export interface DNAQuestion {
  id?: string;
  question_id: string;
  category: string;
  question_text: string;
  options: any[];
  order_index?: string;
}

export interface DNAResultTemplate {
  id?: string;
  template_id: string;
  risk_level: string;
  recommended_package?: string;
  content?: string;
}

export async function getDNAQuestions(): Promise<DNAQuestion[]> {
  const res = await fetch(`${DNA_API_URL}/questions`);
  if (!res.ok) throw new Error("Failed to fetch DNA questions");
  return res.json();
}

export async function getDNATemplates(): Promise<DNAResultTemplate[]> {
  const res = await fetch(`${DNA_API_URL}/templates`);
  if (!res.ok) throw new Error("Failed to fetch DNA templates");
  return res.json();
}

export async function updateDNAQuestion(questionId: string, data: Partial<DNAQuestion>, token: string): Promise<DNAQuestion> {
  const res = await fetch(`${DNA_API_URL}/questions/${questionId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update DNA question");
  return res.json();
}

export interface DNAEvaluationResponse {
  id: string;
  patient_name: string | null;
  patient_age: number | null;
  patient_email: string | null;
  patient_phone: string | null;
  overall_score: number;
  risk_level: string;
  answers: Record<string, any>;
  report_content: Record<string, any>;
  status: string;
  notes: string;
  created_at: string;
}

export async function getDNAEvaluations(token: string): Promise<DNAEvaluationResponse[]> {
  const res = await fetch(`${DNA_API_URL}/evaluations`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error("Failed to fetch DNA evaluations");
  return res.json();
}

export async function updateDNAEvaluation(evalId: string, data: { status?: string; notes?: string }, token: string): Promise<DNAEvaluationResponse> {
  const res = await fetch(`${DNA_API_URL}/evaluations/${evalId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update DNA evaluation");
  return res.json();
}

