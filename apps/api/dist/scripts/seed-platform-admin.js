"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const platform_client_1 = require("@prisma/platform-client");
const bcrypt = require("bcrypt");
async function main() {
    const db = new platform_client_1.PrismaClient({
        datasources: { db: { url: process.env.PLATFORM_DATABASE_URL } },
    });
    const email = process.env.PLATFORM_ADMIN_EMAIL ?? 'admin@opsaura.io';
    const password = process.env.PLATFORM_ADMIN_PASSWORD ?? 'Admin@1234';
    const hash = await bcrypt.hash(password, 10);
    await db.platformUser.upsert({
        where: { email },
        create: { email, name: 'Platform Admin', passwordHash: hash, role: 'SUPER_ADMIN', active: true },
        update: {},
    });
    console.log(`✔ Platform admin ready: ${email}`);
    await db.$disconnect();
}
main().catch((e) => { console.error(e); process.exit(0); });
//# sourceMappingURL=seed-platform-admin.js.map