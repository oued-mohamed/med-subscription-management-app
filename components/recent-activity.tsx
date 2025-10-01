import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

interface Subscription {
  id: number
  subscription_type: string
  start_date: string
  end_date: string
  status: string
  client_name: string
}

interface RecentActivityProps {
  subscriptions: Subscription[]
}

export function RecentActivity({ subscriptions }: RecentActivityProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success/10 text-success hover:bg-success/20"
      case "expired":
        return "bg-destructive/10 text-destructive hover:bg-destructive/20"
      case "cancelled":
        return "bg-muted text-muted-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <Card className="animate-slide-up">
      <CardHeader>
        <CardTitle>Recent Subscriptions</CardTitle>
        <CardDescription>Latest subscription activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {subscriptions.map((sub) => (
            <div
              key={sub.id}
              className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors"
            >
              <div className="flex-1">
                <p className="font-medium">{sub.client_name}</p>
                <p className="text-sm text-muted-foreground">{sub.subscription_type} subscription</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium">{format(new Date(sub.end_date), "MMM d, yyyy")}</p>
                  <p className="text-xs text-muted-foreground">Expires</p>
                </div>
                <Badge className={getStatusColor(sub.status)} variant="secondary">
                  {sub.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
