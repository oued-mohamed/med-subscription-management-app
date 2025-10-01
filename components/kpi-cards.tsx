import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, AlertCircle, CheckCircle, DollarSign } from "lucide-react"

interface KPICardsProps {
  kpis: {
    activeSubscriptions: number
    expiringSoon: number
    renewalsThisMonth: number
    revenueThisMonth: number
  }
}

export function KPICards({ kpis }: KPICardsProps) {
  const cards = [
    {
      title: "Active Subscriptions",
      value: kpis.activeSubscriptions,
      icon: TrendingUp,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Expiring Soon",
      value: kpis.expiringSoon,
      subtitle: "Next 7 days",
      icon: AlertCircle,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      title: "Renewals This Month",
      value: kpis.renewalsThisMonth,
      icon: CheckCircle,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Revenue This Month",
      value: `$${kpis.revenueThisMonth.toFixed(2)}`,
      icon: DollarSign,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
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
              {card.subtitle && <p className="text-xs text-muted-foreground mt-1">{card.subtitle}</p>}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
