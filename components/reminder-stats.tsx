import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, CheckCircle, Eye, XCircle } from "lucide-react"

interface ReminderStatsProps {
  stats: {
    pending: number
    delivered: number
    seen: number
    failed: number
  }
}

export function ReminderStats({ stats }: ReminderStatsProps) {
  const cards = [
    {
      title: "Pending",
      value: Number(stats.pending),
      icon: Clock,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      title: "Delivered",
      value: Number(stats.delivered),
      icon: CheckCircle,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Seen",
      value: Number(stats.seen),
      icon: Eye,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Failed",
      value: Number(stats.failed),
      icon: XCircle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <Card
            key={index}
            className="animate-slide-up hover:shadow-lg transition-shadow duration-300"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
