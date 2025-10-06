"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { FileSpreadsheet } from "lucide-react"

interface ImportClientsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ImportClientsDialog({ open, onOpenChange }: ImportClientsDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/clients/import", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Import successful",
          description: `Imported ${data.count} clients successfully.`,
        })
        onOpenChange(false)
        setFile(null)
        router.refresh()
      } else {
        toast({
          title: "Import failed",
          description: data.error || "Failed to import clients",
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Clients from Excel/CSV</DialogTitle>
          <DialogDescription>
            Upload an Excel or CSV file with columns: Name/Email, Phone/Téléphone, Email, Start Date/Date Début, Subscription Type/Durée Abonnement
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file">Select File</Label>
            <Input id="file" type="file" accept=".xlsx,.xls,.csv" onChange={handleFileChange} required />
          </div>

          {file && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-accent">
              <FileSpreadsheet className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">{file.name}</span>
            </div>
          )}

          <div className="bg-muted p-4 rounded-lg text-sm space-y-2">
            <p className="font-medium">Expected format:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Name/Nom du Client (required)</li>
              <li>Phone/Téléphone (required, format: +1234567890)</li>
              <li>Email (optional)</li>
              <li>Start Date/Date Début (required, format: DD/MM/YYYY or YYYY-MM-DD)</li>
              <li>Subscription Type/Durée Abonnement (required: Monthly/mois, 3 Months/3 mois, or Yearly/ans)</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2">
              French headers are supported: "Nom du Client", "Téléphone", "Date Début", "Durée Abonnement"
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !file}>
              {isLoading ? "Importing..." : "Import"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
