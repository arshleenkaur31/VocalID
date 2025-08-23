import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Mock voice profiles data - replace with actual database query
    const mockProfiles = [
      {
        id: "profile_1",
        userId,
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
        },
      },
      {
        id: "profile_2",
        userId,
        name: "Mobile Profile",
        isActive: true,
        enrolledAt: "2024-02-01T14:20:00Z",
        lastUsed: "2024-08-22T16:45:00Z",
        confidence: 0.94,
        enrollmentPhrases: ["Voice authentication active", "Mobile security enabled", "Identity verified"],
        metadata: {
          audioQuality: "medium",
          backgroundNoise: "medium",
          enrollmentDuration: 95,
        },
      },
    ]

    return NextResponse.json({ profiles: mockProfiles })
  } catch (error) {
    console.error("Voice profiles fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch voice profiles" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, name, enrollmentData } = body

    if (!userId || !name || !enrollmentData) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Mock profile creation - replace with actual voice processing and database operation
    const newProfile = {
      id: `profile_${Date.now()}`,
      userId,
      name,
      isActive: true,
      enrolledAt: new Date().toISOString(),
      lastUsed: null,
      confidence: 0.95,
      enrollmentPhrases: enrollmentData.phrases || [],
      metadata: {
        audioQuality: "high",
        backgroundNoise: "low",
        enrollmentDuration: enrollmentData.duration || 120,
      },
    }

    return NextResponse.json({ profile: newProfile, message: "Voice profile created successfully" }, { status: 201 })
  } catch (error) {
    console.error("Voice profile creation error:", error)
    return NextResponse.json({ error: "Failed to create voice profile" }, { status: 500 })
  }
}
