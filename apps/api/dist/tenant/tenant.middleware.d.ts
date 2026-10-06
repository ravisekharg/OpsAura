import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TenantContextService } from './tenant-context.service';
import { TenantPrismaFactory } from '../database/tenant-prisma.factory';
import { PlatformPrismaService } from '../database/platform-prisma.service';
export declare class TenantMiddleware implements NestMiddleware {
    private readonly tenantContext;
    private readonly tenantFactory;
    private readonly platformDb;
    private readonly logger;
    constructor(tenantContext: TenantContextService, tenantFactory: TenantPrismaFactory, platformDb: PlatformPrismaService);
    use(req: Request, _res: Response, next: NextFunction): Promise<void>;
}
