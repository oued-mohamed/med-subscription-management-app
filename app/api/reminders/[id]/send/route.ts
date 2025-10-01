import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getUser } from "@/lib/auth"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    // Get reminder details
    const reminders = await sql`
      SELECT r.*, c.phone, c.name
      FROM reminders r
      JOIN clients c ON r.client_id = c.id
      WHERE r.id = ${id}
    `

    if (reminders.length === 0) {
      return NextResponse.json({ error: "Reminder not found" }, { status: 404 })
    }

    const reminder = reminders[0]

    // In a real implementation, this would call the WhatsApp API
    // For now, we'll simulate sending and mark as delivered
    console.log("[v0] Sending WhatsApp message to:", reminder.phone)
    console.log("[v0] Message:", reminder.message)

    // Update reminder status
    await sql`
      UPDATE reminders
      SET status = 'delivered', sent_date = CURRENT_TIMESTAMP
      WHERE id = ${id}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Send reminder error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
