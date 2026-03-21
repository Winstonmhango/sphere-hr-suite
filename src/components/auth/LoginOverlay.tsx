import { Loader2 } from "lucide-react";

export function LoginOverlay({
  isVisible,
  message = "Logging you in to Sphere HR...",
}: {
  isVisible: boolean;
  message?: string;
}) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center justify-center space-y-4 rounded-lg bg-card p-8 shadow-lg border border-border">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <div className="text-center">
          <h3 className="text-xl font-semibold text-foreground">{message}</h3>
          <p className="text-sm text-muted-foreground">
            Please wait while we authenticate your credentials
          </p>
        </div>
      </div>
    </div>
  );
}
