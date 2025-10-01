import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getUser } from "@/lib/auth"

export async function PUT(request: NextRequest) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { template7Day, template1Day, templateExpiry } = await request.json()

    await sql`
      UPDATE settings
      SET value = ${template7Day}, updated_at = CURRENT_TIMESTAMP
      WHERE key = 'whatsapp_7day_template'
    `

    await sql`
      UPDATE settings
      SET value = ${template1Day}, updated_at = CURRENT_TIMESTAMP
      WHERE key = 'whatsapp_1day_template'
    `

    await sql`
      UPDATE settings
      SET value = ${templateExpiry}, updated_at = CURRENT_TIMESTAMP
      WHERE key = 'whatsapp_expiry_template'
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Update templates error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
