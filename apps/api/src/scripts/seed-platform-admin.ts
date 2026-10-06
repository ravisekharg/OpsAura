/**
 * Run once at container boot to ensure a platform super-admin exists.
 * Safe to re-run — uses upsert.
 *
 * Credentials (override via env):
 *   PLATFORM_ADMIN_EMAIL    default: admin@opsaura.io
 *   PLATFORM_ADMIN_PASSWORD default: Admin@1234
 */
import { PrismaClient } from '@prisma/platform-client'
import * as bcrypt from 'bcryptjs'

async function main() {
  const db = new PrismaClient({
    datasources: { db: { url: process.env.PLATFORM_DATABASE_URL } },
  })

  const email = process.env.PLATFORM_ADMIN_EMAIL ?? 'admin@opsaura.io'
  const password = process.env.PLATFORM_ADMIN_PASSWORD ?? 'Admin@1234'
  const hash = await bcrypt.hash(password, 10)

  await db.platformUser.upsert({
    where: { email },
    create: { email, name: 'Platform Admin', passwordHash: hash, role: 'SUPER_ADMIN', active: true },
    update: {},
  })

  console.log(`✔ Platform admin ready: ${email}`)
  await db.$disconnect()
}

main().catch((e) => { console.error(e); process.exit(0) })
