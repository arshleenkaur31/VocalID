"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Shield, XCircle, CheckCircle, Eye, Ban } from "lucide-react"

interface SecurityThreat {
  id: string
  type: "brute_force" | "spoofing" | "replay_attack" | "suspicious_pattern"
  severity: "low" | "medium" | "high" | "critical"
  source: string
  target: string
  description: string
  timestamp: string
  status: "active" | "mitigated" | "investigating"
  attempts: number
}

export function SecurityMonitoring() {
  const [threats, setThreats] = useState<SecurityThreat[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadSecurityThreats()
  }, [])

  const loadSecurityThreats = async () => {
    setIsLoading(true)
    try {
      // Mock data - replace with actual API call
      const mockThreats: SecurityThreat[] = [
        {
          id: "threat_1",
          type: "brute_force",
          severity: "high",
          source: "192.168.1.100",
          target: "user@example.com",
          description: "Multiple failed authentication attempts from single IP",
          timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
          status: "active",
          attempts: 15,
        },
        {
          id: "threat_2",
          type: "spoofing",
          severity: "critical",
          source: "Unknown",
          target: "admin@company.com",
          description: "Potential voice spoofing attempt detected",
          timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
          status: "investigating",
          attempts: 3,
        },
        {
          id: "threat_3",
          type: "suspicious_pattern",
          severity: "medium",
          source: "Multiple IPs",
          target: "Multiple users",
          description: "Unusual authentication pattern across multiple accounts",
          timestamp: new Date(Date.now() - 6 * 3600000).toISOString(),
          status: "mitigated",
          attempts: 8,
        },
        {
          id: "threat_4",
          type: "replay_attack",
          severity: "high",
          source: "203.0.113.45",
          target: "john.doe@example.com",
          description: "Replay attack using recorded voice sample",
          timestamp: new Date(Date.now() - 12 * 3600000).toISOString(),
          status: "mitigated",
          attempts: 5,
        },
      ]
      setThreats(mockThreats)
    } catch (error) {
      console.error("Failed to load security threats:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <XCircle className="h-5 w-5 text-destructive" />
      case "high":
        return <AlertTriangle className="h-5 w-5 text-destructive" />
      case "medium":
        return <AlertTriangle className="h-5 w-5 text-accent" />
      case "low":
        return <Shield className="h-5 w-5 text-primary" />
      default:
        return <Shield className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="destructive">Active</Badge>
      case "investigating":
        return <Badge variant="secondary">Investigating</Badge>
      case "mitigated":
        return <Badge className="font-open-sans">Mitigated</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getThreatTypeLabel = (type: string) => {
    switch (type) {
      case "brute_force":
        return "Brute Force Attack"
      case "spoofing":
        return "Voice Spoofing"
      case "replay_attack":
        return "Replay Attack"
      case "suspicious_pattern":
        return "Suspicious Pattern"
      default:
        return "Unknown Threat"
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="font-open-sans">Loading security threats...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-montserrat font-bold">Active Threats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black font-montserrat text-destructive">
              {threats.filter((t) => t.status === "active").length}
            </div>
            <p className="text-sm font-open-sans text-muted-foreground">Require immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-montserrat font-bold">Under Investigation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black font-montserrat text-accent">
              {threats.filter((t) => t.status === "investigating").length}
            </div>
            <p className="text-sm font-open-sans text-muted-foreground">Being analyzed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-montserrat font-bold">Mitigated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black font-montserrat text-primary">
              {threats.filter((t) => t.status === "mitigated").length}
            </div>
            <p className="text-sm font-open-sans text-muted-foreground">Successfully handled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-montserrat font-bold">Total Attempts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black font-montserrat">
              {threats.reduce((sum, threat) => sum + threat.attempts, 0)}
            </div>
            <p className="text-sm font-open-sans text-muted-foreground">Malicious attempts blocked</p>
          </CardContent>
        </Card>
      </div>

      {/* Threat List */}
      <Card>
        <CardHeader>
          <CardTitle className="font-montserrat font-bold">Security Threats</CardTitle>
          <CardDescription className="font-open-sans">
            Real-time monitoring of security threats and attacks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {threats.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                <p className="font-open-sans text-muted-foreground">No active security threats detected</p>
              </div>
            ) : (
              threats.map((threat) => (
                <div key={threat.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {getSeverityIcon(threat.severity)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-open-sans font-medium">{getThreatTypeLabel(threat.type)}</h4>
                          {getStatusBadge(threat.status)}
                        </div>
                        <p className="text-sm font-open-sans text-muted-foreground mb-2">{threat.description}</p>
                        <div className="grid grid-cols-2 gap-4 text-xs font-open-sans text-muted-foreground">
                          <div>
                            <span className="font-medium">Source:</span> {threat.source}
                          </div>
                          <div>
                            <span className="font-medium">Target:</span> {threat.target}
                          </div>
                          <div>
                            <span className="font-medium">Attempts:</span> {threat.attempts}
                          </div>
                          <div>
                            <span className="font-medium">Time:</span> {new Date(threat.timestamp).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={
                          threat.severity === "critical" || threat.severity === "high"
                            ? "destructive"
                            : threat.severity === "medium"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {threat.severity}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="font-open-sans bg-transparent">
                      <Eye className="h-4 w-4 mr-2" />
                      Investigate
                    </Button>
                    <Button variant="outline" size="sm" className="font-open-sans bg-transparent">
                      <Ban className="h-4 w-4 mr-2" />
                      Block Source
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
