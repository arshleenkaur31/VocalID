import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Mock admin dashboard data - replace with actual database queries
    const adminData = {
      systemStats: {
        totalUsers: 1247,
        activeUsers: 892,
        totalAuthentications: 15634,
        systemUptime: "99.97%",
        averageResponseTime: 1.2,
        successRate: 94.8,
      },
      recentAlerts: [
        {
          id: "alert_1",
          type: "security",
          severity: "high",
          message: "Multiple failed authentication attempts detected from IP 192.168.1.100",
          timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
          resolved: false,
        },
        {
          id: "alert_2",
          type: "system",
          severity: "medium",
          message: "Voice processing service response time above threshold",
          timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
          resolved: true,
        },
        {
          id: "alert_3",
          type: "user",
          severity: "low",
          message: "New user enrollment spike detected",
          timestamp: new Date(Date.now() - 6 * 3600000).toISOString(),
          resolved: true,
        },
      ],
      systemHealth: {
        status: "healthy",
        services: [
          { name: "Authentication API", status: "online", responseTime: 120 },
          { name: "Voice Processing", status: "online", responseTime: 850 },
          { name: "Database", status: "online", responseTime: 45 },
          { name: "ML Models", status: "degraded", responseTime: 1200 },
        ],
      },
    }

    return NextResponse.json(adminData)
  } catch (error) {
    console.error("Admin dashboard error:", error)
    return NextResponse.json({ error: "Failed to load admin dashboard data" }, { status: 500 })
  }
}
