import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "7d" // 1d, 7d, 30d, 90d
    const metric = searchParams.get("metric") || "all"

    // Mock analytics data
    const analytics = {
      authentication: {
        totalAttempts: 15634,
        successfulAttempts: 14821,
        failedAttempts: 813,
        successRate: 94.8,
        averageResponseTime: 1.2,
        peakHour: "14:00",
        trends: {
          daily: Array.from({ length: 7 }, (_, i) => ({
            date: new Date(Date.now() - (6 - i) * 24 * 3600000).toISOString().split("T")[0],
            successful: 1200 + Math.floor(Math.random() * 400),
            failed: 50 + Math.floor(Math.random() * 50),
          })),
          hourly: Array.from({ length: 24 }, (_, i) => ({
            hour: i.toString().padStart(2, "0") + ":00",
            attempts: 300 + Math.floor(Math.random() * 800),
            successRate: 90 + Math.random() * 10,
          })),
        },
      },
      users: {
        totalUsers: 1247,
        activeUsers: 892,
        newUsers: 23,
        userGrowthRate: 12.5,
        usersByStatus: {
          active: 892,
          inactive: 298,
          suspended: 57,
        },
        topUsers: Array.from({ length: 10 }, (_, i) => ({
          userId: `user_${i + 1}`,
          name: `User ${i + 1}`,
          authentications: 500 - i * 30,
          successRate: 95 - Math.random() * 5,
        })),
      },
      security: {
        threatsDetected: 247,
        threatsBlocked: 235,
        falsePositives: 12,
        threatsByType: {
          brute_force: 89,
          spoofing: 45,
          replay_attack: 67,
          suspicious_pattern: 46,
        },
        threatsBySeverity: {
          low: 123,
          medium: 78,
          high: 34,
          critical: 12,
        },
      },
      performance: {
        averageResponseTime: 1.2,
        p95ResponseTime: 2.1,
        p99ResponseTime: 3.4,
        throughput: 850,
        errorRate: 0.8,
        uptime: 99.97,
        systemLoad: {
          cpu: 68,
          memory: 52,
          disk: 34,
          network: 23,
        },
      },
    }

    // Filter by metric if specified
    if (metric !== "all" && analytics[metric as keyof typeof analytics]) {
      return NextResponse.json({ [metric]: analytics[metric as keyof typeof analytics] })
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error("Analytics fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
