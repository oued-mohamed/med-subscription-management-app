import { getUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { sql } from "@/lib/db"
import { DashboardHeader } from "@/components/dashboard-header"
import { WhatsAppTemplateSettings } from "@/components/whatsapp-template-settings"

async function getSettings() {
  const settings = await sql`
    SELECT key, value FROM settings
    WHERE key IN ('whatsapp_7day_template', 'whatsapp_1day_template', 'whatsapp_expiry_template')
  `

  const settingsMap = new Map(settings.map((s) => [s.key, s.value]))

  return {
    template7Day: settingsMap.get("whatsapp_7day_template") || "",
    template1Day: settingsMap.get("whatsapp_1day_template") || "",
    templateExpiry: settingsMap.get("whatsapp_expiry_template") || "",
  }
}

export default async function SettingsPage() {
  const user = await getUser()

  if (!user) {
    redirect("/login")
  }

  const settings = await getSettings()

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} />

      <main className="container mx-auto p-6 space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-balance">Settings</h1>
          <p className="text-muted-foreground">Configure WhatsApp message templates and system settings</p>
        </div>

        <WhatsAppTemplateSettings settings={settings} />
      </main>
    </div>
  )
}
