export function AuthLogo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const boxSize = size === "sm" ? "w-9 h-9" : size === "lg" ? "w-14 h-14" : "w-11 h-11";
  const textSize = size === "sm" ? "text-lg" : size === "lg" ? "text-3xl" : "text-2xl";
  const letterSize = size === "sm" ? "text-sm" : size === "lg" ? "text-2xl" : "text-lg";

  return (
    <div className="flex flex-col items-center gap-3">
      <div className={`${boxSize} rounded-xl bg-primary flex items-center justify-center`}>
        <span className={`${letterSize} font-bold text-primary-foreground`}>S</span>
      </div>
      <div className="text-center">
        <h2 className={`${textSize} font-semibold tracking-tight text-foreground`}>
          Sphere HR
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Human Resources Platform
        </p>
      </div>
    </div>
  );
}
