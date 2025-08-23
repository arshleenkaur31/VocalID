"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Mic, ArrowLeft, ArrowRight, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { EnrollmentStep } from "@/components/voice/enrollment-step"

const ENROLLMENT_PHRASES = [
  "My voice is my password",
  "The quick brown fox jumps over the lazy dog",
  "Authentication successful with voice recognition",
]

export default function EnrollPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [recordings, setRecordings] = useState<{ [key: number]: Blob | null }>({})
  const [isProcessing, setIsProcessing] = useState(false)
  const [enrollmentComplete, setEnrollmentComplete] = useState(false)

  const totalSteps = ENROLLMENT_PHRASES.length + 2 // intro + phrases + completion
  const progress = ((currentStep + 1) / totalSteps) * 100

  const handleRecordingComplete = (recording: Blob) => {
    setRecordings((prev) => ({
      ...prev,
      [currentStep - 1]: recording,
    }))
  }

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleCompleteEnrollment = async () => {
    setIsProcessing(true)

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Here you would typically send recordings to your API
    console.log("Recordings:", recordings)

    setEnrollmentComplete(true)
    setIsProcessing(false)
  }

  if (enrollmentComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
            <CardTitle className="font-montserrat font-bold text-2xl">Enrollment Complete!</CardTitle>
            <CardDescription className="font-open-sans">
              Your voice profile has been successfully created and secured.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm font-open-sans text-muted-foreground">
              <p>✓ Voice biometric template created</p>
              <p>✓ Security profile activated</p>
              <p>✓ Ready for authentication</p>
            </div>
            <div className="flex flex-col gap-2">
              <Link href="/dashboard">
                <Button className="w-full font-open-sans font-medium">Go to Dashboard</Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full font-open-sans bg-transparent">
                  Back to Home
                </Button>
              </Link>
            </div>
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
              <Mic className="h-6 w-6 text-primary" />
              <span className="text-lg font-black font-montserrat">VOCAL-ID</span>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-muted py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-open-sans font-medium">
              Step {currentStep + 1} of {totalSteps}
            </span>
            <span className="text-sm font-open-sans text-muted-foreground">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {currentStep === 0 && (
          <Card>
            <CardHeader className="text-center">
              <Mic className="h-16 w-16 text-primary mx-auto mb-4" />
              <CardTitle className="font-montserrat font-bold text-3xl">Voice Enrollment</CardTitle>
              <CardDescription className="font-open-sans text-lg">
                Let's create your secure voice profile in just a few minutes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-montserrat font-bold">Record 3 Phrases</h4>
                    <p className="text-sm font-open-sans text-muted-foreground">
                      We'll guide you through recording three different phrases to capture your unique voice
                      characteristics.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-montserrat font-bold">Voice Analysis</h4>
                    <p className="text-sm font-open-sans text-muted-foreground">
                      Our AI analyzes your voice patterns to create a secure biometric template.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-montserrat font-bold">Secure Storage</h4>
                    <p className="text-sm font-open-sans text-muted-foreground">
                      Your voice profile is encrypted and stored securely for future authentication.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-5 w-5 text-accent mt-0.5" />
                  <div className="text-sm font-open-sans">
                    <p className="font-medium">For best results:</p>
                    <ul className="mt-1 space-y-1 text-muted-foreground">
                      <li>• Find a quiet environment</li>
                      <li>• Speak clearly and naturally</li>
                      <li>• Hold your device 6-8 inches away</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Button onClick={handleNext} className="w-full font-open-sans font-medium" size="lg">
                Start Enrollment
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {currentStep >= 1 && currentStep <= ENROLLMENT_PHRASES.length && (
          <EnrollmentStep
            stepNumber={currentStep}
            totalSteps={ENROLLMENT_PHRASES.length}
            phrase={ENROLLMENT_PHRASES[currentStep - 1]}
            onRecordingComplete={handleRecordingComplete}
            hasRecording={!!recordings[currentStep - 1]}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )}

        {currentStep === totalSteps - 1 && (
          <Card>
            <CardHeader className="text-center">
              <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
              <CardTitle className="font-montserrat font-bold text-2xl">Ready to Complete</CardTitle>
              <CardDescription className="font-open-sans">
                Review your recordings and complete your voice enrollment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                {ENROLLMENT_PHRASES.map((phrase, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-open-sans font-medium">Recording {index + 1}</p>
                      <p className="text-sm text-muted-foreground font-open-sans">"{phrase}"</p>
                    </div>
                    {recordings[index] ? (
                      <CheckCircle className="h-5 w-5 text-primary" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-destructive" />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={handlePrevious} className="flex-1 font-open-sans bg-transparent">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                <Button
                  onClick={handleCompleteEnrollment}
                  disabled={isProcessing || Object.keys(recordings).length < ENROLLMENT_PHRASES.length}
                  className="flex-1 font-open-sans font-medium"
                >
                  {isProcessing ? "Processing..." : "Complete Enrollment"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
