import React from "react";

const modules = [
  { name: "Employees", delay: "0s" },
  { name: "Recruitment", delay: "0.1s" },
  { name: "Onboarding", delay: "0.15s" },
  { name: "Leave", delay: "0.25s" },
  { name: "Payroll", delay: "0.35s" },
  { name: "Departments", delay: "0.45s" },
  { name: "Reports", delay: "0.55s" },
  { name: "Compliance", delay: "0.65s" },
  { name: "Performance", delay: "0.75s" },
  { name: "Benefits", delay: "0.85s" },
];

export function AuthBackground({ children }: { children?: React.ReactNode }) {
  return (
    <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary">
      {/* Floating module pills */}
      <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-3 p-12 opacity-[0.08]">
        {modules.map((m) => (
          <span
            key={m.name}
            className="inline-block rounded-full border border-primary-foreground/40 px-5 py-2 text-sm text-primary-foreground animate-pulse"
            style={{ animationDelay: m.delay }}
          >
            {m.name}
          </span>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16">
        {children || (
          <>
            <h3 className="text-3xl xl:text-4xl font-semibold text-primary-foreground leading-tight" style={{ lineHeight: "1.15" }}>
              Sphere HR
            </h3>
            <p className="mt-4 text-primary-foreground/80 text-base max-w-md leading-relaxed">
              A modern HR platform for workforce management, recruitment tracking, and organizational analytics.
            </p>
            <div className="mt-8 flex flex-col gap-2 text-sm text-primary-foreground/70">
              <span>✓ Secure access</span>
              <span>✓ Role-based workflows</span>
              <span>✓ Reports & analytics</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
