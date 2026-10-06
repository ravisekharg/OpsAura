import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
  Logger,
} from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import * as jwt from 'jsonwebtoken'
import { TenantContextService } from './tenant-context.service'
import { TenantPrismaFactory } from '../database/tenant-prisma.factory'
import { PlatformPrismaService } from '../database/platform-prisma.service'
import type { JwtPayload } from '../common/interfaces/request-user.interface'

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  private readonly logger = new Logger(TenantMiddleware.name)

  constructor(
    private readonly tenantContext: TenantContextService,
    private readonly tenantFactory: TenantPrismaFactory,
    private readonly platformDb: PlatformPrismaService,
  ) {}

  async use(req: Request, _res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization

    if (!authHeader?.startsWith('Bearer ')) {
      return next()
    }

    const token = authHeader.split(' ')[1]

    let tenantSlug: string | undefined

    try {
      // Decode without verification — JwtStrategy performs full validation
      // We only need tenant slug for DB routing at this stage
      const decoded = jwt.decode(token) as JwtPayload | null
      tenantSlug = decoded?.tenantSlug
    } catch {
      return next()
    }

    if (!tenantSlug) {
      return next()
    }

    // Platform admins have tenantSlug="platform" — no tenant DB needed
    if (tenantSlug === 'platform') {
      return next()
    }

    // Verify tenant is active in platform DB
    const tenant = await this.platformDb.tenant.findUnique({
      where: { slug: tenantSlug },
      select: { status: true, slug: true },
    })

    if (!tenant) {
      throw new UnauthorizedException('Tenant not found')
    }

    if (tenant.status === 'SUSPENDED' || tenant.status === 'CANCELLED') {
      throw new UnauthorizedException(
        `Tenant account is ${tenant.status.toLowerCase()}`,
      )
    }

    const db = this.tenantFactory.getClient(tenantSlug)

    // Run the rest of the request within the tenant context
    this.tenantContext.run({ tenantSlug, db }, () => next())
  }
}
