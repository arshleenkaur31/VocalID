import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Activity, TrendingUp, Server, Clock, Shield } from "lucide-react"

interface AdminStatsProps {
  stats: {
    totalUsers: number
    activeUsers: number
    totalAuthentications: number
    systemUptime: string
    averageResponseTime: number
    successRate: number
  }
}

export function AdminStats({ stats }: AdminStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-montserrat font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-black font-montserrat">{stats.totalUsers.toLocaleString()}</div>
          <p className="text-xs font-open-sans text-muted-foreground">
            {stats.activeUsers.toLocaleString()} active users
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-montserrat font-medium">Total Authentications</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-black font-montserrat">{stats.totalAuthentications.toLocaleString()}</div>
          <p className="text-xs font-open-sans text-muted-foreground">All time authentication attempts</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-montserrat font-medium">Success Rate</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-black font-montserrat text-primary">{stats.successRate}%</div>
          <p className="text-xs font-open-sans text-muted-foreground">System-wide success rate</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-montserrat font-medium">System Uptime</CardTitle>
          <Server className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-black font-montserrat text-primary">{stats.systemUptime}</div>
          <p className="text-xs font-open-sans text-muted-foreground">Last 30 days</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-montserrat font-medium">Avg Response Time</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-black font-montserrat">{stats.averageResponseTime}s</div>
          <p className="text-xs font-open-sans text-muted-foreground">Authentication processing time</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-montserrat font-medium">Active Users</CardTitle>
          <Shield className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-black font-montserrat">{stats.activeUsers.toLocaleString()}</div>
          <p className="text-xs font-open-sans text-muted-foreground">
            {((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}% of total users
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
