export interface RequestUser {
  id: string
  email: string
  name: string
  tenantSlug: string
  role: string
  permissions: string[]
  requiresPasswordChange?: boolean
}

export interface JwtPayload {
  sub: string
  email: string
  name: string
  tenantSlug: string
  role: string
  permissions: string[]
  iat?: number
  exp?: number
}
