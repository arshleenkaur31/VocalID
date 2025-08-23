"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Mic, Shield, Activity, Settings, Plus, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { VoiceProfileCard } from "@/components/dashboard/voice-profile-card"
import { AuthenticationHistory } from "@/components/dashboard/authentication-history"
import { SecurityEvents } from "@/components/dashboard/security-events"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"

interface DashboardData {
  user: {
    id: string
    name: string
    email: string
    joinedDate: string
  }
  voiceProfiles: Array<{
    id: string
    name: string
    isActive: boolean
    enrolledAt: string
    lastUsed: string
    confidence: number
  }>
  recentActivity: Array<{
    id: string
    type: "authentication" | "enrollment" | "security"
    result: "success" | "failed" | "warning"
    timestamp: string
    description: string
  }>
  stats: {
    totalAuthentications: number
    successRate: number
    lastAuthentication: string
    activeProfiles: number
  }
}

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/dashboard/data")
      const data = await response.json()
      setDashboardData(data)
    } catch (error) {
      console.error("Failed to load dashboard data:", error)
      // Mock data for demo
      setDashboardData({
        user: {
          id: "user_123",
          name: "John Doe",
          email: "john.doe@example.com",
          joinedDate: "2024-01-15",
        },
        voiceProfiles: [
          {
            id: "profile_1",
            name: "Primary Profile",
            isActive: true,
            enrolledAt: "2024-01-15T10:30:00Z",
            lastUsed: "2024-08-23T09:15:00Z",
            confidence: 0.96,
          },
          {
            id: "profile_2",
            name: "Mobile Profile",
            isActive: true,
            enrolledAt: "2024-02-01T14:20:00Z",
            lastUsed: "2024-08-22T16:45:00Z",
            confidence: 0.94,
          },
        ],
        recentActivity: [
          {
            id: "activity_1",
            type: "authentication",
            result: "success",
            timestamp: "2024-08-23T09:15:00Z",
            description: "Voice authentication successful",
          },
          {
            id: "activity_2",
            type: "authentication",
            result: "failed",
            timestamp: "2024-08-23T08:30:00Z",
            description: "Authentication failed - low confidence score",
          },
          {
            id: "activity_3",
            type: "security",
            result: "warning",
            timestamp: "2024-08-22T20:10:00Z",
            description: "Unusual authentication pattern detected",
          },
        ],
        stats: {
          totalAuthentications: 247,
          successRate: 94.3,
          lastAuthentication: "2024-08-23T09:15:00Z",
          activeProfiles: 2,
        },
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="font-open-sans">Loading dashboard...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-4" />
            <p className="font-open-sans">Failed to load dashboard data</p>
            <Button onClick={loadDashboardData} className="mt-4 font-open-sans">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <Mic className="h-6 w-6 text-primary" />
                <span className="text-lg font-black font-montserrat">VOCAL-ID</span>
              </Link>
              <div className="hidden md:block">
                <Badge variant="secondary" className="font-open-sans">
                  Dashboard
                </Badge>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="font-open-sans font-medium">{dashboardData.user.name}</p>
                <p className="text-sm font-open-sans text-muted-foreground">{dashboardData.user.email}</p>
              </div>
              <Button variant="outline" size="sm" className="font-open-sans bg-transparent">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black font-montserrat text-foreground mb-2">Dashboard</h1>
          <p className="font-open-sans text-muted-foreground">
            Manage your voice profiles and monitor authentication activity
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="font-open-sans">
              Overview
            </TabsTrigger>
            <TabsTrigger value="profiles" className="font-open-sans">
              Voice Profiles
            </TabsTrigger>
            <TabsTrigger value="activity" className="font-open-sans">
              Activity
            </TabsTrigger>
            <TabsTrigger value="security" className="font-open-sans">
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <DashboardStats stats={dashboardData.stats} />

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="font-montserrat font-bold">Quick Actions</CardTitle>
                <CardDescription className="font-open-sans">Common tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link href="/authenticate">
                    <Button className="w-full h-20 flex flex-col space-y-2 font-open-sans">
                      <Shield className="h-6 w-6" />
                      <span>Authenticate</span>
                    </Button>
                  </Link>
                  <Link href="/enroll">
                    <Button
                      variant="outline"
                      className="w-full h-20 flex flex-col space-y-2 font-open-sans bg-transparent"
                    >
                      <Plus className="h-6 w-6" />
                      <span>New Profile</span>
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full h-20 flex flex-col space-y-2 font-open-sans bg-transparent"
                  >
                    <Activity className="h-6 w-6" />
                    <span>View Activity</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="font-montserrat font-bold">Recent Activity</CardTitle>
                <CardDescription className="font-open-sans">
                  Your latest authentication and security events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboardData.recentActivity.slice(0, 5).map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center space-x-3">
                        {activity.result === "success" && <CheckCircle className="h-5 w-5 text-primary" />}
                        {activity.result === "failed" && <XCircle className="h-5 w-5 text-destructive" />}
                        {activity.result === "warning" && <AlertTriangle className="h-5 w-5 text-accent" />}
                        <div>
                          <p className="font-open-sans font-medium">{activity.description}</p>
                          <p className="text-sm font-open-sans text-muted-foreground">
                            {new Date(activity.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          activity.result === "success"
                            ? "default"
                            : activity.result === "failed"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {activity.result}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profiles" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black font-montserrat">Voice Profiles</h2>
                <p className="font-open-sans text-muted-foreground">Manage your enrolled voice profiles</p>
              </div>
              <Link href="/enroll">
                <Button className="font-open-sans font-medium">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Profile
                </Button>
              </Link>
            </div>

            <div className="grid gap-6">
              {dashboardData.voiceProfiles.map((profile) => (
                <VoiceProfileCard key={profile.id} profile={profile} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <div>
              <h2 className="text-2xl font-black font-montserrat">Authentication History</h2>
              <p className="font-open-sans text-muted-foreground">Complete log of your authentication attempts</p>
            </div>
            <AuthenticationHistory />
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <div>
              <h2 className="text-2xl font-black font-montserrat">Security Events</h2>
              <p className="font-open-sans text-muted-foreground">Monitor security alerts and suspicious activities</p>
            </div>
            <SecurityEvents />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
