import { Module } from '@nestjs/common'
import { ServicesController } from './services.controller'
import { ServicesService } from './services.service'
import { ServicesRepository } from './services.repository'
import { SubscriptionEnforcementModule } from '../subscription-enforcement/subscription-enforcement.module'

@Module({
  imports: [SubscriptionEnforcementModule],
  controllers: [ServicesController],
  providers: [ServicesService, ServicesRepository],
  exports: [ServicesService],
})
export class ServicesModule {}
