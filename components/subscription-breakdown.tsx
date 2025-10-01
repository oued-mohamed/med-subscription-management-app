"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Pie, PieChart, Cell, ResponsiveContainer, Legend } from "recharts"

interface BreakdownData {
  subscription_type: string
  count: number
  active: number
  total_revenue: number
}

interface SubscriptionBreakdownProps {
  data: BreakdownData[]
}

const COLORS = ["hsl(var(--primary))", "hsl(var(--secondary))", "hsl(var(--success))"]

export function SubscriptionBreakdown({ data }: SubscriptionBreakdownProps) {
  const chartData = data.map((item, index) => ({
    name: item.subscription_type,
    value: Number(item.count),
    fill: COLORS[index % COLORS.length],
  }))

  return (
    <Card className="animate-slide-up">
      <CardHeader>
        <CardTitle>Subscription Breakdown</CardTitle>
        <CardDescription>Distribution by subscription type</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            Monthly: {
              label: "Monthly",
              color: "hsl(var(--primary))",
            },
            "3 Months": {
              label: "3 Months",
              color: "hsl(var(--secondary))",
            },
            Yearly: {
              label: "Yearly",
              color: "hsl(var(--success))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chartData} cx="50%" cy="50%" labelLine={false} outerRadius={80} dataKey="value">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>

        <div className="mt-6 space-y-3">
          {data.map((item, index) => (
            <div key={item.subscription_type} className="flex items-center justify-between p-3 rounded-lg bg-accent/50">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="font-medium">{item.subscription_type}</span>
              </div>
              <div className="text-right">
                <p className="font-medium">{Number(item.count)} total</p>
                <p className="text-sm text-muted-foreground">${Number(item.total_revenue).toFixed(2)} revenue</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
