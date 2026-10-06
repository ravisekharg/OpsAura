import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { NotificationChannelsController } from './notification-channels.controller'
import { NotificationChannelsService } from './notification-channels.service'

@Module({
  imports: [ConfigModule],
  controllers: [NotificationChannelsController],
  providers: [NotificationChannelsService],
  exports: [NotificationChannelsService],
})
export class NotificationChannelsModule {}
