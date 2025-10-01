"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { AddClientDialog } from "@/components/add-client-dialog"

export function AddClientButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />
        Add Client
      </Button>
      <AddClientDialog open={open} onOpenChange={setOpen} />
    </>
  )
}
