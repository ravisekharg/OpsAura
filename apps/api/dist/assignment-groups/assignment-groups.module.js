"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssignmentGroupsModule = void 0;
const common_1 = require("@nestjs/common");
const assignment_groups_controller_1 = require("./assignment-groups.controller");
const assignment_groups_service_1 = require("./assignment-groups.service");
const assignment_groups_repository_1 = require("./assignment-groups.repository");
let AssignmentGroupsModule = class AssignmentGroupsModule {
};
exports.AssignmentGroupsModule = AssignmentGroupsModule;
exports.AssignmentGroupsModule = AssignmentGroupsModule = __decorate([
    (0, common_1.Module)({
        controllers: [assignment_groups_controller_1.AssignmentGroupsController, assignment_groups_controller_1.RoutingRulesController],
        providers: [assignment_groups_service_1.AssignmentGroupsService, assignment_groups_repository_1.AssignmentGroupsRepository],
        exports: [assignment_groups_service_1.AssignmentGroupsService],
    })
], AssignmentGroupsModule);
//# sourceMappingURL=assignment-groups.module.js.map