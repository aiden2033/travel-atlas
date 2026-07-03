const configuredBaseUrl = import.meta.env.VITE_SYNC_API_URL ?? 'http://127.0.0.1:3001';

export const SYNC_API_BASE_URL = configuredBaseUrl.replace(/\/$/, '');

export class SyncApiError extends Error {
  status: number;
  payload: unknown;

  constructor(status: number, payload: unknown) {
    super(`Sync API request failed with ${status}`);
    this.status = status;
    this.payload = payload;
  }
}

const csrfToken = (): string | undefined => {
  const match = document.cookie
    .split('; ')
    .find((part) => part.startsWith('jt_csrf='));
  return match ? decodeURIComponent(match.slice('jt_csrf='.length)) : undefined;
};

interface ApiFetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  signal?: AbortSignal;
}

export const apiFetch = async <T>(path: string, options: ApiFetchOptions = {}): Promise<T> => {
  const method = options.method ?? 'GET';
  const headers: Record<string, string> = {};
  if (options.body !== undefined) headers['Content-Type'] = 'application/json';
  if (method !== 'GET') {
    const token = csrfToken();
    if (token) headers['X-CSRF-Token'] = token;
  }

  const response = await fetch(`${SYNC_API_BASE_URL}${path}`, {
    method,
    credentials: 'include',
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    signal: options.signal,
  });

  const contentType = response.headers.get('content-type') ?? '';
  const payload = contentType.includes('application/json') ? await response.json() : await response.text();
  if (!response.ok) throw new SyncApiError(response.status, payload);
  return payload as T;
};
