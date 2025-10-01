"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { format, addDays, eachDayOfInterval } from "date-fns"

interface HeatmapData {
  end_date: string
  count: number
}

interface CalendarHeatmapProps {
  data: HeatmapData[]
}

export function CalendarHeatmap({ data }: CalendarHeatmapProps) {
  const today = new Date()
  const days = eachDayOfInterval({
    start: today,
    end: addDays(today, 29),
  })

  const dataMap = new Map(data.map((item) => [item.end_date, Number(item.count)]))

  const getIntensity = (count: number) => {
    if (count === 0) return "bg-muted"
    if (count === 1) return "bg-warning/30"
    if (count === 2) return "bg-warning/60"
    return "bg-warning"
  }

  return (
    <Card className="animate-slide-up">
      <CardHeader>
        <CardTitle>Upcoming Expirations</CardTitle>
        <CardDescription>Subscription expiration heatmap for the next 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-10 gap-2">
          {days.map((day) => {
            const dateStr = format(day, "yyyy-MM-dd")
            const count = dataMap.get(dateStr) || 0
            const intensity = getIntensity(count)

            return (
              <div
                key={dateStr}
                className={`aspect-square rounded-md ${intensity} flex items-center justify-center text-xs font-medium transition-all hover:scale-110 hover:shadow-md cursor-pointer`}
                title={`${format(day, "MMM d")}: ${count} expiring`}
              >
                {format(day, "d")}
              </div>
            )
          })}
        </div>
        <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-4 h-4 rounded bg-muted" />
            <div className="w-4 h-4 rounded bg-warning/30" />
            <div className="w-4 h-4 rounded bg-warning/60" />
            <div className="w-4 h-4 rounded bg-warning" />
          </div>
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  )
}
