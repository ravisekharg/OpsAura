import { DomainsRepository } from './domains.repository';
import type { AddDomainDto } from '../dto/platform.dto';
export declare class DomainsService {
    private readonly repo;
    constructor(repo: DomainsRepository);
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
    findOne(id: string): Promise<{
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
    }>;
    add(dto: AddDomainDto): Promise<{
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
    }>;
    verify(id: string): Promise<{
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
    }>;
    remove(id: string): Promise<{
        domain: string;
        id: string;
        createdAt: Date;
        tenantId: string;
        verified: boolean;
        verifiedAt: Date | null;
    }>;
}
