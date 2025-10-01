"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"

interface TrendData {
  month: string
  total: number
  active: number
  expired: number
  revenue: number
}

interface SubscriptionTrendChartProps {
  data: TrendData[]
}

export function SubscriptionTrendChart({ data }: SubscriptionTrendChartProps) {
  const chartData = data.map((item) => ({
    month: item.month,
    active: Number(item.active),
    expired: Number(item.expired),
    revenue: Number(item.revenue),
  }))

  return (
    <Card className="animate-slide-up">
      <CardHeader>
        <CardTitle>Subscription Trends</CardTitle>
        <CardDescription>Active vs Expired subscriptions over the last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            active: {
              label: "Active",
              color: "hsl(var(--primary))",
            },
            expired: {
              label: "Expired",
              color: "hsl(var(--destructive))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
              <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="active"
                stroke="var(--color-active)"
                strokeWidth={2}
                dot={{ fill: "var(--color-active)" }}
              />
              <Line
                type="monotone"
                dataKey="expired"
                stroke="var(--color-expired)"
                strokeWidth={2}
                dot={{ fill: "var(--color-expired)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
