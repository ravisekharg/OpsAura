import { Strategy } from 'passport-custom';
import { Request } from 'express';
import { ApiKeysService } from '../api-keys.service';
export declare const API_KEY_STRATEGY = "api-key";
declare const ApiKeyStrategy_base: new (...args: any[]) => Strategy;
export declare class ApiKeyStrategy extends ApiKeyStrategy_base {
    private readonly apiKeysService;
    constructor(apiKeysService: ApiKeysService);
    validate(req: Request): Promise<{
        id: string;
        email: string;
        name: string;
        tenantSlug: string;
        role: string;
        permissions: string[];
        requiresPasswordChange: boolean;
    }>;
}
export {};
