"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Mic, ArrowLeft, Shield, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { VoiceAuthenticator } from "@/components/voice/voice-authenticator"

interface AuthenticationResult {
  success: boolean
  speakerScore: number
  contentScore: number
  livenessScore: number
  overallConfidence: number
  message: string
  failureReason?: string
}

export default function AuthenticatePage() {
  const [challengePhrase, setChallengePhrase] = useState<string>("")
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [authResult, setAuthResult] = useState<AuthenticationResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Generate challenge phrase on component mount
    generateChallengePhrase()
  }, [])

  const generateChallengePhrase = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/voice/challenge")
      const data = await response.json()
      setChallengePhrase(data.phrase)
    } catch (error) {
      console.error("Failed to generate challenge phrase:", error)
      setChallengePhrase("My voice is my password")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAuthenticationComplete = async (recording: Blob) => {
    setIsAuthenticating(true)

    try {
      const formData = new FormData()
      formData.append("audio", recording)
      formData.append("challengePhrase", challengePhrase)
      formData.append("userId", "demo-user") // In real app, get from session

      const response = await fetch("/api/voice/authenticate", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()
      setAuthResult(result)
    } catch (error) {
      console.error("Authentication error:", error)
      setAuthResult({
        success: false,
        speakerScore: 0,
        contentScore: 0,
        livenessScore: 0,
        overallConfidence: 0,
        message: "Authentication failed due to technical error",
        failureReason: "Network or server error",
      })
    } finally {
      setIsAuthenticating(false)
    }
  }

  const handleRetry = () => {
    setAuthResult(null)
    generateChallengePhrase()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="font-open-sans">Generating challenge phrase...</p>
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
            <Link href="/" className="flex items-center space-x-2">
              <ArrowLeft className="h-5 w-5" />
              <span className="font-open-sans">Back to Home</span>
            </Link>
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-lg font-black font-montserrat">VOCAL-ID</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {!authResult && (
          <Card>
            <CardHeader className="text-center">
              <Shield className="h-16 w-16 text-primary mx-auto mb-4" />
              <CardTitle className="font-montserrat font-bold text-3xl">Voice Authentication</CardTitle>
              <CardDescription className="font-open-sans text-lg">
                Speak the challenge phrase to authenticate your identity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Challenge Phrase */}
              <div className="bg-muted p-6 rounded-lg text-center">
                <p className="text-sm font-open-sans font-medium text-muted-foreground mb-2">Challenge Phrase:</p>
                <p className="text-xl font-open-sans font-bold text-foreground leading-relaxed">"{challengePhrase}"</p>
              </div>

              {/* Triple Factor Indicators */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-card border rounded-lg">
                  <Shield className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                  <p className="text-xs font-open-sans font-medium">Speaker ID</p>
                  <p className="text-xs font-open-sans text-muted-foreground">Voice Match</p>
                </div>
                <div className="text-center p-3 bg-card border rounded-lg">
                  <Mic className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                  <p className="text-xs font-open-sans font-medium">Content</p>
                  <p className="text-xs font-open-sans text-muted-foreground">Phrase Match</p>
                </div>
                <div className="text-center p-3 bg-card border rounded-lg">
                  <CheckCircle className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                  <p className="text-xs font-open-sans font-medium">Liveness</p>
                  <p className="text-xs font-open-sans text-muted-foreground">Real Voice</p>
                </div>
              </div>

              {/* Voice Authenticator */}
              <VoiceAuthenticator
                challengePhrase={challengePhrase}
                onAuthenticationComplete={handleAuthenticationComplete}
                isAuthenticating={isAuthenticating}
              />

              {isAuthenticating && (
                <div className="text-center space-y-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <div className="space-y-2">
                    <p className="font-open-sans font-medium">Analyzing your voice...</p>
                    <div className="space-y-1 text-sm font-open-sans text-muted-foreground">
                      <p>✓ Processing audio quality</p>
                      <p>✓ Verifying speaker identity</p>
                      <p>✓ Checking phrase content</p>
                      <p>✓ Detecting liveness</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {authResult && (
          <Card>
            <CardHeader className="text-center">
              {authResult.success ? (
                <>
                  <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
                  <CardTitle className="font-montserrat font-bold text-2xl text-primary">
                    Authentication Successful
                  </CardTitle>
                  <CardDescription className="font-open-sans">
                    Your identity has been verified successfully
                  </CardDescription>
                </>
              ) : (
                <>
                  <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
                  <CardTitle className="font-montserrat font-bold text-2xl text-destructive">
                    Authentication Failed
                  </CardTitle>
                  <CardDescription className="font-open-sans">{authResult.message}</CardDescription>
                </>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Authentication Scores */}
              <div className="space-y-4">
                <h4 className="font-montserrat font-bold text-center">Verification Results</h4>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4" />
                      <span className="font-open-sans font-medium">Speaker Identity</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Progress value={authResult.speakerScore * 100} className="w-20 h-2" />
                      <span className="text-sm font-open-sans font-medium w-12">
                        {(authResult.speakerScore * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Mic className="h-4 w-4" />
                      <span className="font-open-sans font-medium">Content Match</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Progress value={authResult.contentScore * 100} className="w-20 h-2" />
                      <span className="text-sm font-open-sans font-medium w-12">
                        {(authResult.contentScore * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4" />
                      <span className="font-open-sans font-medium">Liveness Score</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Progress value={authResult.livenessScore * 100} className="w-20 h-2" />
                      <span className="text-sm font-open-sans font-medium w-12">
                        {(authResult.livenessScore * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-3">
                  <div className="flex items-center justify-between">
                    <span className="font-open-sans font-bold">Overall Confidence</span>
                    <span className="text-lg font-montserrat font-bold">
                      {(authResult.overallConfidence * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              {authResult.failureReason && (
                <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                    <div>
                      <p className="font-open-sans font-medium text-destructive">Failure Reason:</p>
                      <p className="text-sm font-open-sans text-destructive/80">{authResult.failureReason}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                {authResult.success ? (
                  <>
                    <Link href="/dashboard" className="flex-1">
                      <Button className="w-full font-open-sans font-medium">Go to Dashboard</Button>
                    </Link>
                    <Button variant="outline" onClick={handleRetry} className="flex-1 font-open-sans bg-transparent">
                      Authenticate Again
                    </Button>
                  </>
                ) : (
                  <>
                    <Button onClick={handleRetry} className="flex-1 font-open-sans font-medium">
                      Try Again
                    </Button>
                    <Link href="/" className="flex-1">
                      <Button variant="outline" className="w-full font-open-sans bg-transparent">
                        Back to Home
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
