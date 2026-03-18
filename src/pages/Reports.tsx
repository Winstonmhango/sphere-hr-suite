import { AppLayout } from "@/components/layout/AppLayout";
import { employees, departmentStats } from "@/data/mockData";
import { motion } from "framer-motion";

export default function Reports() {
  const byDept = departmentStats.map((d) => ({
    ...d,
    avgSalary: Math.round(
      employees
        .filter((e) => e.department === d.name)
        .reduce((sum, e) => sum + e.salary, 0) /
        Math.max(employees.filter((e) => e.department === d.name).length, 1)
    ),
  }));

  const statusCounts = {
    active: employees.filter((e) => e.status === "active").length,
    "on-leave": employees.filter((e) => e.status === "on-leave").length,
    probation: employees.filter((e) => e.status === "probation").length,
    inactive: employees.filter((e) => e.status === "inactive").length,
  };

  return (
    <AppLayout title="Reports" subtitle="Workforce analytics">
      <div className="grid grid-cols-2 gap-4">
        {/* Department Salary Report */}
        <div className="sphere-card">
          <div className="px-5 py-4 border-b">
            <h2 className="text-[14px] font-semibold text-foreground tracking-tight-ui">Salary by Department</h2>
          </div>
          <div className="p-5 space-y-3">
            {byDept.map((dept, i) => (
              <motion.div
                key={dept.name}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-[13px] text-foreground w-24">{dept.name}</span>
                  <div className="flex-1 h-2 rounded-full bg-accent overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary/50"
                      style={{ width: `${(dept.avgSalary / 150000) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="text-[12px] font-mono text-muted-foreground tabular-nums ml-3">
                  ${dept.avgSalary.toLocaleString()}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Status Distribution */}
        <div className="sphere-card">
          <div className="px-5 py-4 border-b">
            <h2 className="text-[14px] font-semibold text-foreground tracking-tight-ui">Employee Status</h2>
          </div>
          <div className="p-5 space-y-4">
            {Object.entries(statusCounts).map(([status, count], i) => (
              <motion.div
                key={status}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[13px] text-foreground capitalize">{status.replace("-", " ")}</span>
                  <span className="text-[12px] font-mono text-muted-foreground tabular-nums">{count}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-accent overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(count / employees.length) * 100}%` }}
                    transition={{ delay: i * 0.08 + 0.2, duration: 0.5 }}
                    className={`h-full rounded-full ${
                      status === "active" ? "bg-emerald-500" :
                      status === "on-leave" ? "bg-amber-400" :
                      status === "probation" ? "bg-violet-500" :
                      "bg-slate-300"
                    }`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Budget Overview */}
        <div className="sphere-card col-span-2">
          <div className="px-5 py-4 border-b">
            <h2 className="text-[14px] font-semibold text-foreground tracking-tight-ui">Department Budget Overview</h2>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b bg-accent/50">
                <th className="text-left py-3 px-5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Department</th>
                <th className="text-right py-3 px-5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Headcount</th>
                <th className="text-right py-3 px-5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Budget</th>
                <th className="text-right py-3 px-5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Per Head</th>
                <th className="text-right py-3 px-5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Utilization</th>
              </tr>
            </thead>
            <tbody>
              {departmentStats.map((dept) => (
                <tr key={dept.name} className="border-b last:border-b-0 hover:bg-accent/30 transition-colors">
                  <td className="py-3 px-5 text-[13px] font-medium text-foreground">{dept.name}</td>
                  <td className="py-3 px-5 text-right text-[13px] font-mono text-foreground tabular-nums">{dept.headcount}</td>
                  <td className="py-3 px-5 text-right text-[13px] font-mono text-foreground tabular-nums">
                    ${(dept.budget / 1000000).toFixed(1)}M
                  </td>
                  <td className="py-3 px-5 text-right text-[12px] font-mono text-muted-foreground tabular-nums">
                    ${Math.round(dept.budget / dept.headcount).toLocaleString()}
                  </td>
                  <td className="py-3 px-5 text-right text-[13px] font-mono text-foreground tabular-nums">{dept.utilization}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
