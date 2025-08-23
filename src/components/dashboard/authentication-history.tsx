"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react"

interface AuthenticationRecord {
  id: string
  timestamp: string
  result: "success" | "failed" | "warning"
  confidence: number
  challengePhrase: string
  ipAddress: string
  userAgent: string
  failureReason?: string
}

export function AuthenticationHistory() {
  const [records, setRecords] = useState<AuthenticationRecord[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const recordsPerPage = 10

  useEffect(() => {
    loadAuthenticationHistory()
  }, [currentPage])

  const loadAuthenticationHistory = async () => {
    setIsLoading(true)
    try {
      // Mock data - replace with actual API call
      const mockRecords: AuthenticationRecord[] = Array.from({ length: 50 }, (_, i) => ({
        id: `auth_${i + 1}`,
        timestamp: new Date(Date.now() - i * 3600000).toISOString(),
        result: Math.random() > 0.1 ? "success" : Math.random() > 0.5 ? "failed" : "warning",
        confidence: 0.7 + Math.random() * 0.3,
        challengePhrase: [
          "My voice is my password",
          "Authentication successful",
          "The quick brown fox jumps over the lazy dog",
          "Secure access granted",
        ][Math.floor(Math.random() * 4)],
        ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        failureReason: Math.random() > 0.8 ? "Low confidence score" : undefined,
      }))

      const startIndex = (currentPage - 1) * recordsPerPage
      const endIndex = startIndex + recordsPerPage
      setRecords(mockRecords.slice(startIndex, endIndex))
    } catch (error) {
      console.error("Failed to load authentication history:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const totalPages = Math.ceil(50 / recordsPerPage) // Mock total

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="font-open-sans">Loading authentication history...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-montserrat font-bold">Authentication History</CardTitle>
        <CardDescription className="font-open-sans">Detailed log of all authentication attempts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {records.map((record) => (
            <div key={record.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {record.result === "success" && <CheckCircle className="h-5 w-5 text-primary" />}
                  {record.result === "failed" && <XCircle className="h-5 w-5 text-destructive" />}
                  {record.result === "warning" && <AlertTriangle className="h-5 w-5 text-accent" />}
                  <div>
                    <p className="font-open-sans font-medium">{new Date(record.timestamp).toLocaleString()}</p>
                    <p className="text-sm font-open-sans text-muted-foreground">
                      Challenge: "{record.challengePhrase}"
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge
                    variant={
                      record.result === "success" ? "default" : record.result === "failed" ? "destructive" : "secondary"
                    }
                  >
                    {record.result}
                  </Badge>
                  <p className="text-sm font-open-sans text-muted-foreground mt-1">
                    {(record.confidence * 100).toFixed(1)}% confidence
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm font-open-sans text-muted-foreground">
                <div>
                  <span className="font-medium">IP Address:</span> {record.ipAddress}
                </div>
                <div>
                  <span className="font-medium">Device:</span> Desktop Browser
                </div>
              </div>

              {record.failureReason && (
                <div className="bg-destructive/10 border border-destructive/20 p-3 rounded-lg">
                  <p className="text-sm font-open-sans text-destructive">
                    <span className="font-medium">Failure Reason:</span> {record.failureReason}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm font-open-sans text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="font-open-sans bg-transparent"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="font-open-sans bg-transparent"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
