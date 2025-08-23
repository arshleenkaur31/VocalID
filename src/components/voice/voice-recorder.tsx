"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Mic, Square, Play, RotateCcw, Volume2 } from "lucide-react"

interface VoiceRecorderProps {
  onRecordingComplete: (recording: Blob) => void
  isRecording: boolean
  onRecordingStateChange: (isRecording: boolean) => void
  hasRecording: boolean
  maxDuration?: number // in seconds
}

export function VoiceRecorder({
  onRecordingComplete,
  isRecording,
  onRecordingStateChange,
  hasRecording,
  maxDuration = 10,
}: VoiceRecorderProps) {
  const [audioLevel, setAudioLevel] = useState(0)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null)
  const audioLevelTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current)
      if (audioLevelTimerRef.current) clearInterval(audioLevelTimerRef.current)
      if (audioContextRef.current) audioContextRef.current.close()
      if (audioUrl) URL.revokeObjectURL(audioUrl)
    }
  }, [audioUrl])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      })

      // Setup audio context for level monitoring
      audioContextRef.current = new AudioContext()
      analyserRef.current = audioContextRef.current.createAnalyser()
      const source = audioContextRef.current.createMediaStreamSource(stream)
      source.connect(analyserRef.current)
      analyserRef.current.fftSize = 256

      // Setup media recorder
      mediaRecorderRef.current = new MediaRecorder(stream)
      const chunks: Blob[] = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data)
        }
      }

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" })
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
        onRecordingComplete(blob)

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorderRef.current.start()
      onRecordingStateChange(true)
      setRecordingTime(0)

      // Start timers
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= maxDuration) {
            stopRecording()
            return prev
          }
          return prev + 0.1
        })
      }, 100)

      audioLevelTimerRef.current = setInterval(() => {
        if (analyserRef.current) {
          const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
          analyserRef.current.getByteFrequencyData(dataArray)
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length
          setAudioLevel(average)
        }
      }, 100)
    } catch (error) {
      console.error("Error accessing microphone:", error)
      alert("Unable to access microphone. Please check your permissions.")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop()
    }

    onRecordingStateChange(false)
    setAudioLevel(0)

    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current)
      recordingTimerRef.current = null
    }

    if (audioLevelTimerRef.current) {
      clearInterval(audioLevelTimerRef.current)
      audioLevelTimerRef.current = null
    }

    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }
  }

  const playRecording = () => {
    if (audioUrl && !isPlaying) {
      const audio = new Audio(audioUrl)
      audioRef.current = audio
      audio.play()
      setIsPlaying(true)

      audio.onended = () => {
        setIsPlaying(false)
        audioRef.current = null
      }
    } else if (audioRef.current && isPlaying) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setIsPlaying(false)
      audioRef.current = null
    }
  }

  const resetRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
      setAudioUrl(null)
    }
    setRecordingTime(0)
    setAudioLevel(0)
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
      audioRef.current = null
    }
  }

  return (
    <div className="space-y-4">
      {/* Recording Controls */}
      <div className="flex justify-center">
        {!isRecording && !hasRecording && (
          <Button onClick={startRecording} size="lg" className="w-20 h-20 rounded-full font-open-sans font-medium">
            <Mic className="h-8 w-8" />
          </Button>
        )}

        {isRecording && (
          <Button
            onClick={stopRecording}
            size="lg"
            variant="destructive"
            className="w-20 h-20 rounded-full font-open-sans font-medium"
          >
            <Square className="h-8 w-8" />
          </Button>
        )}

        {hasRecording && !isRecording && (
          <div className="flex gap-2">
            <Button
              onClick={playRecording}
              size="lg"
              variant="outline"
              className="w-16 h-16 rounded-full bg-transparent"
            >
              {isPlaying ? <Volume2 className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </Button>
            <Button
              onClick={resetRecording}
              size="lg"
              variant="outline"
              className="w-16 h-16 rounded-full bg-transparent"
            >
              <RotateCcw className="h-6 w-6" />
            </Button>
          </div>
        )}
      </div>

      {/* Recording Status */}
      {isRecording && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-open-sans">
            <span>Recording...</span>
            <span>
              {recordingTime.toFixed(1)}s / {maxDuration}s
            </span>
          </div>
          <Progress value={(recordingTime / maxDuration) * 100} className="h-2" />

          {/* Audio Level Indicator */}
          <div className="flex justify-center">
            <div className="flex items-center space-x-1">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-1 h-4 rounded-full transition-colors ${
                    audioLevel > i * 25 ? "bg-primary" : "bg-muted"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {hasRecording && !isRecording && (
        <div className="text-center">
          <p className="text-sm font-open-sans text-muted-foreground">
            Recording complete • {recordingTime.toFixed(1)}s
          </p>
        </div>
      )}
    </div>
  )
}
