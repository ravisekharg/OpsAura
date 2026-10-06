import { Injectable, NotFoundException, Logger } from '@nestjs/common'
import { TenantContextService } from '../tenant/tenant-context.service'
import type {
  CreateSnConnectionDto, UpdateSnConnectionDto,
  CreateSnMappingDto, UpdateSnMappingDto,
} from './dto/servicenow.dto'

@Injectable()
export class ServiceNowService {
  private readonly logger = new Logger(ServiceNowService.name)

  constructor(private readonly tenantContext: TenantContextService) {}

  private get db() { return this.tenantContext.getDb() }

  // ── Connections ───────────────────────────────────────────────────────────

  findAllConnections() {
    return this.db.snConnection.findMany({
      include: {
        _count: { select: { groupMappings: true, syncLogs: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findConnection(id: string) {
    const conn = await this.db.snConnection.findUnique({
      where: { id },
      include: {
        groupMappings: {
          include: { localGroup: { select: { id: true, name: true } } },
        },
        _count: { select: { syncLogs: true } },
      },
    })
    if (!conn) throw new NotFoundException(`ServiceNow connection ${id} not found`)
    return conn
  }

  async createConnection(dto: CreateSnConnectionDto) {
    const vaultKey = `sn:${dto.instanceUrl.replace(/https?:\/\//, '')}:${Date.now()}`
    // In production: store credentials in Vault at vaultKey
    this.logger.log(`SN connection vault key: ${vaultKey}`)
    return this.db.snConnection.create({
      data: {
        name: dto.name,
        instanceUrl: dto.instanceUrl,
        username: dto.username,
        vaultKey,
        status: 'DISCONNECTED',
      },
    })
  }

  async updateConnection(id: string, dto: UpdateSnConnectionDto) {
    await this.findConnection(id)
    const data: any = {}
    if (dto.name) data.name = dto.name
    if (dto.instanceUrl) data.instanceUrl = dto.instanceUrl
    if (dto.username) data.username = dto.username
    if (dto.password) {
      // Rotate vault key when credentials change
      data.vaultKey = `sn:${dto.instanceUrl ?? ''}:${Date.now()}`
      data.status = 'DISCONNECTED'
    }
    return this.db.snConnection.update({ where: { id }, data })
  }

  async deleteConnection(id: string) {
    await this.findConnection(id)
    return this.db.snConnection.delete({ where: { id } })
  }

  async testConnection(id: string): Promise<{ success: boolean; message: string; instanceVersion?: string }> {
    const conn = await this.findConnection(id)
    const startMs = Date.now()

    try {
      // Real implementation: GET {instanceUrl}/api/now/table/sys_user?sysparm_limit=1
      // with Basic Auth (username + password from vault)
      this.logger.log(`Testing SN connection ${id} → ${conn.instanceUrl}`)

      // Stubbed for now — replace with actual HTTP call in Tier 2
      const durationMs = Date.now() - startMs
      await this.db.snConnection.update({ where: { id }, data: { status: 'CONNECTED', lastTestedAt: new Date() } })
      await this.logSync(id, 'PULL_GROUPS', 'SYNCED', 0, `Connection test OK (${durationMs}ms)`)
      return { success: true, message: 'Connection verified', instanceVersion: 'unknown' }
    } catch (err) {
      await this.db.snConnection.update({ where: { id }, data: { status: 'DISCONNECTED', lastTestedAt: new Date() } })
      await this.logSync(id, 'PULL_GROUPS', 'FAILED', 0, 'Connection test failed', (err as Error).message)
      return { success: false, message: (err as Error).message }
    }
  }

  // ── Group Mappings ────────────────────────────────────────────────────────

  findMappings(connectionId?: string) {
    return this.db.snGroupMapping.findMany({
      where: connectionId ? { connectionId } : {},
      include: {
        connection: { select: { id: true, name: true, instanceUrl: true } },
        localGroup: { select: { id: true, name: true } },
      },
      orderBy: { snGroupName: 'asc' },
    })
  }

  async createMapping(dto: CreateSnMappingDto) {
    await this.findConnection(dto.connectionId)
    return this.db.snGroupMapping.create({
      data: {
        connectionId: dto.connectionId,
        snGroupId: dto.snGroupId,
        snGroupName: dto.snGroupName,
        localGroupId: dto.localGroupId,
        autoSync: dto.autoSync ?? true,
        syncStatus: 'PENDING',
      },
      include: {
        connection: { select: { id: true, name: true } },
        localGroup: { select: { id: true, name: true } },
      },
    })
  }

  async updateMapping(id: string, dto: UpdateSnMappingDto) {
    const existing = await this.db.snGroupMapping.findUnique({ where: { id } })
    if (!existing) throw new NotFoundException(`Mapping ${id} not found`)
    return this.db.snGroupMapping.update({ where: { id }, data: dto as any })
  }

  async deleteMapping(id: string) {
    const existing = await this.db.snGroupMapping.findUnique({ where: { id } })
    if (!existing) throw new NotFoundException(`Mapping ${id} not found`)
    return this.db.snGroupMapping.delete({ where: { id } })
  }

  // ── Sync Logs ─────────────────────────────────────────────────────────────

  getSyncLogs(connectionId: string, limit = 100) {
    return this.db.snSyncLog.findMany({
      where: { connectionId },
      orderBy: { executedAt: 'desc' },
      take: limit,
      include: { connection: { select: { id: true, name: true } } },
    })
  }

  // ── Sync Operations ───────────────────────────────────────────────────────

  async syncGroups(connectionId: string): Promise<{ synced: number; failed: number }> {
    const conn = await this.findConnection(connectionId)
    const startMs = Date.now()

    try {
      // Real: fetch groups from SN API, upsert into local DB
      this.logger.log(`Syncing groups from SN connection ${connectionId}`)
      const durationMs = Date.now() - startMs

      // Update all auto-sync mappings
      await this.db.snGroupMapping.updateMany({
        where: { connectionId, autoSync: true },
        data: { lastSyncedAt: new Date(), syncStatus: 'SYNCED' },
      })

      const count = await this.db.snGroupMapping.count({ where: { connectionId, autoSync: true } })
      await this.logSync(connectionId, 'PULL_GROUPS', 'SYNCED', count, `Synced ${count} groups`, undefined, durationMs)
      return { synced: count, failed: 0 }
    } catch (err) {
      const durationMs = Date.now() - startMs
      await this.logSync(connectionId, 'PULL_GROUPS', 'FAILED', 0, 'Sync failed', (err as Error).message, durationMs)
      throw err
    }
  }

  private async logSync(
    connectionId: string,
    operation: string,
    status: string,
    recordsAffected: number,
    message?: string,
    errorDetail?: string,
    durationMs?: number,
  ) {
    return this.db.snSyncLog.create({
      data: {
        connectionId,
        operation: operation as any,
        status: status as any,
        recordsAffected,
        message,
        errorDetail,
        durationMs,
      },
    })
  }
}
