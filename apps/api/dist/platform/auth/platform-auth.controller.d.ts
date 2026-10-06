import { Request } from 'express';
import { PlatformAuthService } from './platform-auth.service';
import { PlatformLoginDto } from '../dto/platform.dto';
export declare class PlatformAuthController {
    private readonly authService;
    constructor(authService: PlatformAuthService);
    login(dto: PlatformLoginDto, req: Request): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: import("@prisma/platform-client").$Enums.PlatformUserRole;
        };
    }>;
}
