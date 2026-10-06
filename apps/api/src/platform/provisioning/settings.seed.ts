import { PrismaClient } from '@prisma/tenant-client'

const DEFAULT_SETTINGS: Array<{ key: string; value: unknown }> = [
  { key: 'general.companyName', value: '' },
  { key: 'general.timezone', value: 'Asia/Kolkata' },
  { key: 'general.dateFormat', value: 'MMM DD, YYYY' },
  { key: 'general.language', value: 'en' },

  { key: 'alerts.autoCreateWarRoom', value: true },
  { key: 'alerts.autoCreateWarRoomThreshold', value: 'critical' },
  { key: 'alerts.deduplicationWindowMinutes', value: 5 },
  { key: 'alerts.autoResolveEnabled', value: false },
  { key: 'alerts.autoResolveAfterMinutes', value: 120 },
  { key: 'alerts.defaultAssignmentGroupId', value: { groupId: null } },

  { key: 'notifications.alertVoiceEnabled', value: true },
  { key: 'notifications.alertVoiceThreshold', value: 'critical' },
  { key: 'notifications.alertEmailEnabled', value: true },
  { key: 'notifications.alertSlackEnabled', value: true },
  { key: 'notifications.alertTeamsEnabled', value: false },
  { key: 'notifications.digestEmailEnabled', value: true },
  { key: 'notifications.digestFrequency', value: 'daily' },
  { key: 'notifications.quietHoursEnabled', value: false },
  { key: 'notifications.quietHoursStart', value: '22:00' },
  { key: 'notifications.quietHoursEnd', value: '07:00' },

  { key: 'security.mfaRequired', value: false },
  { key: 'security.sessionTimeoutMinutes', value: 480 },
  { key: 'security.passwordMinLength', value: 8 },
  { key: 'security.passwordRequireSpecial', value: true },
  { key: 'security.passwordRequireNumbers', value: true },
  { key: 'security.ipAllowlistEnabled', value: false },
  { key: 'security.ipAllowlist', value: [] },
]

export async function seedDefaultSettings(db: PrismaClient): Promise<void> {
  for (const setting of DEFAULT_SETTINGS) {
    await db.setting.upsert({
      where: { key: setting.key },
      create: { key: setting.key, value: setting.value as any },
      update: {},
    })
  }
}
