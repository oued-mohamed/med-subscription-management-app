import { getUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { sql } from "@/lib/db"
import { DashboardHeader } from "@/components/dashboard-header"
import { ClientsTable } from "@/components/clients-table"
import { AddClientButton } from "@/components/add-client-button"
import { ImportClientsButton } from "@/components/import-clients-button"

async function getClientsData() {
  try {
    const clients = await sql`
      SELECT 
        c.id,
        c.name,
        c.phone,
        c.email,
        c.created_at,
        COUNT(s.id) as subscription_count,
        MAX(s.end_date) as latest_expiry,
        SUM(CASE WHEN s.status = 'active' THEN 1 ELSE 0 END) as active_count
      FROM clients c
      LEFT JOIN subscriptions s ON c.id = s.client_id
      GROUP BY c.id, c.name, c.phone, c.email, c.created_at
      ORDER BY c.created_at DESC
    `

    return clients
  } catch (error) {
    console.error("Database connection error:", error)
    return []
  }
}

export default async function ClientsPage() {
  const user = await getUser()

  if (!user) {
    redirect("/login")
  }

  const clients = await getClientsData()

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} />

      <main className="container mx-auto p-6 space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">Clients</h1>
            <p className="text-muted-foreground">Manage your clients and their subscriptions</p>
          </div>
          <div className="flex gap-3">
            <ImportClientsButton />
            <AddClientButton />
          </div>
        </div>

        <ClientsTable clients={clients} />
      </main>
    </div>
  )
}
