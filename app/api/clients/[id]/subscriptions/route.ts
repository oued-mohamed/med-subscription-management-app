import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getUser } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const subscriptions = await sql`
      SELECT id, subscription_type, start_date, end_date, status, amount
      FROM subscriptions
      WHERE client_id = ${id}
      ORDER BY created_at DESC
    `

    return NextResponse.json({ subscriptions })
  } catch (error) {
    console.error("[v0] Get subscriptions error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
