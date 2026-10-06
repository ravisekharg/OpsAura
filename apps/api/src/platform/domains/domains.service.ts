import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { DomainsRepository } from './domains.repository'
import type { AddDomainDto } from '../dto/platform.dto'

@Injectable()
export class DomainsService {
  constructor(private readonly repo: DomainsRepository) {}

  findAll(tenantId?: string) { return this.repo.findAll(tenantId) }

  async findOne(id: string) {
    const domain = await this.repo.findById(id)
    if (!domain) throw new NotFoundException(`Domain ${id} not found`)
    return domain
  }

  async add(dto: AddDomainDto) {
    const existing = await this.repo.findByDomain(dto.domain)
    if (existing) throw new ConflictException(`Domain "${dto.domain}" is already registered`)
    return this.repo.create(dto)
  }

  async verify(id: string) {
    await this.findOne(id)
    return this.repo.verify(id)
  }

  async remove(id: string) {
    await this.findOne(id)
    return this.repo.delete(id)
  }
}
