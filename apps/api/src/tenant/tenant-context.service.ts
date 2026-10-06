import { Injectable } from '@nestjs/common'
import { AsyncLocalStorage } from 'async_hooks'
import { PrismaClient } from '@prisma/tenant-client'

export interface TenantContext {
  tenantSlug: string
  db: PrismaClient
}

@Injectable()
export class TenantContextService {
  private readonly storage = new AsyncLocalStorage<TenantContext>()

  run<T>(context: TenantContext, fn: () => T): T {
    return this.storage.run(context, fn)
  }

  getContext(): TenantContext {
    const context = this.storage.getStore()
    if (!context) {
      throw new Error(
        'TenantContext not set — ensure TenantMiddleware is applied to this route',
      )
    }
    return context
  }

  getDb(): PrismaClient {
    return this.getContext().db
  }

  getTenantSlug(): string {
    return this.getContext().tenantSlug
  }

  hasContext(): boolean {
    return !!this.storage.getStore()
  }
}
