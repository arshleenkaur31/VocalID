import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mic, Shield, Zap, Users, BarChart3 } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Mic className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-black font-montserrat text-foreground">VOCAL-ID</h1>
            </div>
            <nav className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" className="font-open-sans">
                  Dashboard
                </Button>
              </Link>
              <Link href="/admin">
                <Button variant="ghost" className="font-open-sans">
                  Admin
                </Button>
              </Link>
              <Link href="/enroll">
                <Button className="font-open-sans font-medium">Get Started</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-5xl font-black font-montserrat text-foreground mb-6">Transform Digital Authentication</h2>
          <p className="text-xl font-open-sans text-muted-foreground mb-8 leading-relaxed">
            VOCAL-ID provides triple-factor voice authentication that verifies who you are, what you're saying, and how
            you're saying it. Secure, frictionless, and un-spoofable.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/enroll">
              <Button size="lg" className="font-open-sans font-medium px-8">
                Start Voice Enrollment
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="outline" size="lg" className="font-open-sans font-medium px-8 bg-transparent">
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 bg-muted">
        <div className="container mx-auto max-w-6xl">
          <h3 className="text-3xl font-black font-montserrat text-center text-foreground mb-12">
            Triple-Factor Voice Security
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="font-montserrat font-bold">Speaker Identity</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="font-open-sans">
                  Advanced voice biometric matching verifies your unique vocal characteristics with 99.5% accuracy.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Mic className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="font-montserrat font-bold">Content Accuracy</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="font-open-sans">
                  Speech-to-text verification ensures you're speaking the exact challenge phrase, preventing replay
                  attacks.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="font-montserrat font-bold">Liveness Detection</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="font-open-sans">
                  AI-powered analysis detects deepfakes and synthetic voices, ensuring only real human speech is
                  authenticated.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Access Cards */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h3 className="text-3xl font-black font-montserrat text-center text-foreground mb-12">Quick Access</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/dashboard">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Users className="h-8 w-8 text-primary" />
                    <div>
                      <CardTitle className="font-montserrat font-bold">User Dashboard</CardTitle>
                      <CardDescription className="font-open-sans">
                        Manage your voice profiles and view authentication history
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/admin">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <BarChart3 className="h-8 w-8 text-primary" />
                    <div>
                      <CardTitle className="font-montserrat font-bold">Admin Panel</CardTitle>
                      <CardDescription className="font-open-sans">
                        System analytics, user management, and security monitoring
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Mic className="h-6 w-6 text-primary" />
            <span className="text-lg font-black font-montserrat text-foreground">VOCAL-ID</span>
          </div>
          <p className="text-sm font-open-sans text-muted-foreground">
            "It's not what you say, it's how you say it" - Team ERROR 404
          </p>
        </div>
      </footer>
    </div>
  )
}
