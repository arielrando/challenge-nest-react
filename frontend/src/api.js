/**
 * El backend envuelve respuestas OK en { isSuccess, data, ... }.
 */
const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || '')
  .trim()
  .replace(/\/+$/, '');

export function buildApiUrl(path) {
  if (!apiBaseUrl) return path;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${apiBaseUrl}${normalizedPath}`;
}

export async function apiCall(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(buildApiUrl(path), {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      json.errors?.join?.(', ') ||
      json.message ||
      res.statusText ||
      'Request failed';
    throw new Error(msg);
  }
  if (json.isSuccess === false) {
    const msg = json.errors?.join?.(', ') || json.message || 'API error';
    throw new Error(msg);
  }
  return json.data;
}
