import { Injectable } from '@nestjs/common'
import { PlatformPrismaService } from '../../database/platform-prisma.service'
import type { AddDomainDto } from '../dto/platform.dto'

@Injectable()
export class DomainsRepository {
  constructor(private readonly db: PlatformPrismaService) {}

  findAll(tenantId?: string) {
    return this.db.domain.findMany({
      where: tenantId ? { tenantId } : {},
      include: { tenant: { select: { id: true, slug: true, name: true } } },
      orderBy: { domain: 'asc' },
    })
  }

  findById(id: string) {
    return this.db.domain.findUnique({
      where: { id },
      include: { tenant: { select: { id: true, slug: true, name: true } } },
    })
  }

  findByDomain(domain: string) {
    return this.db.domain.findUnique({ where: { domain } })
  }

  create(data: AddDomainDto) {
    return this.db.domain.create({
      data: { tenantId: data.tenantId, domain: data.domain },
      include: { tenant: { select: { id: true, slug: true, name: true } } },
    })
  }

  verify(id: string) {
    return this.db.domain.update({
      where: { id },
      data: { verified: true, verifiedAt: new Date() },
      include: { tenant: { select: { id: true, slug: true, name: true } } },
    })
  }

  delete(id: string) {
    return this.db.domain.delete({ where: { id } })
  }
}
