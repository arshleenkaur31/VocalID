import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const severity = searchParams.get("severity")
    const type = searchParams.get("type")
    const resolved = searchParams.get("resolved")

    // Mock security events data
    const mockEvents = Array.from({ length: 50 }, (_, i) => ({
      id: `event_${i + 1}`,
      type: ["suspicious_activity", "failed_attempts", "new_device", "security_alert"][Math.floor(Math.random() * 4)],
      severity: ["low", "medium", "high", "critical"][Math.floor(Math.random() * 4)],
      title: [
        "Unusual Authentication Pattern",
        "Multiple Failed Authentications",
        "New Device Authentication",
        "Potential Voice Spoofing Attempt",
      ][Math.floor(Math.random() * 4)],
      description: "Security event description...",
      timestamp: new Date(Date.now() - i * 3600000).toISOString(),
      resolved: Math.random() > 0.3,
      userId: `user_${Math.floor(Math.random() * 10) + 1}`,
      ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
      metadata: {
        attempts: Math.floor(Math.random() * 10) + 1,
        locations: ["New York", "London", "Tokyo"][Math.floor(Math.random() * 3)],
        confidence: Math.random(),
      },
    }))

    // Apply filters
    let filteredEvents = mockEvents
    if (severity) {
      filteredEvents = filteredEvents.filter((event) => event.severity === severity)
    }
    if (type) {
      filteredEvents = filteredEvents.filter((event) => event.type === type)
    }
    if (resolved !== null) {
      filteredEvents = filteredEvents.filter((event) => event.resolved === (resolved === "true"))
    }

    // Apply pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedEvents = filteredEvents.slice(startIndex, endIndex)

    return NextResponse.json({
      events: paginatedEvents,
      pagination: {
        page,
        limit,
        total: filteredEvents.length,
        totalPages: Math.ceil(filteredEvents.length / limit),
      },
      summary: {
        totalEvents: filteredEvents.length,
        activeThreats: filteredEvents.filter((e) => !e.resolved && (e.severity === "high" || e.severity === "critical"))
          .length,
        resolvedEvents: filteredEvents.filter((e) => e.resolved).length,
      },
    })
  } catch (error) {
    console.error("Security events fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch security events" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, severity, title, description, userId, ipAddress, metadata } = body

    if (!type || !severity || !title || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Mock event creation - replace with actual database operation
    const newEvent = {
      id: `event_${Date.now()}`,
      type,
      severity,
      title,
      description,
      timestamp: new Date().toISOString(),
      resolved: false,
      userId,
      ipAddress,
      metadata: metadata || {},
    }

    return NextResponse.json({ event: newEvent, message: "Security event created successfully" }, { status: 201 })
  } catch (error) {
    console.error("Security event creation error:", error)
    return NextResponse.json({ error: "Failed to create security event" }, { status: 500 })
  }
}
