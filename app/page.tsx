import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  Bell, 
  Calendar, 
  Clock, 
  MessageSquare, 
  Shield, 
  TrendingUp,
  CheckCircle2,
  Zap,
  Users
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 animate-slide-up">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2 animate-slide-in-left">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center hover:scale-110 transition-transform">
              <span className="text-primary-foreground font-bold text-sm">ST</span>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient">
                SubTrackr
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-4 animate-slide-in-right">
            <Link href="/login">
              <Button variant="ghost" className="hover:scale-105 transition-transform duration-200">Login</Button>
            </Link>
            <Link href="/login">
              <Button className="hover:scale-105 transition-transform duration-200">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 lg:py-32 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="flex flex-col items-center text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 animate-slide-up">
            <Zap className="h-4 w-4 text-primary animate-bounce-subtle" />
            <span className="text-sm font-medium text-primary">Smart Subscription Management</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight max-w-4xl animate-slide-up animate-delay-100">
            Never Lose a Client to{" "}
            <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient">
              Expired Subscriptions
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl animate-slide-up animate-delay-200">
            Automated WhatsApp reminders for every subscription. Keep your clients engaged, 
            reduce churn, and boost revenue with intelligent subscription tracking.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-slide-up animate-delay-300">
            <Link href="/login">
              <Button size="lg" className="text-lg px-8 hover:scale-105 transition-transform duration-200">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="text-lg px-8 hover:scale-105 transition-transform duration-200">
                View Demo
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-6 pt-8 text-sm text-muted-foreground animate-fade-in animate-delay-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20 bg-muted/30">
        <div className="text-center space-y-4 mb-16 animate-slide-up">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            Everything You Need to Manage Subscriptions
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to help you stay on top of every client subscription
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="p-6 rounded-lg bg-card border border-border hover:border-primary/50 transition-all hover:shadow-lg hover:scale-105 hover:-translate-y-1 group animate-scale-in">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">WhatsApp Reminders</h3>
            <p className="text-muted-foreground">
              Automated WhatsApp notifications sent directly to your clients before subscriptions expire
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 rounded-lg bg-card border border-border hover:border-primary/50 transition-all hover:shadow-lg hover:scale-105 hover:-translate-y-1 group animate-scale-in animate-delay-100">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Smart Scheduling</h3>
            <p className="text-muted-foreground">
              Intelligent scheduling system that tracks all subscription expiration dates automatically
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 rounded-lg bg-card border border-border hover:border-primary/50 transition-all hover:shadow-lg hover:scale-105 hover:-translate-y-1 group animate-scale-in animate-delay-200">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Client Management</h3>
            <p className="text-muted-foreground">
              Comprehensive client database with subscription history and engagement tracking
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-6 rounded-lg bg-card border border-border hover:border-primary/50 transition-all hover:shadow-lg hover:scale-105 hover:-translate-y-1 group animate-scale-in animate-delay-300">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Analytics & Reports</h3>
            <p className="text-muted-foreground">
              Detailed insights into subscription trends, renewal rates, and revenue forecasting
            </p>
          </div>

          {/* Feature 5 */}
          <div className="p-6 rounded-lg bg-card border border-border hover:border-primary/50 transition-all hover:shadow-lg hover:scale-105 hover:-translate-y-1 group animate-scale-in animate-delay-400">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Custom Timing</h3>
            <p className="text-muted-foreground">
              Set custom reminder schedules - 30, 15, 7 days before expiration, or your own timing
            </p>
          </div>

          {/* Feature 6 */}
          <div className="p-6 rounded-lg bg-card border border-border hover:border-primary/50 transition-all hover:shadow-lg hover:scale-105 hover:-translate-y-1 group animate-scale-in animate-delay-500">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure & Reliable</h3>
            <p className="text-muted-foreground">
              Enterprise-grade security with encrypted data storage and reliable message delivery
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-2 animate-slide-in-left animate-delay-100">
            <div className="text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient">
              98%
            </div>
            <div className="text-muted-foreground">Renewal Rate Improvement</div>
          </div>
          <div className="space-y-2 animate-slide-up animate-delay-200">
            <div className="text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient" style={{animationDelay: '1s'}}>
              10K+
            </div>
            <div className="text-muted-foreground">Active Subscriptions Tracked</div>
          </div>
          <div className="space-y-2 animate-slide-in-right animate-delay-300">
            <div className="text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient" style={{animationDelay: '2s'}}>
              24/7
            </div>
            <div className="text-muted-foreground">Automated Monitoring</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20 bg-gradient-to-br from-primary/10 via-secondary/5 to-primary/10 rounded-2xl relative overflow-hidden animate-gradient">
        <div className="absolute inset-0 -z-10 opacity-30">
          <div className="absolute top-10 right-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-10 left-10 w-64 h-64 bg-secondary/20 rounded-full blur-3xl animate-float" style={{animationDelay: '1.5s'}}></div>
        </div>
        <div className="text-center space-y-8">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold animate-slide-up">
            Ready to Transform Your Subscription Management?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-up animate-delay-100">
            Join hundreds of businesses already using SubTrackr to keep their clients engaged and subscriptions active
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-slide-up animate-delay-200">
            <Link href="/login">
              <Button size="lg" className="text-lg px-8 hover:scale-110 transition-transform duration-200 shadow-lg">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-20 animate-fade-in">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 animate-slide-in-left">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center hover:scale-110 transition-transform">
                <span className="text-primary-foreground font-bold text-sm">ST</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient">
                SubTrackr
              </span>
            </div>
            <div className="text-sm text-muted-foreground animate-fade-in animate-delay-100">
              © 2025 SubTrackr. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground animate-slide-in-right">
              <Link href="/login" className="hover:text-foreground hover:scale-110 transition-all duration-200">
                Privacy Policy
              </Link>
              <Link href="/login" className="hover:text-foreground hover:scale-110 transition-all duration-200">
                Terms of Service
              </Link>
              <Link href="/login" className="hover:text-foreground hover:scale-110 transition-all duration-200">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
