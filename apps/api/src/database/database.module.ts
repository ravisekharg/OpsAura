import { Global, Module } from '@nestjs/common'
import { PlatformPrismaService } from './platform-prisma.service'
import { TenantPrismaFactory } from './tenant-prisma.factory'

@Global()
@Module({
  providers: [PlatformPrismaService, TenantPrismaFactory],
  exports: [PlatformPrismaService, TenantPrismaFactory],
})
export class DatabaseModule {}
