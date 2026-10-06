import * as crypto from 'crypto'

const ALGORITHM = 'aes-256-gcm'

function getKey(encryptionKey: string): Buffer {
  return crypto.createHash('sha256').update(encryptionKey).digest()
}

export function encryptChannelConfig(config: object, encryptionKey: string): string {
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(encryptionKey), iv)
  const json = JSON.stringify(config)
  const encrypted = Buffer.concat([cipher.update(json, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  // Format: iv:tag:ciphertext (all base64)
  return `${iv.toString('base64')}:${tag.toString('base64')}:${encrypted.toString('base64')}`
}

export function decryptChannelConfig<T = Record<string, any>>(encrypted: string, encryptionKey: string): T {
  const [ivB64, tagB64, ctB64] = encrypted.split(':')
  const iv = Buffer.from(ivB64, 'base64')
  const tag = Buffer.from(tagB64, 'base64')
  const ct = Buffer.from(ctB64, 'base64')
  const decipher = crypto.createDecipheriv(ALGORITHM, getKey(encryptionKey), iv)
  decipher.setAuthTag(tag)
  const decrypted = Buffer.concat([decipher.update(ct), decipher.final()])
  return JSON.parse(decrypted.toString('utf8')) as T
}
