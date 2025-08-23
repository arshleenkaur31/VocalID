import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const result = searchParams.get("result") // success, failed, warning
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    // Mock authentication history data
    const mockHistory = Array.from({ length: 100 }, (_, i) => ({
      id: `auth_${i + 1}`,
      userId: userId || `user_${Math.floor(Math.random() * 10) + 1}`,
      voiceProfileId: `profile_${Math.floor(Math.random() * 3) + 1}`,
      timestamp: new Date(Date.now() - i * 3600000).toISOString(),
      result: Math.random() > 0.1 ? "success" : Math.random() > 0.5 ? "failed" : "warning",
      confidence: 0.7 + Math.random() * 0.3,
      challengePhrase: [
        "My voice is my password",
        "Authentication successful",
        "The quick brown fox jumps over the lazy dog",
        "Secure access granted",
      ][Math.floor(Math.random() * 4)],
      spokenPhrase: "Transcribed speech...",
      ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      deviceFingerprint: `device_${Math.random().toString(36).substr(2, 9)}`,
      failureReason: Math.random() > 0.8 ? "Low confidence score" : null,
      scores: {
        speakerScore: 0.8 + Math.random() * 0.2,
        contentScore: 0.85 + Math.random() * 0.15,
        livenessScore: 0.9 + Math.random() * 0.1,
      },
    }))

    // Apply filters
    let filteredHistory = mockHistory
    if (userId) {
      filteredHistory = filteredHistory.filter((record) => record.userId === userId)
    }
    if (result) {
      filteredHistory = filteredHistory.filter((record) => record.result === result)
    }
    if (startDate) {
      filteredHistory = filteredHistory.filter((record) => new Date(record.timestamp) >= new Date(startDate))
    }
    if (endDate) {
      filteredHistory = filteredHistory.filter((record) => new Date(record.timestamp) <= new Date(endDate))
    }

    // Apply pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedHistory = filteredHistory.slice(startIndex, endIndex)

    return NextResponse.json({
      history: paginatedHistory,
      pagination: {
        page,
        limit,
        total: filteredHistory.length,
        totalPages: Math.ceil(filteredHistory.length / limit),
      },
      summary: {
        totalAttempts: filteredHistory.length,
        successfulAttempts: filteredHistory.filter((r) => r.result === "success").length,
        failedAttempts: filteredHistory.filter((r) => r.result === "failed").length,
        averageConfidence: filteredHistory.reduce((sum, r) => sum + r.confidence, 0) / filteredHistory.length || 0,
      },
    })
  } catch (error) {
    console.error("Authentication history fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch authentication history" }, { status: 500 })
  }
}
