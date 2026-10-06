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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const throttler_1 = require("@nestjs/throttler");
const auth_service_1 = require("./auth.service");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const public_decorator_1 = require("../common/decorators/public.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const login_dto_1 = require("./dto/login.dto");
const reset_password_dto_1 = require("./dto/reset-password.dto");
const force_change_dto_1 = require("./dto/force-change.dto");
const mfa_dto_1 = require("./dto/mfa.dto");
const REFRESH_COOKIE = 'opsaura-refresh';
const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/v1/auth',
};
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async login(dto, req, res) {
        const ip = req.ip ?? '';
        const ua = req.headers['user-agent'] ?? '';
        const result = await this.authService.login(dto, ip, ua);
        if (!result.mfaRequired && 'refreshToken' in result) {
            res.cookie(REFRESH_COOKIE, result.refreshToken, COOKIE_OPTIONS);
            const { refreshToken, ...safe } = result;
            return safe;
        }
        return result;
    }
    async verifyMfa(dto, req, res) {
        const result = await this.authService.verifyMfa(dto.mfaToken, dto.code, req.ip ?? '', req.headers['user-agent'] ?? '');
        res.cookie(REFRESH_COOKIE, result.refreshToken, COOKIE_OPTIONS);
        const { refreshToken, ...safe } = result;
        return safe;
    }
    async refresh(req, res) {
        const refreshToken = req.cookies?.[REFRESH_COOKIE];
        if (!refreshToken) {
            return { error: 'No refresh token' };
        }
        const tenantSlug = req.headers['x-tenant-slug'] ?? 'unknown';
        const result = await this.authService.refreshTokens(refreshToken, tenantSlug, req.ip ?? '', req.headers['user-agent'] ?? '');
        res.cookie(REFRESH_COOKIE, result.refreshToken, COOKIE_OPTIONS);
        return { accessToken: result.accessToken };
    }
    async logout(req, res, user) {
        const refreshToken = req.cookies?.[REFRESH_COOKIE];
        if (refreshToken) {
            await this.authService.logout(refreshToken, user.tenantSlug);
        }
        res.clearCookie(REFRESH_COOKIE, { path: '/v1/auth' });
    }
    async requestReset(dto) {
        return this.authService.requestPasswordReset(dto);
    }
    async confirmReset(dto, req) {
        const tenantSlug = req.headers['x-tenant-slug'];
        return this.authService.confirmPasswordReset(dto, tenantSlug);
    }
    async forceChangePassword(dto, user) {
        return this.authService.forceChangePassword(user.id, user.tenantSlug, dto);
    }
    me(user) {
        return user;
    }
    mfaStatus(user) {
        return this.authService.mfaStatus(user.id, user.tenantSlug);
    }
    mfaEnroll(user) {
        return this.authService.mfaEnroll(user.id, user.tenantSlug);
    }
    mfaEnable(dto, user) {
        return this.authService.mfaEnable(user.id, user.tenantSlug, dto.code);
    }
    mfaDisable(dto, user) {
        return this.authService.mfaDisable(user.id, user.tenantSlug, dto.code);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, throttler_1.Throttle)({ default: { limit: 10, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Login with email + password' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('mfa/verify'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Complete login with MFA TOTP code' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.MfaVerifyDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyMfa", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('refresh'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Refresh access token using refresh token cookie' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Logout and revoke refresh token' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('reset-password'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 300000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Request a password reset email' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_password_dto_1.RequestPasswordResetDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "requestReset", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('reset-password/confirm'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Confirm password reset with token' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_password_dto_1.ConfirmPasswordResetDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "confirmReset", null);
__decorate([
    (0, common_1.Post)('change-password-forced'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Change temporary password — must be called when requiresPasswordChange=true' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [force_change_dto_1.ForceChangePasswordDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forceChangePassword", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get current authenticated user' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "me", null);
__decorate([
    (0, common_1.Get)('mfa/status'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get MFA status for current user' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "mfaStatus", null);
__decorate([
    (0, common_1.Post)('mfa/enroll'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Begin MFA enrollment — returns QR code and secret' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "mfaEnroll", null);
__decorate([
    (0, common_1.Post)('mfa/enable'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Confirm MFA enrollment with TOTP code — returns backup codes' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mfa_dto_1.MfaEnrollConfirmDto, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "mfaEnable", null);
__decorate([
    (0, common_1.Post)('mfa/disable'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Disable MFA by verifying current TOTP code' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mfa_dto_1.MfaDisableDto, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "mfaDisable", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Auth'),
    (0, common_1.Controller)('auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map