import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Mock dashboard data - replace with actual database queries
    const dashboardData = {
      user: {
        id: "user_123",
        name: "John Doe",
        email: "john.doe@example.com",
        joinedDate: "2024-01-15",
      },
      voiceProfiles: [
        {
          id: "profile_1",
          name: "Primary Profile",
          isActive: true,
          enrolledAt: "2024-01-15T10:30:00Z",
          lastUsed: "2024-08-23T09:15:00Z",
          confidence: 0.96,
        },
        {
          id: "profile_2",
          name: "Mobile Profile",
          isActive: true,
          enrolledAt: "2024-02-01T14:20:00Z",
          lastUsed: "2024-08-22T16:45:00Z",
          confidence: 0.94,
        },
      ],
      recentActivity: [
        {
          id: "activity_1",
          type: "authentication",
          result: "success",
          timestamp: "2024-08-23T09:15:00Z",
          description: "Voice authentication successful",
        },
        {
          id: "activity_2",
          type: "authentication",
          result: "failed",
          timestamp: "2024-08-23T08:30:00Z",
          description: "Authentication failed - low confidence score",
        },
        {
          id: "activity_3",
          type: "security",
          result: "warning",
          timestamp: "2024-08-22T20:10:00Z",
          description: "Unusual authentication pattern detected",
        },
        {
          id: "activity_4",
          type: "enrollment",
          result: "success",
          timestamp: "2024-08-22T14:20:00Z",
          description: "New voice profile enrolled successfully",
        },
        {
          id: "activity_5",
          type: "authentication",
          result: "success",
          timestamp: "2024-08-22T10:45:00Z",
          description: "Voice authentication successful",
        },
      ],
      stats: {
        totalAuthentications: 247,
        successRate: 94.3,
        lastAuthentication: "2024-08-23T09:15:00Z",
        activeProfiles: 2,
      },
    }

    return NextResponse.json(dashboardData)
  } catch (error) {
    console.error("Dashboard data error:", error)
    return NextResponse.json({ error: "Failed to load dashboard data" }, { status: 500 })
  }
}
