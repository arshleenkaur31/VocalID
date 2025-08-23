"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Shield, Info, XCircle } from "lucide-react"

interface SecurityEvent {
  id: string
  type: "suspicious_activity" | "failed_attempts" | "new_device" | "security_alert"
  severity: "low" | "medium" | "high" | "critical"
  title: string
  description: string
  timestamp: string
  resolved: boolean
  metadata?: Record<string, any>
}

export function SecurityEvents() {
  const [events, setEvents] = useState<SecurityEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadSecurityEvents()
  }, [])

  const loadSecurityEvents = async () => {
    setIsLoading(true)
    try {
      // Mock data - replace with actual API call
      const mockEvents: SecurityEvent[] = [
        {
          id: "event_1",
          type: "suspicious_activity",
          severity: "medium",
          title: "Unusual Authentication Pattern",
          description: "Multiple authentication attempts from different locations within a short time frame",
          timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
          resolved: false,
          metadata: { attempts: 5, locations: ["New York", "London"] },
        },
        {
          id: "event_2",
          type: "failed_attempts",
          severity: "low",
          title: "Multiple Failed Authentications",
          description: "3 consecutive authentication failures detected",
          timestamp: new Date(Date.now() - 6 * 3600000).toISOString(),
          resolved: true,
          metadata: { attempts: 3, lastAttempt: "2024-08-23T08:30:00Z" },
        },
        {
          id: "event_3",
          type: "new_device",
          severity: "low",
          title: "New Device Authentication",
          description: "Authentication successful from a new device",
          timestamp: new Date(Date.now() - 24 * 3600000).toISOString(),
          resolved: true,
          metadata: { device: "iPhone 15", location: "San Francisco" },
        },
        {
          id: "event_4",
          type: "security_alert",
          severity: "high",
          title: "Potential Voice Spoofing Attempt",
          description: "Liveness detection flagged potential synthetic voice",
          timestamp: new Date(Date.now() - 48 * 3600000).toISOString(),
          resolved: true,
          metadata: { confidence: 0.65, reason: "Unusual spectral patterns" },
        },
      ]

      setEvents(mockEvents)
    } catch (error) {
      console.error("Failed to load security events:", error)
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
        return <Info className="h-5 w-5 text-primary" />
      default:
        return <Shield className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>
      case "high":
        return <Badge variant="destructive">High</Badge>
      case "medium":
        return <Badge variant="secondary">Medium</Badge>
      case "low":
        return <Badge variant="outline">Low</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="font-open-sans">Loading security events...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-montserrat font-bold">Security Events</CardTitle>
        <CardDescription className="font-open-sans">Monitor security alerts and suspicious activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="font-open-sans text-muted-foreground">No security events to display</p>
            </div>
          ) : (
            events.map((event) => (
              <div key={event.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {getSeverityIcon(event.severity)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-open-sans font-medium">{event.title}</h4>
                        {event.resolved && (
                          <Badge variant="outline" className="text-xs">
                            Resolved
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm font-open-sans text-muted-foreground mb-2">{event.description}</p>
                      <p className="text-xs font-open-sans text-muted-foreground">
                        {new Date(event.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">{getSeverityBadge(event.severity)}</div>
                </div>

                {event.metadata && (
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-xs font-open-sans font-medium text-muted-foreground mb-2">Additional Details:</p>
                    <div className="text-xs font-open-sans text-muted-foreground space-y-1">
                      {Object.entries(event.metadata).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="capitalize">{key.replace(/_/g, " ")}:</span>
                          <span>{Array.isArray(value) ? value.join(", ") : String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
