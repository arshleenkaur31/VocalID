import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Mic, Settings, Trash2, CheckCircle } from "lucide-react"

interface VoiceProfile {
  id: string
  name: string
  isActive: boolean
  enrolledAt: string
  lastUsed: string
  confidence: number
}

interface VoiceProfileCardProps {
  profile: VoiceProfile
}

export function VoiceProfileCard({ profile }: VoiceProfileCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Mic className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="font-montserrat font-bold">{profile.name}</CardTitle>
              <CardDescription className="font-open-sans">Enrolled on {formatDate(profile.enrolledAt)}</CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {profile.isActive ? (
              <Badge className="font-open-sans">
                <CheckCircle className="h-3 w-3 mr-1" />
                Active
              </Badge>
            ) : (
              <Badge variant="secondary" className="font-open-sans">
                Inactive
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Confidence Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-open-sans font-medium">Confidence Score</span>
            <span className="text-sm font-open-sans font-bold">{(profile.confidence * 100).toFixed(1)}%</span>
          </div>
          <Progress value={profile.confidence * 100} className="h-2" />
        </div>

        {/* Usage Info */}
        <div className="grid grid-cols-2 gap-4 text-sm font-open-sans">
          <div>
            <p className="text-muted-foreground">Last Used</p>
            <p className="font-medium">{formatDateTime(profile.lastUsed)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Status</p>
            <p className="font-medium">{profile.isActive ? "Ready for use" : "Inactive"}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1 font-open-sans bg-transparent">
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
          <Button variant="outline" size="sm" className="font-open-sans bg-transparent">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
