import type { NextRequest } from "next/server"

interface RateLimitConfig {
  windowMs: number
  maxRequests: number
  keyGenerator?: (req: NextRequest) => string
}

class RateLimiter {
  private requests: Map<string, { count: number; resetTime: number }> = new Map()

  constructor(private config: RateLimitConfig) {}

  async isAllowed(req: NextRequest): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    const key = this.config.keyGenerator ? this.config.keyGenerator(req) : this.getClientIP(req)
    const now = Date.now()
    const windowStart = now - this.config.windowMs

    let requestData = this.requests.get(key)

    if (!requestData || requestData.resetTime < now) {
      requestData = {
        count: 0,
        resetTime: now + this.config.windowMs,
      }
    }

    // Clean up old entries
    if (requestData.resetTime < windowStart) {
      requestData.count = 0
      requestData.resetTime = now + this.config.windowMs
    }

    requestData.count++
    this.requests.set(key, requestData)

    const allowed = requestData.count <= this.config.maxRequests
    const remaining = Math.max(0, this.config.maxRequests - requestData.count)

    return {
      allowed,
      remaining,
      resetTime: requestData.resetTime,
    }
  }

  private getClientIP(req: NextRequest): string {
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

// Rate limiters for different endpoints
export const authRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 attempts per 15 minutes
})

export const enrollmentRateLimiter = new RateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 3, // 3 enrollments per hour
})

export const apiRateLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100, // 100 requests per minute
})

export const adminRateLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 50, // 50 requests per minute for admin
})
