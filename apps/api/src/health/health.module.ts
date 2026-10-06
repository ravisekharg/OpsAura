import { Module } from '@nestjs/common'
import { TerminusModule } from '@nestjs/terminus'
import { BullModule } from '@nestjs/bull'
import { HealthController } from './health.controller'
import { DatabaseModule } from '../database/database.module'

@Module({
  imports: [
    TerminusModule,
    DatabaseModule,
    BullModule.registerQueue({ name: 'audit-events' }),
  ],
  controllers: [HealthController],
})
export class HealthModule {}
