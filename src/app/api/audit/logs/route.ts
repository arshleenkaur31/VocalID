import { type NextRequest, NextResponse } from "next/server"
import { AuditLogger } from "@/lib/security/audit-logger"
import { SessionManager } from "@/lib/security/session-manager"

export async function GET(request: NextRequest) {
  try {
    // Require admin access for audit logs
    const session = SessionManager.requireAdmin(request)

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId") || undefined
    const eventType = searchParams.get("eventType") || undefined
    const severity = searchParams.get("severity") || undefined
    const startDate = searchParams.get("startDate") || undefined
    const endDate = searchParams.get("endDate") || undefined
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : 100

    const logs = AuditLogger.getLogs({
      userId,
      eventType,
      severity,
      startDate,
      endDate,
      limit,
    })

    await AuditLogger.log({
      userId: session.userId,
      eventType: "audit_log_access",
      eventDescription: "Admin accessed audit logs",
      severity: "info",
      ipAddress: request.headers.get("x-forwarded-for") || request.ip || "unknown",
      userAgent: request.headers.get("user-agent") || undefined,
      additionalData: { filters: { userId, eventType, severity, startDate, endDate, limit } },
    })

    return NextResponse.json({
      logs,
      total: logs.length,
      filters: { userId, eventType, severity, startDate, endDate, limit },
    })
  } catch (error) {
    await AuditLogger.logSecurityEvent(
      "audit_log_access_error",
      `Failed to access audit logs: ${error}`,
      "error",
      undefined,
      request,
    )

    if (error instanceof Error && error.message.includes("required")) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    return NextResponse.json({ error: "Failed to fetch audit logs" }, { status: 500 })
  }
}
