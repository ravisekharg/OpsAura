import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { BullModule } from '@nestjs/bull'
import { SubscriptionGuard } from './subscription.guard'
import { PlanLimitsService } from './plan-limits.service'
import { TrialExpiryProcessor } from './trial-expiry.processor'
import { TrialExpiryScheduler } from './trial-expiry.scheduler'
import { AuditModule } from '../audit/audit.module'

@Module({
  imports: [
    BullModule.registerQueue({ name: 'trial-expiry' }),
    AuditModule,
  ],
  providers: [
    PlanLimitsService,
    TrialExpiryProcessor,
    TrialExpiryScheduler,
    SubscriptionGuard,
    {
      // SubscriptionGuard runs globally after JwtAuthGuard + ForcePasswordChangeGuard
      provide: APP_GUARD,
      useClass: SubscriptionGuard,
    },
  ],
  exports: [PlanLimitsService],
})
export class SubscriptionEnforcementModule {}
