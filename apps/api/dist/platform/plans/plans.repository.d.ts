import { PlatformPrismaService } from '../../database/platform-prisma.service';
import type { CreatePlanDto, UpdatePlanDto } from '../dto/platform.dto';
export declare class PlansRepository {
    private readonly db;
    constructor(db: PlatformPrismaService);
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
    findById(id: string): import("@prisma/platform-client").Prisma.Prisma__PlanClient<({
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
    }) | null, null, import("@prisma/platform-client/runtime/library").DefaultArgs>;
    create(data: CreatePlanDto): import("@prisma/platform-client").Prisma.Prisma__PlanClient<{
        name: string;
        id: string;
        features: import("@prisma/platform-client/runtime/library").JsonValue;
        limits: import("@prisma/platform-client/runtime/library").JsonValue;
        priceMonthly: import("@prisma/platform-client/runtime/library").Decimal | null;
    }, never, import("@prisma/platform-client/runtime/library").DefaultArgs>;
    update(id: string, data: UpdatePlanDto): import("@prisma/platform-client").Prisma.Prisma__PlanClient<{
        name: string;
        id: string;
        features: import("@prisma/platform-client/runtime/library").JsonValue;
        limits: import("@prisma/platform-client/runtime/library").JsonValue;
        priceMonthly: import("@prisma/platform-client/runtime/library").Decimal | null;
    }, never, import("@prisma/platform-client/runtime/library").DefaultArgs>;
}
