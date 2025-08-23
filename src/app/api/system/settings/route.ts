import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    // Mock system settings - replace with actual database query
    const settings = {
      authentication: {
        confidenceThreshold: 95,
        maxAttempts: 3,
        lockoutDuration: 15,
        enableLivenessDetection: true,
        enableAntiSpoofing: true,
        sessionTimeout: 3600,
      },
      security: {
        enableRateLimiting: true,
        maxRequestsPerMinute: 100,
        enableGeoBlocking: false,
        suspiciousActivityThreshold: 80,
        autoBlockEnabled: true,
        passwordPolicy: {
          minLength: 8,
          requireUppercase: true,
          requireLowercase: true,
          requireNumbers: true,
          requireSymbols: true,
        },
      },
      system: {
        enableLogging: true,
        logRetentionDays: 90,
        enableMetrics: true,
        maintenanceMode: false,
        backupFrequency: "daily",
        enableNotifications: true,
      },
      ml: {
        modelVersion: "v2.1.0",
        confidenceThreshold: 0.85,
        retrainingFrequency: "weekly",
        enableContinuousLearning: true,
        batchSize: 32,
      },
    }

    return NextResponse.json({ settings })
  } catch (error) {
    console.error("Settings fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { category, settings } = body

    if (!category || !settings) {
      return NextResponse.json({ error: "Missing category or settings" }, { status: 400 })
    }

    // Validate category
    const validCategories = ["authentication", "security", "system", "ml"]
    if (!validCategories.includes(category)) {
      return NextResponse.json({ error: "Invalid settings category" }, { status: 400 })
    }

    // Mock settings update - replace with actual database operation
    console.log(`Updating ${category} settings:`, settings)

    // Validate specific settings based on category
    if (category === "authentication") {
      if (settings.confidenceThreshold && (settings.confidenceThreshold < 50 || settings.confidenceThreshold > 100)) {
        return NextResponse.json({ error: "Confidence threshold must be between 50 and 100" }, { status: 400 })
      }
    }

    return NextResponse.json({
      message: `${category} settings updated successfully`,
      updatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Settings update error:", error)
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}
