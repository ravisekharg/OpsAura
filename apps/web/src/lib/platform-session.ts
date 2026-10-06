/**
 * Platform session management.
 * Uses sessionStorage (synchronous) + cookie (for middleware).
 * No Zustand, no hydration issues.
 */

const TOKEN_KEY = "opsaura_platform_token"
const USER_KEY = "opsaura_platform_user"
const COOKIE_NAME = "opsaura-platform-auth"

export interface PlatformUser {
  id: string
  email: string
  name: string
  role: string
}

export function setPlatformSession(token: string, user: PlatformUser): void {
  // 1. Cookie — read by Next.js middleware for server-side protection
  document.cookie = `${COOKIE_NAME}=${token}; path=/; max-age=900; SameSite=Lax`
  // 2. sessionStorage — read synchronously by client components (no hydration gap)
  sessionStorage.setItem(TOKEN_KEY, token)
  sessionStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function getPlatformToken(): string | null {
  try {
    return sessionStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function getPlatformUser(): PlatformUser | null {
  try {
    const raw = sessionStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function clearPlatformSession(): void {
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`
  sessionStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem(USER_KEY)
}

export function isLoggedIn(): boolean {
  return !!getPlatformToken()
}
