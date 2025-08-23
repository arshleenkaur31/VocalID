"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Mic, Shield, Zap, CheckCircle, XCircle } from "lucide-react"

export default function DemoPage() {
  const [isRecording, setIsRecording] = useState(false)
  const [demoStep, setDemoStep] = useState<"idle" | "recording" | "processing" | "success" | "failed">("idle")

  const startDemo = () => {
    setIsRecording(true)
    setDemoStep("recording")

    // Simulate recording for 3 seconds
    setTimeout(() => {
      setIsRecording(false)
      setDemoStep("processing")

      // Simulate processing for 2 seconds
      setTimeout(() => {
        // Random success/failure for demo
        const success = Math.random() > 0.3
        setDemoStep(success ? "success" : "failed")
      }, 2000)
    }, 3000)
  }

  const resetDemo = () => {
    setDemoStep("idle")
    setIsRecording(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-lime-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-green-600 hover:text-green-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-black text-gray-900 mb-4">VOCAL-ID Demo</h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            Experience our triple-factor voice authentication system. Say the phrase below to test the technology.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Demo Interface */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="w-5 h-5" />
                Voice Authentication Demo
              </CardTitle>
              <CardDescription>
                Click the button and say: <strong>"The quick brown fox jumps over the lazy dog"</strong>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Recording Interface */}
              <div className="text-center">
                <div
                  className={`w-32 h-32 mx-auto rounded-full border-4 flex items-center justify-center transition-all duration-300 ${
                    isRecording
                      ? "border-red-500 bg-red-50 animate-pulse"
                      : demoStep === "processing"
                        ? "border-yellow-500 bg-yellow-50"
                        : demoStep === "success"
                          ? "border-green-500 bg-green-50"
                          : demoStep === "failed"
                            ? "border-red-500 bg-red-50"
                            : "border-green-500 bg-green-50"
                  }`}
                >
                  {demoStep === "idle" && <Mic className="w-12 h-12 text-green-600" />}
                  {demoStep === "recording" && <Mic className="w-12 h-12 text-red-600" />}
                  {demoStep === "processing" && <Zap className="w-12 h-12 text-yellow-600 animate-spin" />}
                  {demoStep === "success" && <CheckCircle className="w-12 h-12 text-green-600" />}
                  {demoStep === "failed" && <XCircle className="w-12 h-12 text-red-600" />}
                </div>

                <div className="mt-4">
                  {demoStep === "idle" && (
                    <Button onClick={startDemo} size="lg" className="bg-green-600 hover:bg-green-700">
                      Start Demo
                    </Button>
                  )}
                  {demoStep === "recording" && <p className="text-red-600 font-semibold">Recording... Speak now!</p>}
                  {demoStep === "processing" && <p className="text-yellow-600 font-semibold">Processing voice...</p>}
                  {(demoStep === "success" || demoStep === "failed") && (
                    <Button onClick={resetDemo} variant="outline">
                      Try Again
                    </Button>
                  )}
                </div>
              </div>

              {/* Results */}
              {(demoStep === "success" || demoStep === "failed") && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div
                        className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center ${
                          demoStep === "success" ? "bg-green-100" : "bg-red-100"
                        }`}
                      >
                        <Shield className={`w-6 h-6 ${demoStep === "success" ? "text-green-600" : "text-red-600"}`} />
                      </div>
                      <p className="text-sm font-medium mt-2">Speaker ID</p>
                      <Badge variant={demoStep === "success" ? "default" : "destructive"}>
                        {demoStep === "success" ? "94%" : "67%"}
                      </Badge>
                    </div>
                    <div className="text-center">
                      <div
                        className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center ${
                          demoStep === "success" ? "bg-green-100" : "bg-red-100"
                        }`}
                      >
                        <Mic className={`w-6 h-6 ${demoStep === "success" ? "text-green-600" : "text-red-600"}`} />
                      </div>
                      <p className="text-sm font-medium mt-2">Content</p>
                      <Badge variant={demoStep === "success" ? "default" : "destructive"}>
                        {demoStep === "success" ? "98%" : "45%"}
                      </Badge>
                    </div>
                    <div className="text-center">
                      <div
                        className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center ${
                          demoStep === "success" ? "bg-green-100" : "bg-red-100"
                        }`}
                      >
                        <Zap className={`w-6 h-6 ${demoStep === "success" ? "text-green-600" : "text-red-600"}`} />
                      </div>
                      <p className="text-sm font-medium mt-2">Liveness</p>
                      <Badge variant={demoStep === "success" ? "default" : "destructive"}>
                        {demoStep === "success" ? "96%" : "72%"}
                      </Badge>
                    </div>
                  </div>

                  <div
                    className={`p-4 rounded-lg ${
                      demoStep === "success" ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
                    }`}
                  >
                    <p className={`font-semibold ${demoStep === "success" ? "text-green-800" : "text-red-800"}`}>
                      {demoStep === "success" ? "✓ Authentication Successful" : "✗ Authentication Failed"}
                    </p>
                    <p className={`text-sm mt-1 ${demoStep === "success" ? "text-green-600" : "text-red-600"}`}>
                      {demoStep === "success"
                        ? "All three factors passed verification thresholds."
                        : "One or more factors failed to meet verification thresholds."}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Information Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 font-semibold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Speaker Verification</h4>
                    <p className="text-sm text-gray-600">
                      Analyzes unique voice characteristics and biometric patterns
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 font-semibold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Content Matching</h4>
                    <p className="text-sm text-gray-600">
                      Converts speech to text and matches against challenge phrase
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 font-semibold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Liveness Detection</h4>
                    <p className="text-sm text-gray-600">Detects real-time speech patterns to prevent spoofing</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ready to Get Started?</CardTitle>
                <CardDescription>Set up your voice profile and start using secure voice authentication</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Button asChild className="bg-green-600 hover:bg-green-700">
                    <Link href="/enroll">Enroll Now</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/authenticate">Try Authentication</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
