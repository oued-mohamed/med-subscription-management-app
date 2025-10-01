"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

interface ForecastData {
  subscription_type: string
  active_count: number
  avg_amount: number
}

interface RevenueForecastProps {
  data: ForecastData[]
}

export function RevenueForecast({ data }: RevenueForecastProps) {
  // Calculate forecast for next 3 months
  const calculateForecast = () => {
    let monthlyTotal = 0
    let quarterlyTotal = 0
    let yearlyTotal = 0

    data.forEach((item) => {
      const count = Number(item.active_count)
      const avg = Number(item.avg_amount)

      if (item.subscription_type === "Monthly") {
        monthlyTotal += count * avg
      } else if (item.subscription_type === "3 Months") {
        quarterlyTotal += count * avg
      } else if (item.subscription_type === "Yearly") {
        yearlyTotal += count * avg
      }
    })

    // Project for next 3 months
    const month1 = monthlyTotal + quarterlyTotal / 3 + yearlyTotal / 12
    const month2 = monthlyTotal + quarterlyTotal / 3 + yearlyTotal / 12
    const month3 = monthlyTotal + quarterlyTotal / 3 + yearlyTotal / 12

    return {
      month1,
      month2,
      month3,
      total: month1 + month2 + month3,
    }
  }

  const forecast = calculateForecast()

  const getMonthName = (offset: number) => {
    const date = new Date()
    date.setMonth(date.getMonth() + offset)
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }

  return (
    <Card className="animate-slide-up">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Revenue Forecast
        </CardTitle>
        <CardDescription>Projected revenue for the next 3 months based on active subscriptions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-4">
          <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-sm text-muted-foreground">{getMonthName(1)}</p>
            <p className="text-2xl font-bold text-primary mt-2">${forecast.month1.toFixed(2)}</p>
          </div>
          <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-sm text-muted-foreground">{getMonthName(2)}</p>
            <p className="text-2xl font-bold text-primary mt-2">${forecast.month2.toFixed(2)}</p>
          </div>
          <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-sm text-muted-foreground">{getMonthName(3)}</p>
            <p className="text-2xl font-bold text-primary mt-2">${forecast.month3.toFixed(2)}</p>
          </div>
          <div className="p-4 rounded-lg bg-success/10 border border-success/20">
            <p className="text-sm text-muted-foreground">Total (3 Months)</p>
            <p className="text-2xl font-bold text-success mt-2">${forecast.total.toFixed(2)}</p>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-lg bg-muted">
          <p className="text-sm text-muted-foreground">
            This forecast is based on current active subscriptions and assumes all subscriptions will be renewed. Actual
            revenue may vary based on renewals, cancellations, and new subscriptions.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
