"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function ReportsFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const subscriptionType = searchParams.get("type") || "all"
  const timeRange = searchParams.get("range") || "6months"

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === "all") {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    router.push(`/dashboard/reports?${params.toString()}`)
  }

  const handleExportExcel = async () => {
    try {
      const response = await fetch(`/api/reports/export?format=excel&${searchParams.toString()}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `subtrackr-report-${new Date().toISOString().split("T")[0]}.xlsx`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        toast({
          title: "Export successful",
          description: "Report downloaded as Excel file.",
        })
      } else {
        throw new Error("Export failed")
      }
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export report. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleExportPDF = async () => {
    try {
      const response = await fetch(`/api/reports/export?format=pdf&${searchParams.toString()}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `subtrackr-report-${new Date().toISOString().split("T")[0]}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        toast({
          title: "Export successful",
          description: "Report downloaded as PDF file.",
        })
      } else {
        throw new Error("Export failed")
      }
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export report. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="flex flex-col sm:flex-row gap-3">
        <Select value={subscriptionType} onValueChange={(value) => updateFilter("type", value)}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Subscription Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Monthly">Monthly</SelectItem>
            <SelectItem value="3 Months">3 Months</SelectItem>
            <SelectItem value="Yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>

        <Select value={timeRange} onValueChange={(value) => updateFilter("range", value)}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Time Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1month">Last Month</SelectItem>
            <SelectItem value="3months">Last 3 Months</SelectItem>
            <SelectItem value="6months">Last 6 Months</SelectItem>
            <SelectItem value="1year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={handleExportExcel}>
          <Download className="h-4 w-4 mr-2" />
          Export Excel
        </Button>
        <Button variant="outline" onClick={handleExportPDF}>
          <Download className="h-4 w-4 mr-2" />
          Export PDF
        </Button>
      </div>
    </div>
  )
}
