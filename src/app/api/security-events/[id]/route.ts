import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()

    const allowedFields = ["resolved", "notes"]
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

    // Mock event update - replace with actual database operation
    const updatedEvent = {
      id,
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({ event: updatedEvent, message: "Security event updated successfully" })
  } catch (error) {
    console.error("Security event update error:", error)
    return NextResponse.json({ error: "Failed to update security event" }, { status: 500 })
  }
}
