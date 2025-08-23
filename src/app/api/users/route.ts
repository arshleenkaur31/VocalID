import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || ""

    // Mock user data - replace with actual database query
    const mockUsers = Array.from({ length: 50 }, (_, i) => ({
      id: `user_${i + 1}`,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      status: Math.random() > 0.1 ? "active" : Math.random() > 0.5 ? "inactive" : "suspended",
      voiceProfiles: Math.floor(Math.random() * 3) + 1,
      lastLogin: new Date(Date.now() - Math.random() * 30 * 24 * 3600000).toISOString(),
      joinedDate: new Date(Date.now() - Math.random() * 365 * 24 * 3600000).toISOString(),
      totalAuthentications: Math.floor(Math.random() * 500) + 10,
      successRate: 85 + Math.random() * 15,
    }))

    // Apply filters
    let filteredUsers = mockUsers
    if (search) {
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase()),
      )
    }
    if (status) {
      filteredUsers = filteredUsers.filter((user) => user.status === status)
    }

    // Apply pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex)

    return NextResponse.json({
      users: paginatedUsers,
      pagination: {
        page,
        limit,
        total: filteredUsers.length,
        totalPages: Math.ceil(filteredUsers.length / limit),
      },
    })
  } catch (error) {
    console.error("Users API error:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Mock user creation - replace with actual database operation
    const newUser = {
      id: `user_${Date.now()}`,
      name,
      email,
      status: "active",
      voiceProfiles: 0,
      lastLogin: null,
      joinedDate: new Date().toISOString(),
      totalAuthentications: 0,
      successRate: 0,
    }

    return NextResponse.json({ user: newUser, message: "User created successfully" }, { status: 201 })
  } catch (error) {
    console.error("User creation error:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}
