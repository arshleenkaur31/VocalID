import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Mock voice profile data - replace with actual database query
    const mockProfile = {
      id,
      userId: "user_123",
      name: "Primary Profile",
      isActive: true,
      enrolledAt: "2024-01-15T10:30:00Z",
      lastUsed: "2024-08-23T09:15:00Z",
      confidence: 0.96,
      enrollmentPhrases: ["My voice is my password", "Authentication successful", "Secure access granted"],
      metadata: {
        audioQuality: "high",
        backgroundNoise: "low",
        enrollmentDuration: 120,
        totalAuthentications: 247,
        successfulAuthentications: 233,
        lastAuthenticationResult: "success",
      },
      analytics: {
        usageFrequency: "daily",
        averageConfidence: 0.94,
        peakUsageHours: ["09:00", "14:00", "18:00"],
      },
    }

    return NextResponse.json({ profile: mockProfile })
  } catch (error) {
    console.error("Voice profile fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch voice profile" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()

    const allowedFields = ["name", "isActive"]
    const updates = Object.keys(body).reduce(
      (acc, key) => {
        if (allowedFields.includes(key)) {
          acc[key] = body[key]
        }
        return acc
      },
      {} as Record<string, any>,
    )

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 })
    }

    // Mock profile update - replace with actual database operation
    const updatedProfile = {
      id,
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({ profile: updatedProfile, message: "Voice profile updated successfully" })
  } catch (error) {
    console.error("Voice profile update error:", error)
    return NextResponse.json({ error: "Failed to update voice profile" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Mock profile deletion - replace with actual database operation
    // Also need to securely delete voice biometric data
    console.log(`Deleting voice profile: ${id}`)

    return NextResponse.json({ message: "Voice profile deleted successfully" })
  } catch (error) {
    console.error("Voice profile deletion error:", error)
    return NextResponse.json({ error: "Failed to delete voice profile" }, { status: 500 })
  }
}
