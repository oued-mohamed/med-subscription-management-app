import { getUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { sql } from "@/lib/db"
import { DashboardHeader } from "@/components/dashboard-header"
import { ReportsFilters } from "@/components/reports-filters"
import { RevenueChart } from "@/components/revenue-chart"
import { SubscriptionBreakdown } from "@/components/subscription-breakdown"
import { RevenueForecast } from "@/components/revenue-forecast"

async function getReportsData(searchParams: { [key: string]: string | string[] | undefined }) {
  const subscriptionType = searchParams.type as string | undefined
  const timeRange = (searchParams.range as string) || "6months"

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

  // Build subscription type filter
  const typeFilter = subscriptionType ? sql`AND subscription_type = ${subscriptionType}` : sql``

  // Get revenue over time
  const revenueData = await sql`
    SELECT 
      TO_CHAR(DATE_TRUNC('month', created_at), 'Mon YYYY') as month,
      DATE_TRUNC('month', created_at) as month_date,
      COALESCE(SUM(amount), 0) as revenue,
      COUNT(*) as count
    FROM subscriptions
    WHERE created_at >= ${sql.unsafe(dateFilter)}
    ${typeFilter}
    GROUP BY DATE_TRUNC('month', created_at)
    ORDER BY DATE_TRUNC('month', created_at) ASC
  `

  // Get subscription breakdown by type
  const breakdown = await sql`
    SELECT 
      subscription_type,
      COUNT(*) as count,
      SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active,
      COALESCE(SUM(amount), 0) as total_revenue
    FROM subscriptions
    WHERE created_at >= ${sql.unsafe(dateFilter)}
    GROUP BY subscription_type
    ORDER BY count DESC
  `

  // Get total stats
  const stats = await sql`
    SELECT 
      COUNT(*) as total_subscriptions,
      SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_subscriptions,
      COALESCE(SUM(amount), 0) as total_revenue,
      COALESCE(AVG(amount), 0) as avg_revenue
    FROM subscriptions
    WHERE created_at >= ${sql.unsafe(dateFilter)}
    ${typeFilter}
  `

  // Calculate revenue forecast (next 3 months based on active subscriptions)
  const forecast = await sql`
    SELECT 
      subscription_type,
      COUNT(*) as active_count,
      COALESCE(AVG(amount), 0) as avg_amount
    FROM subscriptions
    WHERE status = 'active'
    ${typeFilter}
    GROUP BY subscription_type
  `

  return {
    revenueData,
    breakdown,
    stats: stats[0],
    forecast,
  }
}

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const user = await getUser()

  if (!user) {
    redirect("/login")
  }

  const params = await searchParams
  const data = await getReportsData(params)

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} />

      <main className="container mx-auto p-6 space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">Reports & Analytics</h1>
            <p className="text-muted-foreground">Analyze subscription performance and revenue trends</p>
          </div>
        </div>

        <ReportsFilters />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="p-6 rounded-lg border border-border bg-card">
            <p className="text-sm text-muted-foreground">Total Subscriptions</p>
            <p className="text-3xl font-bold mt-2">{Number(data.stats.total_subscriptions)}</p>
          </div>
          <div className="p-6 rounded-lg border border-border bg-card">
            <p className="text-sm text-muted-foreground">Active Subscriptions</p>
            <p className="text-3xl font-bold mt-2">{Number(data.stats.active_subscriptions)}</p>
          </div>
          <div className="p-6 rounded-lg border border-border bg-card">
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="text-3xl font-bold mt-2">${Number(data.stats.total_revenue).toFixed(2)}</p>
          </div>
          <div className="p-6 rounded-lg border border-border bg-card">
            <p className="text-sm text-muted-foreground">Average Revenue</p>
            <p className="text-3xl font-bold mt-2">${Number(data.stats.avg_revenue).toFixed(2)}</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <RevenueChart data={data.revenueData} />
          <SubscriptionBreakdown data={data.breakdown} />
        </div>

        <RevenueForecast data={data.forecast} />
      </main>
    </div>
  )
}
