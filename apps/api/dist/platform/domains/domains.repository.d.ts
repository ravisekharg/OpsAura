import { PlatformPrismaService } from '../../database/platform-prisma.service';
import type { AddDomainDto } from '../dto/platform.dto';
export declare class DomainsRepository {
    private readonly db;
    constructor(db: PlatformPrismaService);
    findAll(tenantId?: string): import("@prisma/platform-client").Prisma.PrismaPromise<({
        tenant: {
            name: string;
            id: string;
            slug: string;
        };
    } & {
        domain: string;
        id: string;
        createdAt: Date;
        tenantId: string;
        verified: boolean;
        verifiedAt: Date | null;
    })[]>;
    findById(id: string): import("@prisma/platform-client").Prisma.Prisma__DomainClient<({
        tenant: {
            name: string;
            id: string;
            slug: string;
        };
    } & {
        domain: string;
        id: string;
        createdAt: Date;
        tenantId: string;
        verified: boolean;
        verifiedAt: Date | null;
    }) | null, null, import("@prisma/platform-client/runtime/library").DefaultArgs>;
    findByDomain(domain: string): import("@prisma/platform-client").Prisma.Prisma__DomainClient<{
        domain: string;
        id: string;
        createdAt: Date;
        tenantId: string;
        verified: boolean;
        verifiedAt: Date | null;
    } | null, null, import("@prisma/platform-client/runtime/library").DefaultArgs>;
    create(data: AddDomainDto): import("@prisma/platform-client").Prisma.Prisma__DomainClient<{
        tenant: {
            name: string;
            id: string;
            slug: string;
        };
    } & {
        domain: string;
        id: string;
        createdAt: Date;
        tenantId: string;
        verified: boolean;
        verifiedAt: Date | null;
    }, never, import("@prisma/platform-client/runtime/library").DefaultArgs>;
    verify(id: string): import("@prisma/platform-client").Prisma.Prisma__DomainClient<{
        tenant: {
            name: string;
            id: string;
            slug: string;
        };
    } & {
        domain: string;
        id: string;
        createdAt: Date;
        tenantId: string;
        verified: boolean;
        verifiedAt: Date | null;
    }, never, import("@prisma/platform-client/runtime/library").DefaultArgs>;
    delete(id: string): import("@prisma/platform-client").Prisma.Prisma__DomainClient<{
        domain: string;
        id: string;
        createdAt: Date;
        tenantId: string;
        verified: boolean;
        verifiedAt: Date | null;
    }, never, import("@prisma/platform-client/runtime/library").DefaultArgs>;
}
