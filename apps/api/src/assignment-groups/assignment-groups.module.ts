import { Module } from '@nestjs/common'
import {
  AssignmentGroupsController,
  RoutingRulesController,
} from './assignment-groups.controller'
import { AssignmentGroupsService } from './assignment-groups.service'
import { AssignmentGroupsRepository } from './assignment-groups.repository'

@Module({
  controllers: [AssignmentGroupsController, RoutingRulesController],
  providers: [AssignmentGroupsService, AssignmentGroupsRepository],
  exports: [AssignmentGroupsService],
})
export class AssignmentGroupsModule {}
