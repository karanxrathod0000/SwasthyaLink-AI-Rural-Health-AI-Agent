/**
 * Centralized API fetch helper for SwasthyaLink AI.
 * Automatically handles dual authentication (Cookies + Authorization Bearer header)
 * for maximum stability across Vercel production serverless environments.
 */
export async function apiFetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const token = localStorage.getItem('swasthya_token');
  const headers = new Headers(options.headers || {});

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (!headers.has('Content-Type') && !(options.body instanceof FormData) && options.method && options.method !== 'GET') {
    headers.set('Content-Type', 'application/json');
  }

  const config: RequestInit = {
    ...options,
    headers,
    credentials: 'include',
  };

  return fetch(endpoint, config);
}
