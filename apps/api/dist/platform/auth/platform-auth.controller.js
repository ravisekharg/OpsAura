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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformAuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const throttler_1 = require("@nestjs/throttler");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const platform_auth_service_1 = require("./platform-auth.service");
const platform_dto_1 = require("../dto/platform.dto");
let PlatformAuthController = class PlatformAuthController {
    constructor(authService) {
        this.authService = authService;
    }
    login(dto, req) {
        return this.authService.login(dto, req.ip ?? '', req.headers['user-agent'] ?? '');
    }
};
exports.PlatformAuthController = PlatformAuthController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, throttler_1.Throttle)({ default: { limit: 10, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Platform admin login' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [platform_dto_1.PlatformLoginDto, Object]),
    __metadata("design:returntype", void 0)
], PlatformAuthController.prototype, "login", null);
exports.PlatformAuthController = PlatformAuthController = __decorate([
    (0, swagger_1.ApiTags)('Platform Auth'),
    (0, common_1.Controller)('platform/auth'),
    __metadata("design:paramtypes", [platform_auth_service_1.PlatformAuthService])
], PlatformAuthController);
//# sourceMappingURL=platform-auth.controller.js.map