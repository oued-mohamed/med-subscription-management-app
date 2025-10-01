import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getUser } from "@/lib/auth"
import * as XLSX from "xlsx"

export async function GET(request: NextRequest) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const format = searchParams.get("format") || "excel"
    const subscriptionType = searchParams.get("type")
    const timeRange = searchParams.get("range") || "6months"

    // Calculate date range
    let dateFilter = "CURRENT_DATE - INTERVAL '6 months'"
    switch (timeRange) {
      case "1month":
        dateFilter = "CURRENT_DATE - INTERVAL '1 month'"
        break
      case "3months":
        dateFilter = "CURRENT_DATE - INTERVAL '3 months'"
        break
      case "1year":
        dateFilter = "CURRENT_DATE - INTERVAL '1 year'"
        break
    }

    const typeFilter = subscriptionType ? sql`AND s.subscription_type = ${subscriptionType}` : sql``

    // Get detailed subscription data
    const data = await sql`
      SELECT 
        c.name as client_name,
        c.phone,
        c.email,
        s.subscription_type,
        s.start_date,
        s.end_date,
        s.status,
        s.amount,
        s.created_at
      FROM subscriptions s
      JOIN clients c ON s.client_id = c.id
      WHERE s.created_at >= ${sql.unsafe(dateFilter)}
      ${typeFilter}
      ORDER BY s.created_at DESC
    `

    if (format === "excel") {
      // Create Excel workbook
      const worksheet = XLSX.utils.json_to_sheet(
        data.map((row) => ({
          "Client Name": row.client_name,
          Phone: row.phone,
          Email: row.email || "N/A",
          "Subscription Type": row.subscription_type,
          "Start Date": row.start_date,
          "End Date": row.end_date,
          Status: row.status,
          Amount: Number(row.amount || 0).toFixed(2),
          "Created At": row.created_at,
        })),
      )

      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, "Subscriptions")

      const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" })

      return new NextResponse(buffer, {
        headers: {
          "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": `attachment; filename="subtrackr-report-${new Date().toISOString().split("T")[0]}.xlsx"`,
        },
      })
    } else if (format === "pdf") {
      // For PDF, we'll create a simple HTML-based PDF
      // In production, you'd use a library like puppeteer or pdfkit
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #0ea5e9; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #0ea5e9; color: white; }
          </style>
        </head>
        <body>
          <h1>SubTrackr Report</h1>
          <p>Generated: ${new Date().toLocaleDateString()}</p>
          <table>
            <thead>
              <tr>
                <th>Client Name</th>
                <th>Phone</th>
                <th>Subscription Type</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${data
                .map(
                  (row) => `
                <tr>
                  <td>${row.client_name}</td>
                  <td>${row.phone}</td>
                  <td>${row.subscription_type}</td>
                  <td>${row.start_date}</td>
                  <td>${row.end_date}</td>
                  <td>${row.status}</td>
                  <td>$${Number(row.amount || 0).toFixed(2)}</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
        </body>
        </html>
      `

      return new NextResponse(html, {
        headers: {
          "Content-Type": "text/html",
          "Content-Disposition": `attachment; filename="subtrackr-report-${new Date().toISOString().split("T")[0]}.html"`,
        },
      })
    }

    return NextResponse.json({ error: "Invalid format" }, { status: 400 })
  } catch (error) {
    console.error("[v0] Export error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
