import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PlatformPrismaService } from '../../database/platform-prisma.service';
import type { PlatformLoginDto } from '../dto/platform.dto';
export declare class PlatformAuthService {
    private readonly platformDb;
    private readonly jwtService;
    private readonly config;
    private readonly logger;
    constructor(platformDb: PlatformPrismaService, jwtService: JwtService, config: ConfigService);
    login(dto: PlatformLoginDto, ipAddress: string, userAgent: string): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: import("@prisma/platform-client").$Enums.PlatformUserRole;
        };
    }>;
    createPlatformAdmin(email: string, name: string, role?: string): Promise<{
        role: import("@prisma/platform-client").$Enums.PlatformUserRole;
        name: string;
        email: string;
        id: string;
        passwordHash: string;
        createdAt: Date;
        active: boolean;
    } | {
        tempPassword: string;
        role: import("@prisma/platform-client").$Enums.PlatformUserRole;
        name: string;
        email: string;
        id: string;
        passwordHash: string;
        createdAt: Date;
        active: boolean;
    }>;
    private generateTempPassword;
}
