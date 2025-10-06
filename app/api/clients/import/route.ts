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
        // Handle both English and French column headers
        const name = row.Name || row.name || row["Nom du Client"] || row["nom_du_client"]
        const phone = row.Phone || row.phone || row["Téléphone"] || row["telephone"]
        const email = row.Email || row.email || row["Email"] || null
        const startDate = row["Start Date"] || row["start_date"] || row.startDate || row["Date Début"] || row["date_debut"]
        
        // Map French duration to English subscription types
        let subscriptionType = row["Subscription Type"] || row["subscription_type"] || row.subscriptionType
        const duration = row["Durée Abonnement"] || row["duree_abonnement"]
        
        if (duration) {
          if (duration.includes("mois") || duration.includes("month")) {
            subscriptionType = "Monthly"
          } else if (duration.includes("ans") || duration.includes("year")) {
            subscriptionType = "Yearly"
          } else if (duration.includes("3 mois") || duration.includes("3 months")) {
            subscriptionType = "3 Months"
          }
        }

        if (!name || !phone || !startDate) {
          console.log("Skipping row - missing required fields:", { name, phone, startDate, subscriptionType })
          continue
        }

        // Clean and format phone number (handle scientific notation)
        let cleanPhone = phone.toString()
        if (cleanPhone.includes('E+') || cleanPhone.includes('e+')) {
          // Convert scientific notation to regular number
          cleanPhone = parseFloat(cleanPhone).toString()
        }
        // Ensure phone starts with + if it's a number
        if (!cleanPhone.startsWith('+') && !cleanPhone.startsWith('0')) {
          cleanPhone = '+' + cleanPhone
        }

        // Parse date (handle DD/MM/YYYY format)
        let parsedStartDate: Date
        try {
          if (startDate.toString().includes('/')) {
            // Handle DD/MM/YYYY format
            const parts = startDate.toString().split('/')
            if (parts.length === 3) {
              const day = parseInt(parts[0])
              const month = parseInt(parts[1]) - 1 // JavaScript months are 0-indexed
              const year = parseInt(parts[2])
              parsedStartDate = new Date(year, month, day)
            } else {
              parsedStartDate = new Date(startDate)
            }
          } else {
            parsedStartDate = new Date(startDate)
          }
        } catch (error) {
          console.log("Invalid date format:", startDate)
          continue
        }

        // Set default subscription type if not determined
        if (!subscriptionType) {
          subscriptionType = "Monthly" // Default to Monthly
        }

        // Insert client
        const clientResult = await sql`
          INSERT INTO clients (name, phone, email)
          VALUES (${name}, ${cleanPhone}, ${email})
          RETURNING id
        `

        const clientId = clientResult[0].id

        // Calculate end date
        const end = calculateEndDate(parsedStartDate, subscriptionType)

        // Insert subscription
        await sql`
          INSERT INTO subscriptions (client_id, subscription_type, start_date, end_date, status)
          VALUES (
            ${clientId},
            ${subscriptionType},
            ${formatDateForSQL(parsedStartDate)},
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
