import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Shield, Activity, Clock } from "lucide-react"

interface DashboardStatsProps {
  stats: {
    totalAuthentications: number
    successRate: number
    lastAuthentication: string
    activeProfiles: number
  }
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-montserrat font-medium">Total Authentications</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-black font-montserrat">{stats.totalAuthentications}</div>
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
          <p className="text-xs font-open-sans text-muted-foreground">Authentication success rate</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-montserrat font-medium">Active Profiles</CardTitle>
          <Shield className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-black font-montserrat">{stats.activeProfiles}</div>
          <p className="text-xs font-open-sans text-muted-foreground">Enrolled voice profiles</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-montserrat font-medium">Last Authentication</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-black font-montserrat">
            {new Date(stats.lastAuthentication).toLocaleDateString()}
          </div>
          <p className="text-xs font-open-sans text-muted-foreground">
            {new Date(stats.lastAuthentication).toLocaleTimeString()}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
