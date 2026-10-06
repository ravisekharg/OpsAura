import { Injectable, Logger } from '@nestjs/common'
import { TenantContextService } from '../../tenant/tenant-context.service'

export interface OnCallResult {
  userId: string | null
  userName: string | null
  userEmail: string | null
  scheduleName: string | null
  isOverride: boolean
  rotationName: string | null
}

type RotationMember = {
  userId: string
  name: string
  email: string
  order?: number
}

@Injectable()
export class OnCallResolverService {
  private readonly logger = new Logger(OnCallResolverService.name)

  constructor(private readonly tenantContext: TenantContextService) {}

  private get db() {
    return this.tenantContext.getDb()
  }

  async resolveOnCall(assignmentGroupId: string): Promise<OnCallResult> {
    const empty: OnCallResult = {
      userId: null,
      userName: null,
      userEmail: null,
      scheduleName: null,
      isOverride: false,
      rotationName: null,
    }

    // 1. Get the assignment group with its team
    const group = await this.db.assignmentGroup.findUnique({
      where: { id: assignmentGroupId },
      include: { team: true },
    })

    if (!group || !group.teamId) {
      this.logger.warn(`No team found for assignment group ${assignmentGroupId}`)
      return empty
    }

    // 2. Find active schedules for this team
    const schedules = await this.db.schedule.findMany({
      where: { teamId: group.teamId, active: true },
      include: {
        rotations: { where: { active: true } },
        overrides: {
          where: {
            startAt: { lte: new Date() },
            endAt: { gte: new Date() },
          },
          include: {
            overrideUser: { select: { id: true, name: true, email: true } },
          },
          orderBy: { startAt: 'desc' },
          take: 1,
        },
      },
    })

    if (schedules.length === 0) {
      this.logger.warn(`No active schedules for team ${group.teamId}`)
      return empty
    }

    // Use the first active schedule
    const schedule = schedules[0]

    // 3. Check for override first
    if (schedule.overrides.length > 0) {
      const override = schedule.overrides[0]
      this.logger.debug(
        `Override active for schedule "${schedule.name}" → ${override.overrideUser.name}`,
      )
      return {
        userId: override.overrideUser.id,
        userName: override.overrideUser.name,
        userEmail: override.overrideUser.email,
        scheduleName: schedule.name,
        isOverride: true,
        rotationName: null,
      }
    }

    // 4. No override — resolve from rotation
    if (schedule.rotations.length === 0) {
      this.logger.warn(`No active rotations for schedule "${schedule.name}"`)
      return { ...empty, scheduleName: schedule.name }
    }

    const rotation = schedule.rotations[0]
    const members = rotation.members as RotationMember[]

    if (!members || members.length === 0) {
      this.logger.warn(`Rotation "${rotation.name}" has no members`)
      return { ...empty, scheduleName: schedule.name }
    }

    // 5. Calculate current member based on rotation type
    const currentMember = this.resolveCurrentMember(members, rotation.type, rotation.handoffTime)

    if (!currentMember) {
      return { ...empty, scheduleName: schedule.name, rotationName: rotation.name }
    }

    this.logger.debug(
      `On-call resolved: schedule="${schedule.name}" rotation="${rotation.name}" user="${currentMember.name}"`,
    )

    return {
      userId: currentMember.userId,
      userName: currentMember.name,
      userEmail: currentMember.email,
      scheduleName: schedule.name,
      isOverride: false,
      rotationName: rotation.name,
    }
  }

  private resolveCurrentMember(
    members: RotationMember[],
    type: string,
    handoffTime: Date | null,
  ): RotationMember | null {
    if (members.length === 0) return null

    const now = new Date()

    // Epoch reference: Monday 2025-01-06 00:00:00 UTC
    const epochRef = new Date('2025-01-06T00:00:00Z').getTime()
    const msNow = now.getTime()
    const elapsed = msNow - epochRef

    let periodMs: number

    switch (type) {
      case 'DAILY':
        periodMs = 24 * 60 * 60 * 1000
        break
      case 'WEEKLY':
      default:
        periodMs = 7 * 24 * 60 * 60 * 1000
        break
    }

    const periodIndex = Math.floor(elapsed / periodMs)
    const memberIndex = Math.abs(periodIndex) % members.length

    return members[memberIndex] ?? members[0]
  }
}
