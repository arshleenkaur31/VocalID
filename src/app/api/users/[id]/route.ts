import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Mock user data - replace with actual database query
    const mockUser = {
      id,
      name: "John Doe",
      email: "john.doe@example.com",
      status: "active",
      voiceProfiles: 2,
      lastLogin: new Date(Date.now() - 2 * 3600000).toISOString(),
      joinedDate: "2024-01-15T10:30:00Z",
      totalAuthentications: 247,
      successRate: 94.3,
      profile: {
        phone: "+1-555-0123",
        department: "Engineering",
        role: "Software Developer",
        preferences: {
          emailNotifications: true,
          smsNotifications: false,
          securityAlerts: true,
        },
      },
    }

    return NextResponse.json({ user: mockUser })
  } catch (error) {
    console.error("User fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()

    // Validate required fields
    const allowedFields = ["name", "email", "status", "profile"]
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

    // Mock user update - replace with actual database operation
    const updatedUser = {
      id,
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({ user: updatedUser, message: "User updated successfully" })
  } catch (error) {
    console.error("User update error:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Mock user deletion - replace with actual database operation
    // In a real implementation, you might want to soft delete or archive the user
    console.log(`Deleting user: ${id}`)

    return NextResponse.json({ message: "User deleted successfully" })
  } catch (error) {
    console.error("User deletion error:", error)
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
  }
}
