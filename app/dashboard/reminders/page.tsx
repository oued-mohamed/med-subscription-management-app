import { getUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { sql } from "@/lib/db"
import { DashboardHeader } from "@/components/dashboard-header"
import { RemindersTable } from "@/components/reminders-table"
import { ReminderStats } from "@/components/reminder-stats"

async function getRemindersData() {
  try {
    // Get all reminders with client info
    const reminders = await sql`
      SELECT 
        r.id,
        r.message,
        r.scheduled_date,
        r.sent_date,
        r.status,
        r.reminder_type,
        r.created_at,
        c.name as client_name,
        c.phone as client_phone,
        s.subscription_type,
        s.end_date
      FROM reminders r
      JOIN clients c ON r.client_id = c.id
      JOIN subscriptions s ON r.subscription_id = s.id
      ORDER BY r.scheduled_date DESC, r.created_at DESC
    `

    // Get reminder stats
    const stats = await sql`
      SELECT 
        COUNT(*) FILTER (WHERE status = 'pending') as pending,
        COUNT(*) FILTER (WHERE status = 'delivered') as delivered,
        COUNT(*) FILTER (WHERE status = 'seen') as seen,
        COUNT(*) FILTER (WHERE status = 'failed') as failed
      FROM reminders
    `

    return {
      reminders,
      stats: stats[0],
    }
  } catch (error) {
    console.error("Database connection error:", error)
    return {
      reminders: [],
      stats: { pending: 0, delivered: 0, seen: 0, failed: 0 },
    }
  }
}

export default async function RemindersPage() {
  const user = await getUser()

  if (!user) {
    redirect("/login")
  }

  const data = await getRemindersData()

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} />

      <main className="container mx-auto p-6 space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">Reminders</h1>
            <p className="text-muted-foreground">Manage and track WhatsApp reminders</p>
          </div>
        </div>

        <ReminderStats stats={data.stats} />
        <RemindersTable reminders={data.reminders} />
      </main>
    </div>
  )
}
