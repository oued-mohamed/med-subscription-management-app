"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { Loader2 } from "lucide-react"

interface Client {
  id: number
  name: string
  phone: string
  email: string
}

interface Subscription {
  id: number
  subscription_type: string
  start_date: string
  end_date: string
  status: string
  amount: number
}

interface ViewClientDialogProps {
  client: Client
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViewClientDialog({ client, open, onOpenChange }: ViewClientDialogProps) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (open) {
      fetchSubscriptions()
    }
  }, [open, client.id])

  const fetchSubscriptions = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/clients/${client.id}/subscriptions`)
      if (response.ok) {
        const data = await response.json()
        setSubscriptions(data.subscriptions)
      }
    } catch (error) {
      console.error("[v0] Failed to fetch subscriptions:", error)
    } finally {
      setIsLoading(false)
    }
  }

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{client.name}</DialogTitle>
          <DialogDescription>Client details and subscription history</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phone:</span>
                <span className="font-medium">{client.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span className="font-medium">{client.email || "N/A"}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Subscriptions</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : subscriptions.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No subscriptions found</p>
              ) : (
                <div className="space-y-3">
                  {subscriptions.map((sub) => (
                    <div key={sub.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                      <div>
                        <p className="font-medium">{sub.subscription_type}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(sub.start_date), "MMM d, yyyy")} -{" "}
                          {format(new Date(sub.end_date), "MMM d, yyyy")}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-medium">${Number(sub.amount).toFixed(2)}</span>
                        <Badge className={getStatusColor(sub.status)} variant="secondary">
                          {sub.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
