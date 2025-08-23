import { type NextRequest, NextResponse } from "next/server"
import { authRateLimiter, apiRateLimiter, adminRateLimiter } from "./lib/security/rate-limiter"
import { SessionManager } from "./lib/security/session-manager"
import { AuditLogger } from "./lib/security/audit-logger"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const startTime = Date.now()

  try {
    if (pathname.startsWith("/api/")) {
      const rateLimiter = pathname.startsWith("/api/admin/")
        ? adminRateLimiter
        : pathname.includes("/auth") || pathname.includes("/enroll")
          ? authRateLimiter
          : apiRateLimiter

      const rateLimit = await rateLimiter.isAllowed(request)

      if (!rateLimit.allowed) {
        await AuditLogger.logSecurityEvent(
          "rate_limit_exceeded",
          `Rate limit exceeded for ${pathname}`,
          "warning",
          undefined,
          request,
          { remaining: rateLimit.remaining, resetTime: rateLimit.resetTime },
        )

        return NextResponse.json(
          {
            error: "Rate limit exceeded",
            retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000),
          },
          {
            status: 429,
            headers: {
              "X-RateLimit-Remaining": rateLimit.remaining.toString(),
              "X-RateLimit-Reset": rateLimit.resetTime.toString(),
              "Retry-After": Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString(),
            },
          },
        )
      }

      const response = NextResponse.next()
      response.headers.set("X-Content-Type-Options", "nosniff")
      response.headers.set("X-Frame-Options", "DENY")
      response.headers.set("X-XSS-Protection", "1; mode=block")
      response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
      response.headers.set("X-RateLimit-Remaining", rateLimit.remaining.toString())
      response.headers.set("X-RateLimit-Reset", rateLimit.resetTime.toString())

      response.headers.set("X-Request-ID", `req_${Date.now()}_${Math.random().toString(36).substring(2)}`)

      // Log the request (we'll log the response in the API routes)
      await AuditLogger.logRequest(request, 200, {
        rateLimitRemaining: rateLimit.remaining,
        processingTime: Date.now() - startTime,
      })

      return response
    }

    if (pathname.startsWith("/admin")) {
      try {
        const session = SessionManager.extractSessionFromRequest(request)

        if (!session || session.role !== "admin") {
          await AuditLogger.logSecurityEvent(
            "unauthorized_admin_access",
            `Unauthorized admin access attempt to ${pathname}`,
            "warning",
            session?.userId,
            request,
          )

          return NextResponse.redirect(new URL("/", request.url))
        }

        await AuditLogger.log({
          userId: session.userId,
          eventType: "admin_access",
          eventDescription: `Admin accessed ${pathname}`,
          severity: "info",
          ipAddress: AuditLogger["getClientIP"](request),
          userAgent: request.headers.get("user-agent") || undefined,
          requestPath: pathname,
          additionalData: { sessionId: session.sessionId },
        })
      } catch (error) {
        await AuditLogger.logSecurityEvent(
          "admin_auth_error",
          `Admin authentication error: ${error}`,
          "error",
          undefined,
          request,
        )

        return NextResponse.redirect(new URL("/", request.url))
      }
    }

    if (pathname.startsWith("/dashboard")) {
      try {
        const session = SessionManager.extractSessionFromRequest(request)

        if (!session) {
          await AuditLogger.logSecurityEvent(
            "unauthorized_dashboard_access",
            `Unauthorized dashboard access attempt to ${pathname}`,
            "warning",
            undefined,
            request,
          )

          return NextResponse.redirect(new URL("/", request.url))
        }
      } catch (error) {
        await AuditLogger.logSecurityEvent(
          "dashboard_auth_error",
          `Dashboard authentication error: ${error}`,
          "error",
          undefined,
          request,
        )

        return NextResponse.redirect(new URL("/", request.url))
      }
    }

    return NextResponse.next()
  } catch (error) {
    await AuditLogger.logSecurityEvent(
      "middleware_error",
      `Middleware error: ${error}`,
      "critical",
      undefined,
      request,
      { error: String(error), processingTime: Date.now() - startTime },
    )

    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
