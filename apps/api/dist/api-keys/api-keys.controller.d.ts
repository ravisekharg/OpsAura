import { ApiKeysService } from './api-keys.service';
import { CreateApiKeyDto } from './dto/api-key.dto';
import type { RequestUser } from '../common/interfaces/request-user.interface';
export declare class ApiKeysController {
    private readonly service;
    constructor(service: ApiKeysService);
    findAll(user: RequestUser): import("@prisma/tenant-client").Prisma.PrismaPromise<{
        name: string;
        id: string;
        createdAt: Date;
        expiresAt: Date | null;
        scopes: import("@prisma/tenant-client/runtime/library").JsonValue;
        prefix: string;
        lastUsedAt: Date | null;
    }[]>;
    create(dto: CreateApiKeyDto, user: RequestUser): Promise<{
        key: string;
        id: string;
        prefix: string;
    }>;
    revoke(id: string, user: RequestUser): Promise<void>;
}
