"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Send, RefreshCw } from "lucide-react"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Reminder {
  id: number
  message: string
  scheduled_date: string
  sent_date: string | null
  status: string
  reminder_type: string
  client_name: string
  client_phone: string
  subscription_type: string
  end_date: string
}

interface RemindersTableProps {
  reminders: Reminder[]
}

export function RemindersTable({ reminders }: RemindersTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isGenerating, setIsGenerating] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const filteredReminders = reminders.filter((reminder) => {
    const matchesSearch =
      reminder.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reminder.client_phone.includes(searchTerm)
    const matchesStatus = statusFilter === "all" || reminder.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-warning/10 text-warning">
            Pending
          </Badge>
        )
      case "delivered":
        return (
          <Badge variant="secondary" className="bg-success/10 text-success">
            Delivered
          </Badge>
        )
      case "seen":
        return (
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            Seen
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="secondary" className="bg-destructive/10 text-destructive">
            Failed
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getReminderTypeBadge = (type: string) => {
    switch (type) {
      case "7_days":
        return <Badge variant="outline">7 Days Before</Badge>
      case "1_day":
        return <Badge variant="outline">1 Day Before</Badge>
      case "expiry":
        return <Badge variant="outline">Expiry Day</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  const handleGenerateReminders = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch("/api/reminders/generate", {
        method: "POST",
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Reminders generated",
          description: `Generated ${data.count} new reminders.`,
        })
        router.refresh()
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to generate reminders",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSendReminder = async (reminderId: number) => {
    try {
      const response = await fetch(`/api/reminders/${reminderId}/send`, {
        method: "POST",
      })

      if (response.ok) {
        toast({
          title: "Reminder sent",
          description: "WhatsApp reminder sent successfully.",
        })
        router.refresh()
      } else {
        const data = await response.json()
        toast({
          title: "Error",
          description: data.error || "Failed to send reminder",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CardTitle>All Reminders ({filteredReminders.length})</CardTitle>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reminders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="seen">Seen</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleGenerateReminders} disabled={isGenerating}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? "animate-spin" : ""}`} />
              Generate
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Client</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Type</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Scheduled</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Sent</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReminders.map((reminder) => (
                <tr key={reminder.id} className="border-b border-border hover:bg-accent/50 transition-colors">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium">{reminder.client_name}</p>
                      <p className="text-sm text-muted-foreground">{reminder.client_phone}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">{getReminderTypeBadge(reminder.reminder_type)}</td>
                  <td className="py-3 px-4 text-muted-foreground">
                    {format(new Date(reminder.scheduled_date), "MMM d, yyyy")}
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">
                    {reminder.sent_date ? format(new Date(reminder.sent_date), "MMM d, yyyy HH:mm") : "-"}
                  </td>
                  <td className="py-3 px-4">{getStatusBadge(reminder.status)}</td>
                  <td className="py-3 px-4">
                    <div className="flex justify-end">
                      {reminder.status === "pending" && (
                        <Button variant="ghost" size="sm" onClick={() => handleSendReminder(reminder.id)}>
                          <Send className="h-4 w-4 mr-2" />
                          Send Now
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
