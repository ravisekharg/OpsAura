import { getPlatformToken } from "./platform-session"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4100/v1"

export class PlatformApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message)
  }
}

async function request<T>(
  path: string,
  options: RequestInit & { params?: Record<string, unknown> } = {},
): Promise<T> {
  const { params, ...init } = options

  let url = `${API_URL}${path}`
  if (params) {
    const q = Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== "")
      .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
      .join("&")
    if (q) url += `?${q}`
  }

  const token = getPlatformToken()
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string>),
  }
  if (token) headers["Authorization"] = `Bearer ${token}`

  const res = await fetch(url, { ...init, headers })

  if (res.status === 401) {
    // Session expired — redirect to login
    if (typeof window !== "undefined") {
      window.location.href = "/platform/login"
    }
    throw new PlatformApiError(401, "Session expired")
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new PlatformApiError(res.status, body.message ?? res.statusText)
  }

  if (res.status === 204) return undefined as T

  const json = await res.json()
  // Unwrap { data: ... } envelope
  return json.data !== undefined ? json : json
}

export const platformApi = {
  get: <T>(path: string, params?: Record<string, unknown>) =>
    request<T>(path, { method: "GET", params }),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(body) }),
  delete: <T = void>(path: string) =>
    request<T>(path, { method: "DELETE" }),
}
