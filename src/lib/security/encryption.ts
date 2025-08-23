import crypto from "crypto"

const ALGORITHM = "aes-256-gcm"
const KEY_LENGTH = 32
const IV_LENGTH = 16
const TAG_LENGTH = 16

export class VoiceDataEncryption {
  private static getKey(): Buffer {
    const key = process.env.VOICE_ENCRYPTION_KEY
    if (!key) {
      throw new Error("VOICE_ENCRYPTION_KEY environment variable is required")
    }
    return crypto.scryptSync(key, "salt", KEY_LENGTH)
  }

  static encrypt(data: Buffer): { encrypted: Buffer; iv: Buffer; tag: Buffer } {
    const key = this.getKey()
    const iv = crypto.randomBytes(IV_LENGTH)
    const cipher = crypto.createCipher(ALGORITHM, key)
    cipher.setAAD(Buffer.from("vocal-id-voice-data"))

    const encrypted = Buffer.concat([cipher.update(data), cipher.final()])
    const tag = cipher.getAuthTag()

    return { encrypted, iv, tag }
  }

  static decrypt(encrypted: Buffer, iv: Buffer, tag: Buffer): Buffer {
    const key = this.getKey()
    const decipher = crypto.createDecipher(ALGORITHM, key)
    decipher.setAuthTag(tag)
    decipher.setAAD(Buffer.from("vocal-id-voice-data"))

    return Buffer.concat([decipher.update(encrypted), decipher.final()])
  }

  static hashVoiceProfile(voiceData: Buffer): string {
    return crypto.createHash("sha256").update(voiceData).digest("hex")
  }
}

export class SecurityUtils {
  static generateSecureToken(length = 32): string {
    return crypto.randomBytes(length).toString("hex")
  }

  static hashPassword(password: string): string {
    const salt = crypto.randomBytes(16).toString("hex")
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex")
    return `${salt}:${hash}`
  }

  static verifyPassword(password: string, hashedPassword: string): boolean {
    const [salt, hash] = hashedPassword.split(":")
    const verifyHash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex")
    return hash === verifyHash
  }

  static sanitizeInput(input: string): string {
    return input.replace(/[<>"'&]/g, (match) => {
      const entities: { [key: string]: string } = {
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#x27;",
        "&": "&amp;",
      }
      return entities[match]
    })
  }
}
