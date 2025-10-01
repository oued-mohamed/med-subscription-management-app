import { type NextRequest, NextResponse } from "next/server"
import { sql, calculateEndDate, formatDateForSQL } from "@/lib/db"
import { getUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, phone, email, subscriptionType, startDate, amount } = await request.json()

    if (!name || !phone || !subscriptionType || !startDate) {
      return NextResponse.json(
        { error: "Name, phone, subscription type, and start date are required" },
        { status: 400 },
      )
    }

    // Insert client
    const clientResult = await sql`
      INSERT INTO clients (name, phone, email)
      VALUES (${name}, ${phone}, ${email || null})
      RETURNING id
    `

    const clientId = clientResult[0].id

    // Calculate end date
    const start = new Date(startDate)
    const end = calculateEndDate(start, subscriptionType)

    // Insert subscription
    await sql`
      INSERT INTO subscriptions (client_id, subscription_type, start_date, end_date, status, amount)
      VALUES (
        ${clientId},
        ${subscriptionType},
        ${formatDateForSQL(start)},
        ${formatDateForSQL(end)},
        'active',
        ${amount || null}
      )
    `

    return NextResponse.json({ success: true, clientId })
  } catch (error) {
    console.error("[v0] Create client error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
