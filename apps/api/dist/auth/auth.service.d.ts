import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PlatformPrismaService } from '../database/platform-prisma.service';
import { TenantPrismaFactory } from '../database/tenant-prisma.factory';
import { AccountLockoutService } from './account-lockout.service';
import type { LoginDto } from './dto/login.dto';
import type { RequestPasswordResetDto, ConfirmPasswordResetDto } from './dto/reset-password.dto';
import type { ForceChangePasswordDto } from './dto/force-change.dto';
export declare class AuthService {
    private readonly jwtService;
    private readonly config;
    private readonly platformDb;
    private readonly tenantFactory;
    private readonly lockout;
    private readonly logger;
    private readonly bcryptRounds;
    constructor(jwtService: JwtService, config: ConfigService, platformDb: PlatformPrismaService, tenantFactory: TenantPrismaFactory, lockout: AccountLockoutService);
    login(dto: LoginDto, ipAddress: string, userAgent: string): Promise<{
        mfaRequired: boolean;
        mfaToken: string;
    } | {
        accessToken: string;
        refreshToken: string;
        mfaRequired: boolean;
        requiresPasswordChange: boolean;
        user: {
            id: string;
            email: string;
            name: string;
            role: string;
        };
        mfaToken?: undefined;
    }>;
    forceChangePassword(userId: string, tenantSlug: string, dto: ForceChangePasswordDto): Promise<{
        message: string;
    }>;
    verifyMfa(mfaToken: string, code: string, ipAddress: string, userAgent: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    refreshTokens(refreshToken: string, tenantSlug: string, ipAddress: string, userAgent: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(refreshToken: string, tenantSlug: string): Promise<void>;
    logoutAll(userId: string, tenantSlug: string): Promise<void>;
    requestPasswordReset(dto: RequestPasswordResetDto): Promise<{
        message: string;
    }>;
    confirmPasswordReset(dto: ConfirmPasswordResetDto, tenantSlug: string): Promise<{
        message: string;
    }>;
    private issueTokens;
    private extractPermissions;
    private hashToken;
    private simulateHashDelay;
    mfaEnroll(userId: string, tenantSlug: string): Promise<{
        qrCodeUrl: string;
        secret: string;
    }>;
    mfaEnable(userId: string, tenantSlug: string, code: string): Promise<{
        backupCodes: string[];
    }>;
    mfaDisable(userId: string, tenantSlug: string, code: string): Promise<void>;
    mfaStatus(userId: string, tenantSlug: string): Promise<{
        enabled: boolean;
    }>;
}
