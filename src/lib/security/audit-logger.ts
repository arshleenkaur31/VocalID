import type { NextRequest } from "next/server"

export interface AuditLogEntry {
  id: string
  timestamp: string
  userId?: string
  sessionId?: string
  eventType: string
  eventDescription: string
  severity: "info" | "warning" | "error" | "critical"
  ipAddress?: string
  userAgent?: string
  requestPath?: string
  requestMethod?: string
  responseStatus?: number
  additionalData?: Record<string, any>
}

export class AuditLogger {
  private static logs: AuditLogEntry[] = []

  static async log(entry: Omit<AuditLogEntry, "id" | "timestamp">): Promise<void> {
    const logEntry: AuditLogEntry = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(2)}`,
      timestamp: new Date().toISOString(),
      ...entry,
    }

    // Store in memory (in production, this would go to a database)
    this.logs.push(logEntry)

    // Keep only last 1000 entries in memory
    if (this.logs.length > 1000) {
      this.logs = this.logs.slice(-1000)
    }

    // In production, you would also:
    // 1. Store in database
    // 2. Send to external logging service
    // 3. Trigger alerts for critical events

    console.log(`[AUDIT] ${logEntry.severity.toUpperCase()}: ${logEntry.eventDescription}`)

    // Create security event for high severity logs
    if (entry.severity === "error" || entry.severity === "critical") {
      await this.createSecurityEvent(logEntry)
    }
  }

  static async logRequest(
    req: NextRequest,
    responseStatus: number,
    additionalData?: Record<string, any>,
  ): Promise<void> {
    await this.log({
      eventType: "api_request",
      eventDescription: `${req.method} ${req.nextUrl.pathname}`,
      severity: responseStatus >= 400 ? "warning" : "info",
      ipAddress: this.getClientIP(req),
      userAgent: req.headers.get("user-agent") || undefined,
      requestPath: req.nextUrl.pathname,
      requestMethod: req.method,
      responseStatus,
      additionalData,
    })
  }

  static async logAuthentication(
    userId: string,
    success: boolean,
    req: NextRequest,
    additionalData?: Record<string, any>,
  ): Promise<void> {
    await this.log({
      userId,
      eventType: success ? "auth_success" : "auth_failure",
      eventDescription: success ? "User authentication successful" : "User authentication failed",
      severity: success ? "info" : "warning",
      ipAddress: this.getClientIP(req),
      userAgent: req.headers.get("user-agent") || undefined,
      additionalData,
    })
  }

  static async logSecurityEvent(
    eventType: string,
    description: string,
    severity: "info" | "warning" | "error" | "critical",
    userId?: string,
    req?: NextRequest,
    additionalData?: Record<string, any>,
  ): Promise<void> {
    await this.log({
      userId,
      eventType,
      eventDescription: description,
      severity,
      ipAddress: req ? this.getClientIP(req) : undefined,
      userAgent: req?.headers.get("user-agent") || undefined,
      additionalData,
    })
  }

  static getLogs(filters?: {
    userId?: string
    eventType?: string
    severity?: string
    startDate?: string
    endDate?: string
    limit?: number
  }): AuditLogEntry[] {
    let filteredLogs = [...this.logs]

    if (filters) {
      if (filters.userId) {
        filteredLogs = filteredLogs.filter((log) => log.userId === filters.userId)
      }
      if (filters.eventType) {
        filteredLogs = filteredLogs.filter((log) => log.eventType === filters.eventType)
      }
      if (filters.severity) {
        filteredLogs = filteredLogs.filter((log) => log.severity === filters.severity)
      }
      if (filters.startDate) {
        filteredLogs = filteredLogs.filter((log) => log.timestamp >= filters.startDate!)
      }
      if (filters.endDate) {
        filteredLogs = filteredLogs.filter((log) => log.timestamp <= filters.endDate!)
      }
      if (filters.limit) {
        filteredLogs = filteredLogs.slice(-filters.limit)
      }
    }

    return filteredLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }

  private static async createSecurityEvent(logEntry: AuditLogEntry): Promise<void> {
    // This would typically make an API call to create a security event
    // For now, we'll just log it
    console.log(`[SECURITY EVENT] ${logEntry.eventDescription}`)
  }

  private static getClientIP(req: NextRequest): string {
    const forwarded = req.headers.get("x-forwarded-for")
    const realIP = req.headers.get("x-real-ip")

    if (forwarded) {
      return forwarded.split(",")[0].trim()
    }

    if (realIP) {
      return realIP
    }

    return req.ip || "unknown"
  }
}
