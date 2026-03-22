import React from "react";
import authBg from "@/assets/auth-bg.jpg";

const modules = [
  { name: "Employees", delay: "0s" },
  { name: "Recruitment", delay: "0.1s" },
  { name: "Onboarding", delay: "0.2s" },
  { name: "Leave", delay: "0.3s" },
  { name: "Payroll", delay: "0.4s" },
  { name: "Departments", delay: "0.5s" },
  { name: "Reports", delay: "0.6s" },
  { name: "Compliance", delay: "0.7s" },
  { name: "Performance", delay: "0.8s" },
  { name: "Benefits", delay: "0.9s" },
  { name: "Timetable", delay: "1.0s" },
  { name: "Analytics", delay: "1.1s" },
];

export function AuthBackground({ children }: { children?: React.ReactNode }) {
  return (
    <div className="hidden md:block md:w-1/2 relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/75 to-primary/90 mix-blend-multiply" />
      <div className="absolute inset-0 bg-primary" />
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(245,58%,45%)]/70 via-[hsl(245,58%,40%)]/70 to-[hsl(245,58%,30%)]/70" />

      <div className="relative z-10 h-full flex flex-col items-center justify-center px-8 text-center">
        {/* Floating module pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-8 max-w-md mx-auto">
          {modules.map((m) => (
            <div
              key={m.name}
              className="rounded-full bg-white/90 px-5 py-2.5 text-sm font-medium shadow-md backdrop-blur-sm border border-white/20 transition-all hover:scale-105 hover:shadow-lg hover:bg-white/95 animate-float"
              style={{
                animationDelay: m.delay,
                animationDuration: "3s",
              }}
            >
              <span className="text-primary">{m.name}</span>
            </div>
          ))}
        </div>

        {children || (
          <div className="mt-8 space-y-4 text-primary-foreground">
            <h3 className="text-2xl font-semibold">Sphere HR</h3>
            <p className="text-primary-foreground/90 max-w-md mx-auto">
              A modern HR platform for workforce management, recruitment
              tracking, and organizational analytics.
            </p>
            <div className="pt-2 space-y-2">
              <p className="text-primary-foreground/80 text-sm max-w-md mx-auto">
                Streamline operations, track performance, and manage your
                workforce effectively across your organization.
              </p>
              <div className="pt-2 flex flex-wrap justify-center gap-2">
                <div className="inline-flex rounded-full bg-white/20 px-4 py-1.5 text-primary-foreground text-sm">
                  Secure access
                </div>
                <div className="inline-flex rounded-full bg-white/20 px-4 py-1.5 text-primary-foreground text-sm">
                  Role-based workflows
                </div>
                <div className="inline-flex rounded-full bg-white/20 px-4 py-1.5 text-primary-foreground text-sm">
                  Reports & analytics
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
