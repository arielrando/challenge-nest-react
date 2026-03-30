/**
 * El backend envuelve respuestas OK en { isSuccess, data, ... }.
 */
export async function apiCall(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(path, {
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
