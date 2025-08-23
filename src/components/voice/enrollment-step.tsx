"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Mic } from "lucide-react"
import { VoiceRecorder } from "./voice-recorder"

interface EnrollmentStepProps {
  stepNumber: number
  totalSteps: number
  phrase: string
  onRecordingComplete: (recording: Blob) => void
  hasRecording: boolean
  onNext: () => void
  onPrevious: () => void
}

export function EnrollmentStep({
  stepNumber,
  totalSteps,
  phrase,
  onRecordingComplete,
  hasRecording,
  onNext,
  onPrevious,
}: EnrollmentStepProps) {
  const [isRecording, setIsRecording] = useState(false)

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4">
          <Mic className="h-8 w-8" />
        </div>
        <CardTitle className="font-montserrat font-bold text-2xl">
          Recording {stepNumber} of {totalSteps}
        </CardTitle>
        <CardDescription className="font-open-sans">
          Please read the following phrase clearly and naturally
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Phrase Display */}
        <div className="bg-muted p-6 rounded-lg text-center">
          <p className="text-xl font-open-sans font-medium text-foreground leading-relaxed">"{phrase}"</p>
        </div>

        {/* Voice Recorder */}
        <VoiceRecorder
          onRecordingComplete={onRecordingComplete}
          isRecording={isRecording}
          onRecordingStateChange={setIsRecording}
          hasRecording={hasRecording}
        />

        {/* Instructions */}
        <div className="text-center space-y-2">
          <p className="text-sm font-open-sans text-muted-foreground">
            {isRecording
              ? "Recording... Speak the phrase above clearly"
              : hasRecording
                ? "Great! You can re-record if needed or continue to the next step"
                : "Tap the microphone button and speak the phrase above"}
          </p>
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onPrevious}
            className="flex-1 font-open-sans bg-transparent"
            disabled={isRecording}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <Button
            onClick={onNext}
            disabled={!hasRecording || isRecording}
            className="flex-1 font-open-sans font-medium"
          >
            Next Step
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
