import { AppLayout } from "@/components/layout/AppLayout";

export default function SettingsPage() {
  return (
    <AppLayout title="Settings" subtitle="System configuration">
      <div className="max-w-2xl space-y-4">
        {[
          { title: "Organization", description: "Company name, logo, and branding settings" },
          { title: "Notifications", description: "Email and in-app notification preferences" },
          { title: "Integrations", description: "Connect payroll, Slack, and calendar tools" },
          { title: "Security", description: "Authentication, SSO, and access control" },
        ].map((section) => (
          <div key={section.title} className="sphere-card-hover p-5 cursor-pointer">
            <h3 className="text-[14px] font-semibold text-foreground tracking-tight-ui">{section.title}</h3>
            <p className="text-[13px] text-muted-foreground mt-1">{section.description}</p>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
