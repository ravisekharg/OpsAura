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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformGuard = exports.RequirePlatformRole = exports.PLATFORM_ROLE_KEY = exports.PLATFORM_ROLES = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const public_decorator_1 = require("../../common/decorators/public.decorator");
exports.PLATFORM_ROLES = [
    'super_admin',
    'admin',
    'support_admin',
    'billing_admin',
    'read_only',
];
exports.PLATFORM_ROLE_KEY = 'requiredPlatformRoles';
const RequirePlatformRole = (...roles) => Reflect.metadata(exports.PLATFORM_ROLE_KEY, roles);
exports.RequirePlatformRole = RequirePlatformRole;
let PlatformGuard = class PlatformGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const isPublic = this.reflector.getAllAndOverride(public_decorator_1.IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic)
            return true;
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user)
            throw new common_1.ForbiddenException('Not authenticated');
        if (user.tenantSlug !== 'platform') {
            throw new common_1.ForbiddenException('Platform access required');
        }
        const required = this.reflector.getAllAndOverride(exports.PLATFORM_ROLE_KEY, [context.getHandler(), context.getClass()]);
        if (!required || required.length === 0)
            return true;
        if (!required.includes(user.role)) {
            throw new common_1.ForbiddenException(`Required platform role: ${required.join(' or ')}`);
        }
        return true;
    }
};
exports.PlatformGuard = PlatformGuard;
exports.PlatformGuard = PlatformGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], PlatformGuard);
//# sourceMappingURL=platform.guard.js.map