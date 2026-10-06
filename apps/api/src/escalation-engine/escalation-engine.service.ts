import { Injectable, Logger } from '@nestjs/common'
import { InjectQueue } from '@nestjs/bull'
import { Queue } from 'bull'
import { TenantContextService } from '../tenant/tenant-context.service'

export interface EscalationStepJob {
  escalationId: string
  tenantSlug: string
  stepOrder: number
}

@Injectable()
export class EscalationEngineService {
  private readonly logger = new Logger(EscalationEngineService.name)

  constructor(
    @InjectQueue('escalation-steps') private readonly stepQueue: Queue,
    private readonly tenantContext: TenantContextService,
  ) {}

  private get db() { return this.tenantContext.getDb() }

  async startEscalation(escalationId: string, tenantSlug: string): Promise<void> {
    const db = this.tenantContext.getDb()
    const escalation = await db.escalation.findUnique({
      where: { id: escalationId },
      include: { policy: true },
    })

    if (!escalation?.policy) {
      this.logger.warn(`Escalation ${escalationId} has no policy — skipping escalation engine`)
      return
    }

    const steps = escalation.policy.steps as any[]
    if (!steps || steps.length === 0) return

    const firstStep = steps[0]
    const delayMs = (firstStep.delayMinutes ?? 5) * 60 * 1000

    await this.stepQueue.add(
      'execute-step',
      { escalationId, tenantSlug, stepOrder: 1 } as EscalationStepJob,
      { delay: delayMs, attempts: 3, backoff: { type: 'exponential', delay: 5000 } },
    )

    this.logger.log(`Escalation ${escalationId} step 1 queued — fires in ${firstStep.delayMinutes}m`)
  }

  async acknowledgeEscalation(escalationId: string): Promise<void> {
    // Remove pending step jobs for this escalation
    const jobs = await this.stepQueue.getDelayed()
    for (const job of jobs) {
      if ((job.data as EscalationStepJob).escalationId === escalationId) {
        await job.remove()
        this.logger.log(`Removed escalation step job for ${escalationId} (ACKed)`)
      }
    }
  }

  async resolveEscalation(escalationId: string): Promise<void> {
    await this.acknowledgeEscalation(escalationId)
  }

  async executeStep(job: EscalationStepJob): Promise<void> {
    const { escalationId, tenantSlug, stepOrder } = job
    const db = this.tenantContext.getDb()

    const escalation = await db.escalation.findUnique({
      where: { id: escalationId },
      include: { policy: true },
    })

    if (!escalation) return
    if (escalation.status === 'RESOLVED' || escalation.status === 'ACKNOWLEDGED') {
      this.logger.log(`Escalation ${escalationId} already ${escalation.status} — stopping chain`)
      return
    }

    const steps = escalation.policy?.steps as any[] ?? []
    const step = steps.find((s) => s.order === stepOrder)
    if (!step) return

    // Update escalation current step + status
    await db.escalation.update({
      where: { id: escalationId },
      data: { currentStep: stepOrder, status: 'ESCALATED' },
    })

    this.logger.log(
      `Escalation ${escalationId} executing step ${stepOrder}: notify ${step.type} "${step.target}" via ${step.notifyChannels?.join(',')}`,
    )

    // TODO: dispatch notification via NotificationDispatchService (Phase 2)
    // For now: log the escalation step

    // Schedule next step if exists
    const nextStep = steps.find((s) => s.order === stepOrder + 1)
    if (nextStep) {
      const delayMs = (nextStep.delayMinutes ?? 10) * 60 * 1000
      await this.stepQueue.add(
        'execute-step',
        { escalationId, tenantSlug, stepOrder: stepOrder + 1 } as EscalationStepJob,
        { delay: delayMs, attempts: 3 },
      )
    } else {
      this.logger.log(`Escalation ${escalationId} — all steps exhausted`)
    }
  }
}
