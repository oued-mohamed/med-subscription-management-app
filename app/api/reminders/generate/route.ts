import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get message templates
    const templates = await sql`
      SELECT key, value FROM settings
      WHERE key IN ('whatsapp_7day_template', 'whatsapp_1day_template', 'whatsapp_expiry_template')
    `

    const templateMap = new Map(templates.map((t) => [t.key, t.value]))

    // Find subscriptions expiring in 7 days
    const expiring7Days = await sql`
      SELECT s.id as subscription_id, s.client_id, s.end_date, c.name, c.phone
      FROM subscriptions s
      JOIN clients c ON s.client_id = c.id
      WHERE s.status = 'active'
      AND s.end_date = CURRENT_DATE + INTERVAL '7 days'
      AND NOT EXISTS (
        SELECT 1 FROM reminders r
        WHERE r.subscription_id = s.id
        AND r.reminder_type = '7_days'
      )
    `

    // Find subscriptions expiring in 1 day
    const expiring1Day = await sql`
      SELECT s.id as subscription_id, s.client_id, s.end_date, c.name, c.phone
      FROM subscriptions s
      JOIN clients c ON s.client_id = c.id
      WHERE s.status = 'active'
      AND s.end_date = CURRENT_DATE + INTERVAL '1 day'
      AND NOT EXISTS (
        SELECT 1 FROM reminders r
        WHERE r.subscription_id = s.id
        AND r.reminder_type = '1_day'
      )
    `

    // Find subscriptions expiring today
    const expiringToday = await sql`
      SELECT s.id as subscription_id, s.client_id, s.end_date, c.name, c.phone
      FROM subscriptions s
      JOIN clients c ON s.client_id = c.id
      WHERE s.status = 'active'
      AND s.end_date = CURRENT_DATE
      AND NOT EXISTS (
        SELECT 1 FROM reminders r
        WHERE r.subscription_id = s.id
        AND r.reminder_type = 'expiry'
      )
    `

    let count = 0

    // Create 7-day reminders
    for (const sub of expiring7Days) {
      const message = (templateMap.get("whatsapp_7day_template") || "")
        .replace("{name}", sub.name)
        .replace("{end_date}", sub.end_date)

      await sql`
        INSERT INTO reminders (subscription_id, client_id, message, scheduled_date, reminder_type, status)
        VALUES (${sub.subscription_id}, ${sub.client_id}, ${message}, ${sub.end_date}::date - INTERVAL '7 days', '7_days', 'pending')
      `
      count++
    }

    // Create 1-day reminders
    for (const sub of expiring1Day) {
      const message = (templateMap.get("whatsapp_1day_template") || "")
        .replace("{name}", sub.name)
        .replace("{end_date}", sub.end_date)

      await sql`
        INSERT INTO reminders (subscription_id, client_id, message, scheduled_date, reminder_type, status)
        VALUES (${sub.subscription_id}, ${sub.client_id}, ${message}, ${sub.end_date}::date - INTERVAL '1 day', '1_day', 'pending')
      `
      count++
    }

    // Create expiry day reminders
    for (const sub of expiringToday) {
      const message = (templateMap.get("whatsapp_expiry_template") || "")
        .replace("{name}", sub.name)
        .replace("{end_date}", sub.end_date)

      await sql`
        INSERT INTO reminders (subscription_id, client_id, message, scheduled_date, reminder_type, status)
        VALUES (${sub.subscription_id}, ${sub.client_id}, ${message}, ${sub.end_date}, 'expiry', 'pending')
      `
      count++
    }

    return NextResponse.json({ success: true, count })
  } catch (error) {
    console.error("[v0] Generate reminders error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
