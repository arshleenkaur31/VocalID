import jwt from "jsonwebtoken"
import type { NextRequest } from "next/server"

export interface SessionData {
  userId: string
  email: string
  role: "user" | "admin"
  voiceProfileId?: string
  lastAuthenticated: number
  sessionId: string
}

export class SessionManager {
  private static readonly JWT_SECRET = process.env.JWT_SECRET || "vocal-id-secret-key"
  private static readonly SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 hours
  private static readonly REFRESH_THRESHOLD = 2 * 60 * 60 * 1000 // 2 hours

  static generateSession(userData: Omit<SessionData, "sessionId" | "lastAuthenticated">): string {
    const sessionData: SessionData = {
      ...userData,
      sessionId: this.generateSessionId(),
      lastAuthenticated: Date.now(),
    }

    return jwt.sign(sessionData, this.JWT_SECRET, {
      expiresIn: "24h",
      issuer: "vocal-id",
      audience: "vocal-id-users",
    })
  }

  static verifySession(token: string): SessionData | null {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET, {
        issuer: "vocal-id",
        audience: "vocal-id-users",
      }) as SessionData

      // Check if session is still valid
      const now = Date.now()
      if (now - decoded.lastAuthenticated > this.SESSION_DURATION) {
        return null
      }

      return decoded
    } catch (error) {
      console.error("Session verification failed:", error)
      return null
    }
  }

  static refreshSession(token: string): string | null {
    const sessionData = this.verifySession(token)
    if (!sessionData) return null

    const now = Date.now()
    const timeSinceAuth = now - sessionData.lastAuthenticated

    // Only refresh if within refresh threshold
    if (timeSinceAuth < this.REFRESH_THRESHOLD) {
      sessionData.lastAuthenticated = now
      sessionData.sessionId = this.generateSessionId()

      return jwt.sign(sessionData, this.JWT_SECRET, {
        expiresIn: "24h",
        issuer: "vocal-id",
        audience: "vocal-id-users",
      })
    }

    return null
  }

  static extractSessionFromRequest(req: NextRequest): SessionData | null {
    const authHeader = req.headers.get("authorization")
    const cookieToken = req.cookies.get("vocal-id-session")?.value

    const token = authHeader?.replace("Bearer ", "") || cookieToken
    if (!token) return null

    return this.verifySession(token)
  }

  static requireAuth(req: NextRequest): SessionData {
    const session = this.extractSessionFromRequest(req)
    if (!session) {
      throw new Error("Authentication required")
    }
    return session
  }

  static requireAdmin(req: NextRequest): SessionData {
    const session = this.requireAuth(req)
    if (session.role !== "admin") {
      throw new Error("Admin access required")
    }
    return session
  }

  private static generateSessionId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
  }

  static invalidateSession(sessionId: string): void {
    // In a real implementation, you would store invalidated sessions in a database
    // For now, we'll just log the invalidation
    console.log(`Session invalidated: ${sessionId}`)
  }
}
