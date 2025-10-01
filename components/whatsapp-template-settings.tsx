"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface WhatsAppTemplateSettingsProps {
  settings: {
    template7Day: string
    template1Day: string
    templateExpiry: string
  }
}

export function WhatsAppTemplateSettings({ settings }: WhatsAppTemplateSettingsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [templates, setTemplates] = useState({
    template7Day: settings.template7Day,
    template1Day: settings.template1Day,
    templateExpiry: settings.templateExpiry,
  })
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/settings/templates", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(templates),
      })

      if (response.ok) {
        toast({
          title: "Settings saved",
          description: "WhatsApp message templates updated successfully.",
        })
        router.refresh()
      } else {
        const data = await response.json()
        toast({
          title: "Error",
          description: data.error || "Failed to save settings",
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
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>WhatsApp Message Templates</CardTitle>
        <CardDescription>
          Customize the messages sent to clients. Use {"{name}"} and {"{end_date}"} as placeholders.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="template7Day">7 Days Before Expiry</Label>
            <Textarea
              id="template7Day"
              value={templates.template7Day}
              onChange={(e) => setTemplates({ ...templates, template7Day: e.target.value })}
              rows={4}
              placeholder="Hi {name}, your subscription expires in 7 days..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="template1Day">1 Day Before Expiry</Label>
            <Textarea
              id="template1Day"
              value={templates.template1Day}
              onChange={(e) => setTemplates({ ...templates, template1Day: e.target.value })}
              rows={4}
              placeholder="Hi {name}, your subscription expires tomorrow..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="templateExpiry">Expiry Day</Label>
            <Textarea
              id="templateExpiry"
              value={templates.templateExpiry}
              onChange={(e) => setTemplates({ ...templates, templateExpiry: e.target.value })}
              rows={4}
              placeholder="Hi {name}, your subscription has expired today..."
            />
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Templates"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
