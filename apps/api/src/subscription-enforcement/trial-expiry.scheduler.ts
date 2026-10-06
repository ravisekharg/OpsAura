import { Injectable, OnModuleInit, Logger } from '@nestjs/common'
import { InjectQueue } from '@nestjs/bull'
import { Queue } from 'bull'

@Injectable()
export class TrialExpiryScheduler implements OnModuleInit {
  private readonly logger = new Logger(TrialExpiryScheduler.name)

  constructor(
    @InjectQueue('trial-expiry') private readonly queue: Queue,
  ) {}

  async onModuleInit() {
    // Remove stale repeatable jobs from previous deployments
    const existing = await this.queue.getRepeatableJobs()
    for (const job of existing) {
      await this.queue.removeRepeatableByKey(job.key)
    }

    // Schedule: every hour
    await this.queue.add(
      'check-trials',
      {},
      {
        repeat: { cron: '0 * * * *' }, // every hour at :00
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
      },
    )

    this.logger.log('Trial expiry cron scheduled — runs every hour')
  }
}
