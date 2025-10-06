import { getUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { sql } from "@/lib/db"
import { DashboardHeader } from "@/components/dashboard-header"
import { KPICards } from "@/components/kpi-cards"
import { SubscriptionTrendChart } from "@/components/subscription-trend-chart"
import { CalendarHeatmap } from "@/components/calendar-heatmap"
import { RecentActivity } from "@/components/recent-activity"

async function getDashboardData() {
  try {
    // Get active subscriptions count
    const activeSubsResult = await sql`
      SELECT COUNT(*) as count
      FROM subscriptions
      WHERE status = 'active'
    `

  // Get expiring soon count (next 7 days)
  const expiringSoonResult = await sql`
    SELECT COUNT(*) as count
    FROM subscriptions
    WHERE status = 'active'
    AND end_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
  `

  // Get renewals this month
  const renewalsResult = await sql`
    SELECT COUNT(*) as count
    FROM subscriptions
    WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)
    AND status = 'active'
  `

  // Get total revenue this month
  const revenueResult = await sql`
    SELECT COALESCE(SUM(amount), 0) as total
    FROM subscriptions
    WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)
    AND status = 'active'
  `

  // Get subscription trend data (last 6 months)
  const trendData = await sql`
    SELECT 
      TO_CHAR(DATE_TRUNC('month', created_at), 'Mon YYYY') as month,
      COUNT(*) as total,
      SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active,
      SUM(CASE WHEN status = 'expired' THEN 1 ELSE 0 END) as expired,
      COALESCE(SUM(amount), 0) as revenue
    FROM subscriptions
    WHERE created_at >= CURRENT_DATE - INTERVAL '6 months'
    GROUP BY DATE_TRUNC('month', created_at)
    ORDER BY DATE_TRUNC('month', created_at) ASC
  `

  // Get upcoming expirations for heatmap (next 30 days)
  const upcomingExpirations = await sql`
    SELECT 
      end_date,
      COUNT(*) as count
    FROM subscriptions
    WHERE status = 'active'
    AND end_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days'
    GROUP BY end_date
    ORDER BY end_date ASC
  `

  // Get recent subscriptions
  const recentSubscriptions = await sql`
    SELECT 
      s.id,
      s.subscription_type,
      s.start_date,
      s.end_date,
      s.status,
      c.name as client_name
    FROM subscriptions s
    JOIN clients c ON s.client_id = c.id
    ORDER BY s.created_at DESC
    LIMIT 5
  `

    return {
      kpis: {
        activeSubscriptions: Number(activeSubsResult[0].count),
        expiringSoon: Number(expiringSoonResult[0].count),
        renewalsThisMonth: Number(renewalsResult[0].count),
        revenueThisMonth: Number(revenueResult[0].total),
      },
      trendData,
      upcomingExpirations,
      recentSubscriptions,
    }
  } catch (error) {
    console.error("Database connection error:", error)
    // Return fallback data when database is not available
    return {
      kpis: {
        activeSubscriptions: 0,
        expiringSoon: 0,
        renewalsThisMonth: 0,
        revenueThisMonth: 0,
      },
      trendData: [],
      upcomingExpirations: [],
      recentSubscriptions: [],
    }
  }
}

export default async function DashboardPage() {
  const user = await getUser()

  if (!user) {
    redirect("/login")
  }

  const data = await getDashboardData()

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} />

      <main className="container mx-auto p-6 space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user.name}</p>
          </div>
        </div>

        <KPICards kpis={data.kpis} />

        <div className="grid gap-6 lg:grid-cols-2">
          <SubscriptionTrendChart data={data.trendData} />
          <CalendarHeatmap data={data.upcomingExpirations} />
        </div>

        <RecentActivity subscriptions={data.recentSubscriptions} />
      </main>
    </div>
  )
}
