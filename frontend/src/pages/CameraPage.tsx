import { Camera, Eye, ScanFace } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function CameraPage() {
  const handleEnable = () => {
    toast.info('Camera tracking coming soon', {
      description: 'MediaPipe face & hand scripts will load from the Flask backend.',
    });
  };

  return (
    <div>
      <PageHeader
        title="Camera"
        description="Point a webcam at yourself and the robot will turn its neck to follow your face."
        actions={
          <Button onClick={handleEnable}>
            <Camera className="h-4 w-4" />
            Turn on camera
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ScanFace className="h-4 w-4 text-accent" />
              Live camera
            </CardTitle>
            <CardDescription>
              Your webcam feed will show here once tracking is turned on.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="camera-stage">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 shadow-sm">
                <Eye className="h-8 w-8 text-primary" />
              </div>
              <div className="text-center">
                <p className="font-display text-sm font-semibold text-muted-foreground">
                  Camera is off
                </p>
                <p className="mt-1 max-w-md text-sm text-muted-foreground">
                  Click “Turn on camera” above when this feature is ready. You’ll see yourself and face markers here.
                </p>
              </div>
              <Badge variant="default">Coming soon</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Face Tracking</CardTitle>
            <CardDescription>Pan/tilt neck to keep face centered in frame</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>• MediaPipe Face Mesh for landmark detection</p>
            <p>• PID-smoothed neck commands via servo store</p>
            <p>• Toggle auto-follow from this panel</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hand Gestures</CardTitle>
            <CardDescription>Recognize wave, point, and stop gestures</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>• MediaPipe Hands for 21-point skeleton</p>
            <p>• Maps gestures to preset motions</p>
            <p>• Runs fully client-side after script load</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}