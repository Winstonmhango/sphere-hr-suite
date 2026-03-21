export function AuthLogo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const iconSize = size === "sm" ? 0.45 : size === "lg" ? 0.45 : 0.45;

  return (
    <div className="flex flex-col items-start">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center shadow-[0_10px_30px_hsl(245_58%_51%/0.25)]">
          <span
            className="font-bold text-primary-foreground"
            style={{ fontSize: 20 }}
          >
            S
          </span>
        </div>
        <div className="leading-tight">
          <h2 className="text-xl font-extrabold tracking-tight text-foreground">
            Sphere HR
          </h2>
          <p className="text-sm text-muted-foreground">
            Human Resources Platform
          </p>
        </div>
      </div>
    </div>
  );
}
