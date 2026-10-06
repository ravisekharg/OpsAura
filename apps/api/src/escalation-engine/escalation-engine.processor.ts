import { Process, Processor } from '@nestjs/bull'
import { Logger } from '@nestjs/common'
import { Job } from 'bull'
import { TenantPrismaFactory } from '../database/tenant-prisma.factory'
import { TenantContextService } from '../tenant/tenant-context.service'
import { EscalationEngineService, type EscalationStepJob } from './escalation-engine.service'

@Processor('escalation-steps')
export class EscalationEngineProcessor {
  private readonly logger = new Logger(EscalationEngineProcessor.name)

  constructor(
    private readonly engine: EscalationEngineService,
    private readonly tenantFactory: TenantPrismaFactory,
    private readonly tenantContext: TenantContextService,
  ) {}

  @Process('execute-step')
  async handleStep(job: Job<EscalationStepJob>): Promise<void> {
    const { tenantSlug } = job.data
    const db = this.tenantFactory.getClient(tenantSlug)

    await this.tenantContext.run({ tenantSlug, db }, () =>
      this.engine.executeStep(job.data)
    )
  }
}
