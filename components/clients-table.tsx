"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Search, Eye } from "lucide-react"
import { format } from "date-fns"
import { EditClientDialog } from "@/components/edit-client-dialog"
import { DeleteClientDialog } from "@/components/delete-client-dialog"
import { ViewClientDialog } from "@/components/view-client-dialog"

interface Client {
  id: number
  name: string
  phone: string
  email: string
  created_at: string
  subscription_count: number
  latest_expiry: string
  active_count: number
}

interface ClientsTableProps {
  clients: Client[]
}

export function ClientsTable({ clients }: ClientsTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEdit = (client: Client) => {
    setSelectedClient(client)
    setEditDialogOpen(true)
  }

  const handleDelete = (client: Client) => {
    setSelectedClient(client)
    setDeleteDialogOpen(true)
  }

  const handleView = (client: Client) => {
    setSelectedClient(client)
    setViewDialogOpen(true)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Clients ({filteredClients.length})</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Phone</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Email</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Subscriptions</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Latest Expiry</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client) => (
                  <tr
                    key={client.id}
                    className="border-b border-border hover:bg-accent/50 transition-colors cursor-pointer"
                    onClick={() => handleView(client)}
                  >
                    <td className="py-3 px-4 font-medium">{client.name}</td>
                    <td className="py-3 px-4 text-muted-foreground">{client.phone}</td>
                    <td className="py-3 px-4 text-muted-foreground">{client.email || "N/A"}</td>
                    <td className="py-3 px-4">
                      <Badge variant="secondary">
                        {Number(client.active_count)} active / {Number(client.subscription_count)} total
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {client.latest_expiry ? format(new Date(client.latest_expiry), "MMM d, yyyy") : "N/A"}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" onClick={() => handleView(client)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(client)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(client)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {selectedClient && (
        <>
          <EditClientDialog client={selectedClient} open={editDialogOpen} onOpenChange={setEditDialogOpen} />
          <DeleteClientDialog client={selectedClient} open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} />
          <ViewClientDialog client={selectedClient} open={viewDialogOpen} onOpenChange={setViewDialogOpen} />
        </>
      )}
    </>
  )
}
