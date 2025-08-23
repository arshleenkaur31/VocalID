"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, RefreshCw, AlertTriangle } from "lucide-react"

export function SystemSettings() {
  const [settings, setSettings] = useState({
    authentication: {
      confidenceThreshold: [95],
      maxAttempts: 3,
      lockoutDuration: 15,
      enableLivenessDetection: true,
      enableAntiSpoofing: true,
    },
    security: {
      enableRateLimiting: true,
      maxRequestsPerMinute: 100,
      enableGeoBlocking: false,
      suspiciousActivityThreshold: [80],
      autoBlockEnabled: true,
    },
    system: {
      enableLogging: true,
      logRetentionDays: 90,
      enableMetrics: true,
      maintenanceMode: false,
    },
  })

  const handleSave = async () => {
    try {
      // Save settings to API
      console.log("Saving settings:", settings)
      // Show success message
    } catch (error) {
      console.error("Failed to save settings:", error)
    }
  }

  const handleReset = () => {
    // Reset to default values
    setSettings({
      authentication: {
        confidenceThreshold: [95],
        maxAttempts: 3,
        lockoutDuration: 15,
        enableLivenessDetection: true,
        enableAntiSpoofing: true,
      },
      security: {
        enableRateLimiting: true,
        maxRequestsPerMinute: 100,
        enableGeoBlocking: false,
        suspiciousActivityThreshold: [80],
        autoBlockEnabled: true,
      },
      system: {
        enableLogging: true,
        logRetentionDays: 90,
        enableMetrics: true,
        maintenanceMode: false,
      },
    })
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="authentication" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="authentication" className="font-open-sans">
            Authentication
          </TabsTrigger>
          <TabsTrigger value="security" className="font-open-sans">
            Security
          </TabsTrigger>
          <TabsTrigger value="system" className="font-open-sans">
            System
          </TabsTrigger>
        </TabsList>

        <TabsContent value="authentication" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-montserrat font-bold">Authentication Settings</CardTitle>
              <CardDescription className="font-open-sans">
                Configure voice authentication parameters and thresholds
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="font-open-sans font-medium">
                  Confidence Threshold: {settings.authentication.confidenceThreshold[0]}%
                </Label>
                <Slider
                  value={settings.authentication.confidenceThreshold}
                  onValueChange={(value) =>
                    setSettings({
                      ...settings,
                      authentication: { ...settings.authentication, confidenceThreshold: value },
                    })
                  }
                  max={100}
                  min={50}
                  step={1}
                  className="w-full"
                />
                <p className="text-sm font-open-sans text-muted-foreground">
                  Minimum confidence score required for successful authentication
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxAttempts" className="font-open-sans font-medium">
                    Max Failed Attempts
                  </Label>
                  <Input
                    id="maxAttempts"
                    type="number"
                    value={settings.authentication.maxAttempts}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        authentication: {
                          ...settings.authentication,
                          maxAttempts: Number.parseInt(e.target.value),
                        },
                      })
                    }
                    className="font-open-sans"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lockoutDuration" className="font-open-sans font-medium">
                    Lockout Duration (minutes)
                  </Label>
                  <Input
                    id="lockoutDuration"
                    type="number"
                    value={settings.authentication.lockoutDuration}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        authentication: {
                          ...settings.authentication,
                          lockoutDuration: Number.parseInt(e.target.value),
                        },
                      })
                    }
                    className="font-open-sans"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-open-sans font-medium">Enable Liveness Detection</Label>
                    <p className="text-sm font-open-sans text-muted-foreground">Detect synthetic and recorded voices</p>
                  </div>
                  <Switch
                    checked={settings.authentication.enableLivenessDetection}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        authentication: { ...settings.authentication, enableLivenessDetection: checked },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-open-sans font-medium">Enable Anti-Spoofing</Label>
                    <p className="text-sm font-open-sans text-muted-foreground">
                      Advanced protection against voice spoofing attacks
                    </p>
                  </div>
                  <Switch
                    checked={settings.authentication.enableAntiSpoofing}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        authentication: { ...settings.authentication, enableAntiSpoofing: checked },
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-montserrat font-bold">Security Settings</CardTitle>
              <CardDescription className="font-open-sans">
                Configure security policies and threat detection
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-open-sans font-medium">Enable Rate Limiting</Label>
                    <p className="text-sm font-open-sans text-muted-foreground">
                      Limit the number of requests per IP address
                    </p>
                  </div>
                  <Switch
                    checked={settings.security.enableRateLimiting}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        security: { ...settings.security, enableRateLimiting: checked },
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxRequests" className="font-open-sans font-medium">
                    Max Requests Per Minute
                  </Label>
                  <Input
                    id="maxRequests"
                    type="number"
                    value={settings.security.maxRequestsPerMinute}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        security: {
                          ...settings.security,
                          maxRequestsPerMinute: Number.parseInt(e.target.value),
                        },
                      })
                    }
                    className="font-open-sans"
                    disabled={!settings.security.enableRateLimiting}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-open-sans font-medium">Enable Geo-blocking</Label>
                    <p className="text-sm font-open-sans text-muted-foreground">
                      Block requests from specific geographic regions
                    </p>
                  </div>
                  <Switch
                    checked={settings.security.enableGeoBlocking}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        security: { ...settings.security, enableGeoBlocking: checked },
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label className="font-open-sans font-medium">
                    Suspicious Activity Threshold: {settings.security.suspiciousActivityThreshold[0]}%
                  </Label>
                  <Slider
                    value={settings.security.suspiciousActivityThreshold}
                    onValueChange={(value) =>
                      setSettings({
                        ...settings,
                        security: { ...settings.security, suspiciousActivityThreshold: value },
                      })
                    }
                    max={100}
                    min={50}
                    step={5}
                    className="w-full"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-open-sans font-medium">Auto-block Suspicious IPs</Label>
                    <p className="text-sm font-open-sans text-muted-foreground">
                      Automatically block IPs with suspicious activity
                    </p>
                  </div>
                  <Switch
                    checked={settings.security.autoBlockEnabled}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        security: { ...settings.security, autoBlockEnabled: checked },
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-montserrat font-bold">System Settings</CardTitle>
              <CardDescription className="font-open-sans">
                Configure system-wide settings and maintenance options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-open-sans font-medium">Enable System Logging</Label>
                    <p className="text-sm font-open-sans text-muted-foreground">
                      Log all system events and authentication attempts
                    </p>
                  </div>
                  <Switch
                    checked={settings.system.enableLogging}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        system: { ...settings.system, enableLogging: checked },
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logRetention" className="font-open-sans font-medium">
                    Log Retention Period (days)
                  </Label>
                  <Input
                    id="logRetention"
                    type="number"
                    value={settings.system.logRetentionDays}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        system: { ...settings.system, logRetentionDays: Number.parseInt(e.target.value) },
                      })
                    }
                    className="font-open-sans"
                    disabled={!settings.system.enableLogging}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-open-sans font-medium">Enable Metrics Collection</Label>
                    <p className="text-sm font-open-sans text-muted-foreground">
                      Collect performance and usage metrics
                    </p>
                  </div>
                  <Switch
                    checked={settings.system.enableMetrics}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        system: { ...settings.system, enableMetrics: checked },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-open-sans font-medium">Maintenance Mode</Label>
                    <p className="text-sm font-open-sans text-muted-foreground">
                      Temporarily disable the system for maintenance
                    </p>
                  </div>
                  <Switch
                    checked={settings.system.maintenanceMode}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        system: { ...settings.system, maintenanceMode: checked },
                      })
                    }
                  />
                </div>

                {settings.system.maintenanceMode && (
                  <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                      <div>
                        <p className="font-open-sans font-medium text-destructive">Warning</p>
                        <p className="text-sm font-open-sans text-destructive/80">
                          Maintenance mode will disable all authentication services. Users will not be able to
                          authenticate until maintenance mode is disabled.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button onClick={handleSave} className="font-open-sans font-medium">
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
        <Button variant="outline" onClick={handleReset} className="font-open-sans bg-transparent">
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset to Defaults
        </Button>
      </div>
    </div>
  )
}
