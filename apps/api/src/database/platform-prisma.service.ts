import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaClient } from '@prisma/platform-client'

@Injectable()
export class PlatformPrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PlatformPrismaService.name)

  constructor(private readonly config: ConfigService) {
    super({
      datasources: {
        db: { url: config.get<string>('PLATFORM_DATABASE_URL') },
      },
      log:
        config.get('NODE_ENV') === 'development'
          ? ['query', 'warn', 'error']
          : ['warn', 'error'],
    })
  }

  async onModuleInit() {
    await this.$connect()
    this.logger.log('Platform database connected')
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }
}
