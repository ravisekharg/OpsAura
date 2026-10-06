import { Process, Processor } from '@nestjs/bull'
import { Logger } from '@nestjs/common'
import { Job } from 'bull'
import { PlatformPrismaService } from '../database/platform-prisma.service'
import { AuditService } from '../audit/audit.service'

const TRIAL_DAYS = 14

@Processor('trial-expiry')
export class TrialExpiryProcessor {
  private readonly logger = new Logger(TrialExpiryProcessor.name)

  constructor(
    private readonly platformDb: PlatformPrismaService,
    private readonly auditService: AuditService,
  ) {}

  @Process('check-trials')
  async checkExpiredTrials(_job: Job): Promise<void> {
    const trialCutoff = new Date(Date.now() - TRIAL_DAYS * 24 * 60 * 60 * 1000)

    const expired = await this.platformDb.subscription.findMany({
      where: {
        status: 'TRIALING',
        startsAt: { lte: trialCutoff },
      },
      include: {
        tenant: { select: { id: true, slug: true, name: true } },
        plan: { select: { name: true } },
      },
    })

    if (expired.length === 0) {
      this.logger.debug('Trial expiry check: no expired trials')
      return
    }

    this.logger.log(`Trial expiry: ${expired.length} subscription(s) to expire`)

    for (const sub of expired) {
      await this.platformDb.subscription.update({
        where: { id: sub.id },
        data: { status: 'PAST_DUE' },
      })

      await this.auditService.emit({
        category: 'tenant',
        action: 'TRIAL_EXPIRED',
        tenantSlug: 'platform',
        actorId: undefined,
        actorEmail: 'system@opsaura.io',
        target: sub.tenant.slug,
        detail: `Trial expired for tenant "${sub.tenant.name}" on plan "${sub.plan.name}"`,
        severity: 'WARNING',
      })

      this.logger.warn(`Trial expired: tenant=${sub.tenant.slug} plan=${sub.plan.name}`)
      // TODO: dispatch email to tenant admin via notification queue
    }
  }
}
