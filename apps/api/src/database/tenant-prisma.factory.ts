import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaClient } from '@prisma/tenant-client'

@Injectable()
export class TenantPrismaFactory implements OnModuleDestroy {
  private readonly logger = new Logger(TenantPrismaFactory.name)
  private readonly clients = new Map<string, PrismaClient>()
  private readonly baseUrl: string

  constructor(private readonly config: ConfigService) {
    this.baseUrl = config.get<string>(
      'TENANT_DATABASE_BASE_URL',
      'postgresql://opsaura:password@localhost:5432',
    )
  }

  getClient(tenantSlug: string): PrismaClient {
    if (this.clients.has(tenantSlug)) {
      return this.clients.get(tenantSlug)!
    }

    const dbName = `tenant_${tenantSlug}`
    const url = `${this.baseUrl}/${dbName}`

    const client = new PrismaClient({
      datasources: { db: { url } },
      log: ['warn', 'error'],
    })

    this.clients.set(tenantSlug, client)
    this.logger.debug(`Created PrismaClient for tenant: ${tenantSlug}`)

    return client
  }

  async createTenantDatabase(tenantSlug: string): Promise<void> {
    const dbName = `tenant_${tenantSlug}`

    // Connect to postgres default db to run CREATE DATABASE
    const adminClient = new PrismaClient({
      datasources: { db: { url: `${this.baseUrl}/postgres` } },
    })

    try {
      await adminClient.$executeRawUnsafe(`CREATE DATABASE "${dbName}"`)
      this.logger.log(`Created database: ${dbName}`)
    } catch (err: any) {
      // Ignore "database already exists" — idempotent provisioning
      if (!err?.message?.includes('already exists')) throw err
      this.logger.warn(`Database ${dbName} already exists — skipping CREATE`)
    } finally {
      await adminClient.$disconnect()
    }
  }

  async disconnectTenant(tenantSlug: string): Promise<void> {
    const client = this.clients.get(tenantSlug)
    if (client) {
      await client.$disconnect()
      this.clients.delete(tenantSlug)
    }
  }

  async onModuleDestroy() {
    const disconnects = Array.from(this.clients.values()).map((c) =>
      c.$disconnect(),
    )
    await Promise.all(disconnects)
    this.logger.log(`Disconnected ${this.clients.size} tenant DB clients`)
  }
}
