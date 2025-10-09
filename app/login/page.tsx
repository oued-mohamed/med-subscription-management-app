import { LoginForm } from "@/components/login-form"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
      <div className="w-full max-w-md p-8">
        <div className="mb-6 animate-fade-in">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <Home className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            SubTrackr
          </h1>
          <p className="text-muted-foreground mt-2">Never lose a client. Smart reminders for every subscription.</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
