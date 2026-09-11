const API_BASE = import.meta.env.VITE_API_BASE || '/api';

export async function fetchProblems() {
  const res = await fetch(`${API_BASE}/problems`);
  if (!res.ok) throw new Error(`Failed to fetch problems (${res.status})`);
  const json = await res.json();
  return json.data;
}

export async function fetchProblemBySlug(slug) {
  const res = await fetch(`${API_BASE}/problems/${slug}`);
  if (!res.ok) throw new Error(`Failed to fetch problem "${slug}" (${res.status})`);
  const json = await res.json();
  return json.data;
}

export async function startOrGetAttempt(problemSlug, userId = 'anonymous-learner', forceNew = false) {
  const res = await fetch(`${API_BASE}/attempts/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ problemSlug, userId, forceNew }),
  });
  if (!res.ok) throw new Error(`Failed to start attempt for "${problemSlug}" (${res.status})`);
  const json = await res.json();
  return json.data;
}

export async function fetchAttempt(id) {
  const res = await fetch(`${API_BASE}/attempts/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch attempt "${id}" (${res.status})`);
  const json = await res.json();
  return json.data;
}

export async function saveDraft(attemptId, draft) {
  const res = await fetch(`${API_BASE}/attempts/${attemptId}/draft`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(draft),
  });
  if (!res.ok) throw new Error(`Failed to save draft (${res.status})`);
  const json = await res.json();
  return json.data;
}

export async function submitAttempt(attemptId, content) {
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

export async function fetchHistory(userId = 'anonymous-learner') {
  const res = await fetch(`${API_BASE}/attempts/history?userId=${encodeURIComponent(userId)}`);
  if (!res.ok) throw new Error(`Failed to fetch attempt history (${res.status})`);
  const json = await res.json();
  return json.data;
}
