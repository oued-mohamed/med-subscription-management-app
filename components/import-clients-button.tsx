"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import { ImportClientsDialog } from "@/components/import-clients-dialog"

export function ImportClientsButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        <Upload className="h-4 w-4 mr-2" />
        Import Excel/CSV
      </Button>
      <ImportClientsDialog open={open} onOpenChange={setOpen} />
    </>
  )
}
