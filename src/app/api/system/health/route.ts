import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Mock system health data - replace with actual health checks
    const healthData = {
      status: "healthy", // healthy, warning, critical
      timestamp: new Date().toISOString(),
      uptime: "99.97%",
      version: "1.0.0",
      services: [
        {
          name: "Authentication API",
          status: "online",
          responseTime: 120,
          lastCheck: new Date().toISOString(),
          url: "/api/voice/authenticate",
        },
        {
          name: "Voice Processing",
          status: "online",
          responseTime: 850,
          lastCheck: new Date().toISOString(),
          url: "/api/voice/process",
        },
        {
          name: "Database",
          status: "online",
          responseTime: 45,
          lastCheck: new Date().toISOString(),
          connections: 12,
          maxConnections: 100,
        },
        {
          name: "ML Models",
          status: "degraded",
          responseTime: 1200,
          lastCheck: new Date().toISOString(),
          modelVersion: "v2.1.0",
          accuracy: 94.8,
        },
        {
          name: "Redis Cache",
          status: "online",
          responseTime: 15,
          lastCheck: new Date().toISOString(),
          memoryUsage: "45%",
        },
      ],
      metrics: {
        cpu: {
          usage: 68,
          cores: 8,
          loadAverage: [1.2, 1.5, 1.8],
        },
        memory: {
          used: 4.2,
          total: 8.0,
          usage: 52.5,
        },
        disk: {
          used: 120,
          total: 500,
          usage: 24,
        },
        network: {
          inbound: 1.2,
          outbound: 0.8,
          connections: 245,
        },
      },
      alerts: [
        {
          level: "warning",
          message: "ML Models response time above threshold",
          timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
        },
      ],
    }

    // Determine overall status
    const criticalServices = healthData.services.filter((s) => s.status === "offline")
    const degradedServices = healthData.services.filter((s) => s.status === "degraded")

    if (criticalServices.length > 0) {
      healthData.status = "critical"
    } else if (degradedServices.length > 0) {
      healthData.status = "warning"
    }

    return NextResponse.json(healthData)
  } catch (error) {
    console.error("Health check error:", error)
    return NextResponse.json(
      {
        status: "critical",
        timestamp: new Date().toISOString(),
        error: "Health check failed",
      },
      { status: 500 },
    )
  }
}
