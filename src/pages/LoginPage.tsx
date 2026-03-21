import { useState, useMemo } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoginOverlay } from "@/components/auth/LoginOverlay";
import { AuthLogo } from "@/components/auth/AuthLogo";
import { AuthBackground } from "@/components/auth/AuthBackground";
import { useAuth } from "@/auth/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, defaultCredentials, isAuthenticated } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [serverError, setServerError] = useState("");

  const redirectTo = useMemo(() => {
    const state = location.state as any;
    return typeof state?.from === "string" ? state.from : "/";
  }, [location.state]);

  // Already logged in — go to dashboard
  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    setIsSubmitting(true);
    setShowOverlay(true);

    try {
      const result = await login(email, password);
      if (!result.ok) {
        setServerError(result.error || "Login failed");
        setShowOverlay(false);
        return;
      }
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Login failed");
      setShowOverlay(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <LoginOverlay isVisible={showOverlay} message="Logging you in to Sphere HR..." />

      <div className="flex min-h-screen w-full">
        {/* Left side — form */}
        <div className="flex w-full flex-col justify-center space-y-8 px-8 md:w-1/2 md:px-16 lg:px-32 bg-card">
          <div className="mb-10">
            <AuthLogo size="md" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              Login to your account
            </h1>
            <p className="text-muted-foreground">
              Enter your credentials to access your account
            </p>
          </div>

          <div className="space-y-6">
            {serverError && (
              <Alert variant="destructive">
                <AlertDescription>{serverError}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm text-muted-foreground font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 border-border focus:border-primary focus:ring-primary"
                  required
                  autoComplete="username"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm text-muted-foreground font-medium">
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-sm text-primary hover:underline pointer-events-none opacity-60"
                    tabIndex={-1}
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 pr-10 border-border focus:border-primary focus:ring-primary"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    Logging in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="rounded-lg border border-border bg-muted/50 px-4 py-3 text-sm">
              <p className="text-foreground font-semibold">Demo credentials</p>
              <p className="text-muted-foreground">
                Email: <span className="font-mono text-foreground">{defaultCredentials.email}</span>
              </p>
              <p className="text-muted-foreground">
                Password: <span className="font-mono text-foreground">{defaultCredentials.password}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right side — branded background */}
        <AuthBackground />
      </div>
    </>
  );
}
