import { type NextRequest, NextResponse } from "next/server"
import { sql, calculateEndDate, formatDateForSQL } from "@/lib/db"
import { getUser } from "@/lib/auth"
import * as XLSX from "xlsx"

export async function POST(request: NextRequest) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const buffer = await file.arrayBuffer()
    const workbook = XLSX.read(buffer)
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]
    const data = XLSX.utils.sheet_to_json(worksheet)

    let importedCount = 0

    for (const row of data as any[]) {
      try {
        const name = row.Name || row.name
        const phone = row.Phone || row.phone
        const email = row.Email || row.email || null
        const startDate = row["Start Date"] || row["start_date"] || row.startDate
        const subscriptionType = row["Subscription Type"] || row["subscription_type"] || row.subscriptionType

        if (!name || !phone || !startDate || !subscriptionType) {
          continue
        }

        // Insert client
        const clientResult = await sql`
          INSERT INTO clients (name, phone, email)
          VALUES (${name}, ${phone}, ${email})
          RETURNING id
        `

        const clientId = clientResult[0].id

        // Calculate end date
        const start = new Date(startDate)
        const end = calculateEndDate(start, subscriptionType)

        // Insert subscription
        await sql`
          INSERT INTO subscriptions (client_id, subscription_type, start_date, end_date, status)
          VALUES (
            ${clientId},
            ${subscriptionType},
            ${formatDateForSQL(start)},
            ${formatDateForSQL(end)},
            'active'
          )
        `

        importedCount++
      } catch (error) {
        console.error("[v0] Error importing row:", error)
      }
    }

    return NextResponse.json({ success: true, count: importedCount })
  } catch (error) {
    console.error("[v0] Import error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
