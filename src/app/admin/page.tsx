"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Shield, Users, Settings, BarChart3, AlertTriangle, Database, Lock } from "lucide-react"
import Link from "next/link"
import { AdminStats } from "@/components/admin/admin-stats"
import { UserManagement } from "@/components/admin/user-management"
import { SystemAnalytics } from "@/components/admin/system-analytics"
import { SecurityMonitoring } from "@/components/admin/security-monitoring"
import { SystemSettings } from "@/components/admin/system-settings"

interface AdminDashboardData {
  systemStats: {
    totalUsers: number
    activeUsers: number
    totalAuthentications: number
    systemUptime: string
    averageResponseTime: number
    successRate: number
  }
  recentAlerts: Array<{
    id: string
    type: "security" | "system" | "user"
    severity: "low" | "medium" | "high" | "critical"
    message: string
    timestamp: string
    resolved: boolean
  }>
  systemHealth: {
    status: "healthy" | "warning" | "critical"
    services: Array<{
      name: string
      status: "online" | "offline" | "degraded"
      responseTime: number
    }>
  }
}

export default function AdminPage() {
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    loadAdminData()
  }, [])

  const loadAdminData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/dashboard")
      const data = await response.json()
      setDashboardData(data)
    } catch (error) {
      console.error("Failed to load admin data:", error)
      // Mock data for demo
      setDashboardData({
        systemStats: {
          totalUsers: 1247,
          activeUsers: 892,
          totalAuthentications: 15634,
          systemUptime: "99.97%",
          averageResponseTime: 1.2,
          successRate: 94.8,
        },
        recentAlerts: [
          {
            id: "alert_1",
            type: "security",
            severity: "high",
            message: "Multiple failed authentication attempts detected from IP 192.168.1.100",
            timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
            resolved: false,
          },
          {
            id: "alert_2",
            type: "system",
            severity: "medium",
            message: "Voice processing service response time above threshold",
            timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
            resolved: true,
          },
          {
            id: "alert_3",
            type: "user",
            severity: "low",
            message: "New user enrollment spike detected",
            timestamp: new Date(Date.now() - 6 * 3600000).toISOString(),
            resolved: true,
          },
        ],
        systemHealth: {
          status: "healthy",
          services: [
            { name: "Authentication API", status: "online", responseTime: 120 },
            { name: "Voice Processing", status: "online", responseTime: 850 },
            { name: "Database", status: "online", responseTime: 45 },
            { name: "ML Models", status: "degraded", responseTime: 1200 },
          ],
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
            <p className="font-open-sans">Loading admin dashboard...</p>
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
            <p className="font-open-sans">Failed to load admin data</p>
            <Button onClick={loadAdminData} className="mt-4 font-open-sans">
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
                <Shield className="h-6 w-6 text-primary" />
                <span className="text-lg font-black font-montserrat">VOCAL-ID</span>
              </Link>
              <Badge variant="destructive" className="font-open-sans">
                Admin Panel
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    dashboardData.systemHealth.status === "healthy"
                      ? "bg-primary"
                      : dashboardData.systemHealth.status === "warning"
                        ? "bg-accent"
                        : "bg-destructive"
                  }`}
                />
                <span className="text-sm font-open-sans">System {dashboardData.systemHealth.status}</span>
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
          <h1 className="text-3xl font-black font-montserrat text-foreground mb-2">Admin Dashboard</h1>
          <p className="font-open-sans text-muted-foreground">
            Monitor system performance, manage users, and configure security settings
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="font-open-sans">
              Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="font-open-sans">
              Users
            </TabsTrigger>
            <TabsTrigger value="analytics" className="font-open-sans">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="security" className="font-open-sans">
              Security
            </TabsTrigger>
            <TabsTrigger value="settings" className="font-open-sans">
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* System Stats */}
            <AdminStats stats={dashboardData.systemStats} />

            {/* System Health */}
            <Card>
              <CardHeader>
                <CardTitle className="font-montserrat font-bold">System Health</CardTitle>
                <CardDescription className="font-open-sans">Real-time status of system services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {dashboardData.systemHealth.services.map((service) => (
                    <div key={service.name} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-open-sans font-medium">{service.name}</h4>
                        <div
                          className={`w-2 h-2 rounded-full ${
                            service.status === "online"
                              ? "bg-primary"
                              : service.status === "degraded"
                                ? "bg-accent"
                                : "bg-destructive"
                          }`}
                        />
                      </div>
                      <p className="text-sm font-open-sans text-muted-foreground">
                        {service.responseTime}ms response time
                      </p>
                      <Badge
                        variant={
                          service.status === "online"
                            ? "default"
                            : service.status === "degraded"
                              ? "secondary"
                              : "destructive"
                        }
                        className="mt-2"
                      >
                        {service.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="font-montserrat font-bold">Recent Alerts</CardTitle>
                <CardDescription className="font-open-sans">Latest system and security alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboardData.recentAlerts.map((alert) => (
                    <div key={alert.id} className="flex items-start justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-start space-x-3">
                        {alert.severity === "critical" && <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />}
                        {alert.severity === "high" && <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />}
                        {alert.severity === "medium" && <AlertTriangle className="h-5 w-5 text-accent mt-0.5" />}
                        {alert.severity === "low" && <AlertTriangle className="h-5 w-5 text-primary mt-0.5" />}
                        <div>
                          <p className="font-open-sans font-medium">{alert.message}</p>
                          <p className="text-sm font-open-sans text-muted-foreground">
                            {new Date(alert.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={
                            alert.severity === "critical" || alert.severity === "high"
                              ? "destructive"
                              : alert.severity === "medium"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {alert.severity}
                        </Badge>
                        {alert.resolved && (
                          <Badge variant="outline" className="text-xs">
                            Resolved
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="font-montserrat font-bold">Quick Actions</CardTitle>
                <CardDescription className="font-open-sans">Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Button className="h-20 flex flex-col space-y-2 font-open-sans">
                    <Users className="h-6 w-6" />
                    <span>Manage Users</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col space-y-2 font-open-sans bg-transparent">
                    <BarChart3 className="h-6 w-6" />
                    <span>View Reports</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col space-y-2 font-open-sans bg-transparent">
                    <Lock className="h-6 w-6" />
                    <span>Security Audit</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col space-y-2 font-open-sans bg-transparent">
                    <Database className="h-6 w-6" />
                    <span>System Backup</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div>
              <h2 className="text-2xl font-black font-montserrat">User Management</h2>
              <p className="font-open-sans text-muted-foreground">Manage user accounts and voice profiles</p>
            </div>
            <UserManagement />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div>
              <h2 className="text-2xl font-black font-montserrat">System Analytics</h2>
              <p className="font-open-sans text-muted-foreground">Detailed system performance and usage analytics</p>
            </div>
            <SystemAnalytics />
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <div>
              <h2 className="text-2xl font-black font-montserrat">Security Monitoring</h2>
              <p className="font-open-sans text-muted-foreground">Monitor security events and threats</p>
            </div>
            <SecurityMonitoring />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div>
              <h2 className="text-2xl font-black font-montserrat">System Settings</h2>
              <p className="font-open-sans text-muted-foreground">Configure system parameters and security policies</p>
            </div>
            <SystemSettings />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
