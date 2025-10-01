import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
      <div className="w-full max-w-md p-8">
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
