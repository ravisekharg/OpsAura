const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4100/v1'

function getToken(): string | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem('opsaura-auth')
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed?.state?.token ?? null
  } catch {
    return null
  }
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message)
  }
}

async function request<T>(
  path: string,
  options: RequestInit & { params?: Record<string, string | number | boolean | undefined> } = {},
): Promise<T> {
  const { params, ...init } = options

  let url = `${API_URL}${path}`

  if (params) {
    const query = Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== '')
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
      .join('&')
    if (query) url += `?${query}`
  }

  const token = getToken()

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string>),
  }

  if (token) headers['Authorization'] = `Bearer ${token}`

  const tenantSlug = getTenantSlug()
  if (tenantSlug) headers['X-Tenant-Slug'] = tenantSlug

  const res = await fetch(url, { ...init, headers, credentials: 'include' })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new ApiError(res.status, body.message ?? res.statusText, body.details)
  }

  if (res.status === 204) return undefined as T

  const json = await res.json()
  // Backend wraps responses in { data, meta }
  return json.data !== undefined ? json : json
}

function getTenantSlug(): string | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem('opsaura-auth')
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed?.state?.user?.tenantSlug ?? null
  } catch {
    return null
  }
}

export const api = {
  get: <T>(path: string, params?: Record<string, string | number | boolean | undefined>) =>
    request<T>(path, { method: 'GET', params }),

  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),

  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),

  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),

  delete: <T = void>(path: string) =>
    request<T>(path, { method: 'DELETE' }),
}
