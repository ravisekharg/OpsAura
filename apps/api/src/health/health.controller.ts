import { Controller, Get } from '@nestjs/common'
import {
  HealthCheck, HealthCheckService, HealthIndicatorResult,
} from '@nestjs/terminus'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { InjectQueue } from '@nestjs/bull'
import { Queue } from 'bull'
import { Public } from '../common/decorators/public.decorator'
import { PlatformPrismaService } from '../database/platform-prisma.service'

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly platformDb: PlatformPrismaService,
    @InjectQueue('audit-events') private readonly auditQueue: Queue,
  ) {}

  @Public()
  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'System health — DB + Redis connectivity' })
  check() {
    return this.health.check([
      () => this.checkPlatformDb(),
      () => this.checkRedis(),
    ])
  }

  private async checkPlatformDb(): Promise<HealthIndicatorResult> {
    const key = 'platform_db'
    try {
      await (this.platformDb as any).$queryRaw`SELECT 1`
      return { [key]: { status: 'up' } }
    } catch (err) {
      return { [key]: { status: 'down', error: (err as Error).message } }
    }
  }

  private async checkRedis(): Promise<HealthIndicatorResult> {
    const key = 'redis'
    try {
      const client = this.auditQueue.client as any
      await new Promise<void>((resolve, reject) => {
        client.ping((err: Error | null) => (err ? reject(err) : resolve()))
      })
      return { [key]: { status: 'up' } }
    } catch (err) {
      return { [key]: { status: 'down', error: (err as Error).message } }
    }
  }
}
