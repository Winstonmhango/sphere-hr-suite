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
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
      <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
      <h3 className="text-lg font-semibold text-foreground">{message}</h3>
      <p className="text-sm text-muted-foreground mt-1">
        Please wait while we authenticate your credentials
      </p>
    </div>
  );
}
