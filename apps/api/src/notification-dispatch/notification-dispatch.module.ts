import { Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bull'
import { NotificationDispatchService } from './notification-dispatch.service'
import { NotificationDispatchProcessor } from './notification-dispatch.processor'

@Module({
  imports: [BullModule.registerQueue({ name: 'notification-dispatch' })],
  providers: [NotificationDispatchService, NotificationDispatchProcessor],
  exports: [NotificationDispatchService],
})
export class NotificationDispatchModule {}
