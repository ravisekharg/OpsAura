import { Module } from '@nestjs/common'
import { WarRoomsController, WarRoomTemplatesController } from './war-rooms.controller'
import { WarRoomsService } from './war-rooms.service'
import { WarRoomsRepository } from './war-rooms.repository'

@Module({
  controllers: [WarRoomsController, WarRoomTemplatesController],
  providers: [WarRoomsService, WarRoomsRepository],
  exports: [WarRoomsService],
})
export class WarRoomsModule {}
