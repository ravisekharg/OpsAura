import { Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bull'
import { EscalationEngineService } from './escalation-engine.service'
import { EscalationEngineProcessor } from './escalation-engine.processor'

@Module({
  imports: [BullModule.registerQueue({ name: 'escalation-steps' })],
  providers: [EscalationEngineService, EscalationEngineProcessor],
  exports: [EscalationEngineService],
})
export class EscalationEngineModule {}
