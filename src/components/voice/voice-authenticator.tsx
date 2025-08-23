"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-react"
import { VoiceRecorder } from "./voice-recorder"

interface VoiceAuthenticatorProps {
  challengePhrase: string
  onAuthenticationComplete: (recording: Blob) => void
  isAuthenticating: boolean
}

export function VoiceAuthenticator({
  challengePhrase,
  onAuthenticationComplete,
  isAuthenticating,
}: VoiceAuthenticatorProps) {
  const [hasRecording, setHasRecording] = useState(false)
  const [isRecording, setIsRecording] = useState(false)

  const handleRecordingComplete = (recording: Blob) => {
    setHasRecording(true)
    onAuthenticationComplete(recording)
  }

  const handleReset = () => {
    setHasRecording(false)
    setIsRecording(false)
  }

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="text-center space-y-2">
        <p className="font-open-sans font-medium">
          {isRecording
            ? "Recording... Speak the challenge phrase clearly"
            : hasRecording
              ? "Recording complete - analyzing your voice..."
              : "Tap the microphone and speak the challenge phrase above"}
        </p>
        {!isRecording && !hasRecording && (
          <p className="text-sm font-open-sans text-muted-foreground">
            Make sure you're in a quiet environment for best results
          </p>
        )}
      </div>

      {/* Voice Recorder */}
      <VoiceRecorder
        onRecordingComplete={handleRecordingComplete}
        isRecording={isRecording}
        onRecordingStateChange={setIsRecording}
        hasRecording={hasRecording}
        maxDuration={15}
      />

      {/* Reset Button */}
      {hasRecording && !isAuthenticating && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={handleReset}
            className="font-open-sans bg-transparent"
            disabled={isAuthenticating}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Record Again
          </Button>
        </div>
      )}
    </div>
  )
}
