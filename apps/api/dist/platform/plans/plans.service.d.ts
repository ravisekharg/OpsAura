import { PlansRepository } from './plans.repository';
import type { CreatePlanDto, UpdatePlanDto } from '../dto/platform.dto';
export declare class PlansService {
    private readonly repo;
    constructor(repo: PlansRepository);
    findAll(): import("@prisma/platform-client").Prisma.PrismaPromise<({
        _count: {
            subscriptions: number;
            tenants: number;
        };
    } & {
        name: string;
        id: string;
        features: import("@prisma/platform-client/runtime/library").JsonValue;
        limits: import("@prisma/platform-client/runtime/library").JsonValue;
        priceMonthly: import("@prisma/platform-client/runtime/library").Decimal | null;
    })[]>;
    findOne(id: string): Promise<{
        _count: {
            subscriptions: number;
            tenants: number;
        };
    } & {
        name: string;
        id: string;
        features: import("@prisma/platform-client/runtime/library").JsonValue;
        limits: import("@prisma/platform-client/runtime/library").JsonValue;
        priceMonthly: import("@prisma/platform-client/runtime/library").Decimal | null;
    }>;
    create(dto: CreatePlanDto): import("@prisma/platform-client").Prisma.Prisma__PlanClient<{
        name: string;
        id: string;
        features: import("@prisma/platform-client/runtime/library").JsonValue;
        limits: import("@prisma/platform-client/runtime/library").JsonValue;
        priceMonthly: import("@prisma/platform-client/runtime/library").Decimal | null;
    }, never, import("@prisma/platform-client/runtime/library").DefaultArgs>;
    update(id: string, dto: UpdatePlanDto): Promise<{
        name: string;
        id: string;
        features: import("@prisma/platform-client/runtime/library").JsonValue;
        limits: import("@prisma/platform-client/runtime/library").JsonValue;
        priceMonthly: import("@prisma/platform-client/runtime/library").Decimal | null;
    }>;
}
