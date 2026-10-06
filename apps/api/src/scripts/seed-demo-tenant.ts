/**
 * Provisions a "demo" tenant on first boot.
 * Creates the tenant DB, runs migrations, seeds an admin user.
 * Safe to re-run — all operations are idempotent.
 */
import { PrismaClient as PlatformPrisma } from '@prisma/platform-client'
import { PrismaClient as TenantPrisma } from '@prisma/tenant-client'
import * as bcrypt from 'bcryptjs'
import { execSync } from 'child_process'

const TENANT_SLUG = 'demo'
const TENANT_NAME = 'Demo Organization'
const TENANT_DB = 'tenant_demo'
const ADMIN_EMAIL = process.env.DEMO_ADMIN_EMAIL ?? 'admin@opsaura.io'
const ADMIN_PASSWORD = process.env.DEMO_ADMIN_PASSWORD ?? 'Admin@1234'
const BASE_URL = process.env.TENANT_DATABASE_BASE_URL ?? process.env.PLATFORM_DATABASE_URL?.replace('/platform_db', '') ?? ''

async function main() {
  const platformDb = new PlatformPrisma({
    datasources: { db: { url: process.env.PLATFORM_DATABASE_URL } },
  })

  // 1. Upsert tenant record in platform DB
  await platformDb.tenant.upsert({
    where: { slug: TENANT_SLUG },
    create: { slug: TENANT_SLUG, name: TENANT_NAME, status: 'ACTIVE', dbName: TENANT_DB },
    update: { status: 'ACTIVE' },
  })
  console.log(`✔ Tenant '${TENANT_SLUG}' ready in platform DB`)
  await platformDb.$disconnect()

  // 2. Create tenant DB (ignore error if already exists)
  const adminUrl = `${BASE_URL}/postgres`
  const createDb = new PlatformPrisma({ datasources: { db: { url: `${BASE_URL}/platform_db` } } })
  try {
    await createDb.$executeRawUnsafe(`CREATE DATABASE ${TENANT_DB}`)
    console.log(`✔ Database '${TENANT_DB}' created`)
  } catch {
    console.log(`ℹ Database '${TENANT_DB}' already exists`)
  }
  await createDb.$disconnect()

  // 3. Run tenant migrations
  const tenantUrl = `${BASE_URL}/${TENANT_DB}`
  execSync(`npx prisma migrate deploy --schema=prisma/tenant/schema.prisma`, {
    env: { ...process.env, TENANT_DATABASE_URL: tenantUrl },
    stdio: 'inherit',
  })
  console.log(`✔ Migrations applied to '${TENANT_DB}'`)

  // 4. Seed admin user
  const tenantDb = new TenantPrisma({ datasources: { db: { url: tenantUrl } } })

  let role = await tenantDb.role.findFirst({ where: { name: 'ADMIN' } })
  if (!role) {
    role = await tenantDb.role.create({
      data: { name: 'ADMIN', description: 'Administrator', isSystem: true },
    })
  }

  const hash = await bcrypt.hash(ADMIN_PASSWORD, 10)
  await tenantDb.user.upsert({
    where: { email: ADMIN_EMAIL },
    create: {
      email: ADMIN_EMAIL,
      name: 'Admin',
      passwordHash: hash,
      roleId: role.id,
      status: 'ACTIVE',
      mfaEnabled: false,
      forcePasswordChange: false,
    },
    update: {},
  })
  console.log(`✔ Demo admin ready: ${ADMIN_EMAIL}`)
  await tenantDb.$disconnect()
}

main().catch((e) => { console.error('Demo tenant seed failed:', e.message); process.exit(0) })
