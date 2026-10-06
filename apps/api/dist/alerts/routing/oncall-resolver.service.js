"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var OnCallResolverService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnCallResolverService = void 0;
const common_1 = require("@nestjs/common");
const tenant_context_service_1 = require("../../tenant/tenant-context.service");
let OnCallResolverService = OnCallResolverService_1 = class OnCallResolverService {
    constructor(tenantContext) {
        this.tenantContext = tenantContext;
        this.logger = new common_1.Logger(OnCallResolverService_1.name);
    }
    get db() {
        return this.tenantContext.getDb();
    }
    async resolveOnCall(assignmentGroupId) {
        const empty = {
            userId: null,
            userName: null,
            userEmail: null,
            scheduleName: null,
            isOverride: false,
            rotationName: null,
        };
        const group = await this.db.assignmentGroup.findUnique({
            where: { id: assignmentGroupId },
            include: { team: true },
        });
        if (!group || !group.teamId) {
            this.logger.warn(`No team found for assignment group ${assignmentGroupId}`);
            return empty;
        }
        const schedules = await this.db.schedule.findMany({
            where: { teamId: group.teamId, active: true },
            include: {
                rotations: { where: { active: true } },
                overrides: {
                    where: {
                        startAt: { lte: new Date() },
                        endAt: { gte: new Date() },
                    },
                    include: {
                        overrideUser: { select: { id: true, name: true, email: true } },
                    },
                    orderBy: { startAt: 'desc' },
                    take: 1,
                },
            },
        });
        if (schedules.length === 0) {
            this.logger.warn(`No active schedules for team ${group.teamId}`);
            return empty;
        }
        const schedule = schedules[0];
        if (schedule.overrides.length > 0) {
            const override = schedule.overrides[0];
            this.logger.debug(`Override active for schedule "${schedule.name}" → ${override.overrideUser.name}`);
            return {
                userId: override.overrideUser.id,
                userName: override.overrideUser.name,
                userEmail: override.overrideUser.email,
                scheduleName: schedule.name,
                isOverride: true,
                rotationName: null,
            };
        }
        if (schedule.rotations.length === 0) {
            this.logger.warn(`No active rotations for schedule "${schedule.name}"`);
            return { ...empty, scheduleName: schedule.name };
        }
        const rotation = schedule.rotations[0];
        const members = rotation.members;
        if (!members || members.length === 0) {
            this.logger.warn(`Rotation "${rotation.name}" has no members`);
            return { ...empty, scheduleName: schedule.name };
        }
        const currentMember = this.resolveCurrentMember(members, rotation.type, rotation.handoffTime);
        if (!currentMember) {
            return { ...empty, scheduleName: schedule.name, rotationName: rotation.name };
        }
        this.logger.debug(`On-call resolved: schedule="${schedule.name}" rotation="${rotation.name}" user="${currentMember.name}"`);
        return {
            userId: currentMember.userId,
            userName: currentMember.name,
            userEmail: currentMember.email,
            scheduleName: schedule.name,
            isOverride: false,
            rotationName: rotation.name,
        };
    }
    resolveCurrentMember(members, type, handoffTime) {
        if (members.length === 0)
            return null;
        const now = new Date();
        const epochRef = new Date('2025-01-06T00:00:00Z').getTime();
        const msNow = now.getTime();
        const elapsed = msNow - epochRef;
        let periodMs;
        switch (type) {
            case 'DAILY':
                periodMs = 24 * 60 * 60 * 1000;
                break;
            case 'WEEKLY':
            default:
                periodMs = 7 * 24 * 60 * 60 * 1000;
                break;
        }
        const periodIndex = Math.floor(elapsed / periodMs);
        const memberIndex = Math.abs(periodIndex) % members.length;
        return members[memberIndex] ?? members[0];
    }
};
exports.OnCallResolverService = OnCallResolverService;
exports.OnCallResolverService = OnCallResolverService = OnCallResolverService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_context_service_1.TenantContextService])
], OnCallResolverService);
//# sourceMappingURL=oncall-resolver.service.js.map