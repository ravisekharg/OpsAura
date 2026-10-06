import { Module } from '@nestjs/common'
import { UsersController } from './users.controller'
import { RolesController } from './roles.controller'
import { UsersService } from './users.service'
import { UsersRepository } from './users.repository'
import { SubscriptionEnforcementModule } from '../subscription-enforcement/subscription-enforcement.module'

@Module({
  imports: [SubscriptionEnforcementModule],
  controllers: [UsersController, RolesController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
