import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'
import { PlatformGuard } from '../guards/platform.guard'
import { PlatformPrismaService } from '../../database/platform-prisma.service'

class PlatformAuditQueryDto {
  @ApiPropertyOptional() @IsOptional() @IsString() tenantId?: string
  @ApiPropertyOptional() @IsOptional() @IsString() action?: string
  @ApiPropertyOptional() @IsOptional() @IsString() actorEmail?: string
  @ApiPropertyOptional({ default: 1 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number = 1
  @ApiPropertyOptional({ default: 50 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) limit?: number = 50
}

@ApiTags('Platform — Audit')
@ApiBearerAuth()
@Controller('platform/audit')
@UseGuards(JwtAuthGuard, PlatformGuard)
export class PlatformAuditController {
  constructor(private readonly platformDb: PlatformPrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Platform-level audit log (tenant provisioning, suspensions)' })
  async findAll(@Query() q: PlatformAuditQueryDto) {
    const where: Record<string, unknown> = {}
    if (q.tenantId) where.tenantId = q.tenantId
    if (q.action) where.action = { contains: q.action, mode: 'insensitive' }
    if (q.actorEmail) where.actorEmail = { contains: q.actorEmail, mode: 'insensitive' }

    const page = q.page ?? 1
    const limit = q.limit ?? 50
    const skip = (page - 1) * limit

    const [items, total] = await Promise.all([
      this.platformDb.globalAudit.findMany({
        where,
        skip,
        take: limit,
        include: { tenant: { select: { slug: true, name: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.platformDb.globalAudit.count({ where }),
    ])

    return {
      data: items,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    }
  }
}
