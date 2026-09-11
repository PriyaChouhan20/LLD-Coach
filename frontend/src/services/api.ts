import { Problem, Attempt, SubmissionContent, Submission, EvaluationResult } from '../types';

const API_BASE = '/api';

export async function fetchProblems(): Promise<Problem[]> {
  const res = await fetch(`${API_BASE}/problems`);
  if (!res.ok) throw new Error(`Failed to fetch problems (${res.status})`);
  const json = await res.json();
  return json.data;
}

export async function fetchProblemBySlug(slug: string): Promise<Problem> {
  const res = await fetch(`${API_BASE}/problems/${slug}`);
  if (!res.ok) throw new Error(`Failed to fetch problem "${slug}" (${res.status})`);
  const json = await res.json();
  return json.data;
}

export async function startOrGetAttempt(
  problemSlug: string,
  userId: string = 'anonymous-learner',
  forceNew: boolean = false
): Promise<Attempt> {
  const res = await fetch(`${API_BASE}/attempts/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ problemSlug, userId, forceNew }),
  });
  if (!res.ok) throw new Error(`Failed to start attempt for "${problemSlug}" (${res.status})`);
  const json = await res.json();
  return json.data;
}

export async function fetchAttempt(id: string): Promise<Attempt> {
  const res = await fetch(`${API_BASE}/attempts/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch attempt "${id}" (${res.status})`);
  const json = await res.json();
  return json.data;
}

export async function saveDraft(attemptId: string, draft: Partial<SubmissionContent>): Promise<Attempt> {
  const res = await fetch(`${API_BASE}/attempts/${attemptId}/draft`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(draft),
  });
  if (!res.ok) throw new Error(`Failed to save draft (${res.status})`);
  const json = await res.json();
  return json.data;
}

export async function submitAttempt(
  attemptId: string,
  content: SubmissionContent
): Promise<{ attempt: Attempt; submission: Submission; evaluationResult: EvaluationResult }> {
  const res = await fetch(`${API_BASE}/attempts/${attemptId}/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(content),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to submit solution (${res.status})`);
  }
  const json = await res.json();
  return json.data;
}

export async function fetchHistory(userId: string = 'anonymous-learner'): Promise<Attempt[]> {
  const res = await fetch(`${API_BASE}/attempts/history?userId=${encodeURIComponent(userId)}`);
  if (!res.ok) throw new Error(`Failed to fetch attempt history (${res.status})`);
  const json = await res.json();
  return json.data;
}
