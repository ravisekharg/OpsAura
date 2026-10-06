import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common'
import { TeamsRepository } from './teams.repository'
import type { CreateTeamDto, UpdateTeamDto, AddMemberDto } from './dto/team.dto'

@Injectable()
export class TeamsService {
  constructor(private readonly repo: TeamsRepository) {}

  findAll(search?: string) {
    return this.repo.findMany(search)
  }

  async findOne(id: string) {
    const team = await this.repo.findById(id)
    if (!team) throw new NotFoundException(`Team ${id} not found`)
    return team
  }

  create(dto: CreateTeamDto) {
    return this.repo.create(dto)
  }

  async update(id: string, dto: UpdateTeamDto) {
    await this.findOne(id)
    return this.repo.update(id, dto)
  }

  async remove(id: string) {
    await this.findOne(id)
    return this.repo.delete(id)
  }

  async addMember(teamId: string, dto: AddMemberDto) {
    await this.findOne(teamId)
    const already = await this.repo.isMember(teamId, dto.userId)
    if (already) throw new ConflictException('User is already a member of this team')
    return this.repo.addMember(teamId, dto.userId)
  }

  async removeMember(teamId: string, userId: string) {
    await this.findOne(teamId)
    return this.repo.removeMember(teamId, userId)
  }
}
