import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-custom'
import { Request } from 'express'
import { ApiKeysService } from '../api-keys.service'

export const API_KEY_STRATEGY = 'api-key'

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(Strategy, API_KEY_STRATEGY) {
  constructor(private readonly apiKeysService: ApiKeysService) {
    super()
  }

  async validate(req: Request) {
    const rawKey = req.headers['x-api-key'] as string | undefined
    if (!rawKey) throw new UnauthorizedException('x-api-key header required')

    const tenantSlug = req.headers['x-tenant-slug'] as string | undefined
    if (!tenantSlug) throw new UnauthorizedException('x-tenant-slug header required')

    return this.apiKeysService.validateKey(rawKey, tenantSlug)
  }
}
