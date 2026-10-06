import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto, MfaVerifyDto } from './dto/login.dto';
import { RequestPasswordResetDto, ConfirmPasswordResetDto } from './dto/reset-password.dto';
import { ForceChangePasswordDto } from './dto/force-change.dto';
import { MfaEnrollConfirmDto, MfaDisableDto } from './dto/mfa.dto';
import type { RequestUser } from '../common/interfaces/request-user.interface';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(dto: LoginDto, req: Request, res: Response): Promise<{
        mfaRequired: boolean;
        mfaToken: string;
    } | {
        accessToken: string;
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
    verifyMfa(dto: MfaVerifyDto, req: Request, res: Response): Promise<{
        accessToken: string;
    }>;
    refresh(req: Request, res: Response): Promise<{
        error: string;
        accessToken?: undefined;
    } | {
        accessToken: string;
        error?: undefined;
    }>;
    logout(req: Request, res: Response, user: RequestUser): Promise<void>;
    requestReset(dto: RequestPasswordResetDto): Promise<{
        message: string;
    }>;
    confirmReset(dto: ConfirmPasswordResetDto, req: Request): Promise<{
        message: string;
    }>;
    forceChangePassword(dto: ForceChangePasswordDto, user: RequestUser): Promise<{
        message: string;
    }>;
    me(user: RequestUser): RequestUser;
    mfaStatus(user: RequestUser): Promise<{
        enabled: boolean;
    }>;
    mfaEnroll(user: RequestUser): Promise<{
        qrCodeUrl: string;
        secret: string;
    }>;
    mfaEnable(dto: MfaEnrollConfirmDto, user: RequestUser): Promise<{
        backupCodes: string[];
    }>;
    mfaDisable(dto: MfaDisableDto, user: RequestUser): Promise<void>;
}
