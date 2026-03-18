import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { ActionQueue } from "@/components/dashboard/ActionQueue";
import { DepartmentOverview } from "@/components/dashboard/DepartmentOverview";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { Users, UserCheck, CalendarDays, TrendingUp } from "lucide-react";

export default function Dashboard() {
  return (
    <AppLayout title="System Overview" subtitle="March 18, 2026">
      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Employees"
          value="142"
          change="+3 this month"
          changeType="positive"
          icon={Users}
        />
        <StatCard
          label="Active"
          value="136"
          change="95.8% of total"
          changeType="neutral"
          icon={UserCheck}
        />
        <StatCard
          label="On Leave"
          value="4"
          change="2 returning this week"
          changeType="neutral"
          icon={CalendarDays}
        />
        <StatCard
          label="Retention"
          value="98.2%"
          change="+0.3% vs last quarter"
          changeType="positive"
          icon={TrendingUp}
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-7 space-y-4">
          <ActionQueue />
          <RecentActivity />
        </div>
        <div className="col-span-5 space-y-4">
          <DepartmentOverview />
          
          {/* Quick Stats */}
          <div className="sphere-card p-5">
            <h2 className="text-[14px] font-semibold text-foreground tracking-tight-ui mb-4">Headcount Trend</h2>
            <div className="space-y-3">
              {[
                { month: "Jan", value: 138 },
                { month: "Feb", value: 140 },
                { month: "Mar", value: 142 },
              ].map((item) => (
                <div key={item.month} className="flex items-center gap-3">
                  <span className="text-[12px] text-muted-foreground w-8">{item.month}</span>
                  <div className="flex-1 h-2 rounded-full bg-accent overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary/60"
                      style={{ width: `${(item.value / 150) * 100}%` }}
                    />
                  </div>
                  <span className="text-[12px] font-mono text-muted-foreground tabular-nums w-6 text-right">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
