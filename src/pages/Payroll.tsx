import { motion } from "framer-motion";
import { AppLayout } from "@/components/layout/AppLayout";
import { employees } from "@/data/mockData";

export default function Payroll() {
  const activeEmployees = employees.filter((e) => e.status !== "inactive");
  const totalPayroll = activeEmployees.reduce((sum, e) => sum + e.salary, 0);
  const avgSalary = Math.round(totalPayroll / activeEmployees.length);

  return (
    <AppLayout title="Payroll" subtitle="March 2026 cycle">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="sphere-card p-5">
          <p className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider">Monthly Payroll</p>
          <p className="text-[24px] font-semibold text-foreground mt-1 tracking-tight-ui tabular-nums font-mono">
            ${(totalPayroll / 12).toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
        </div>
        <div className="sphere-card p-5">
          <p className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider">Avg. Salary</p>
          <p className="text-[24px] font-semibold text-foreground mt-1 tracking-tight-ui tabular-nums font-mono">
            ${avgSalary.toLocaleString()}
          </p>
        </div>
        <div className="sphere-card p-5">
          <p className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider">Active Payees</p>
          <p className="text-[24px] font-semibold text-foreground mt-1 tracking-tight-ui tabular-nums">
            {activeEmployees.length}
          </p>
        </div>
      </div>

      {/* Payroll Table */}
      <div className="sphere-card overflow-hidden">
        <div className="px-5 py-3.5 border-b bg-accent/50">
          <h2 className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Payroll Breakdown</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Employee</th>
              <th className="text-left py-3 px-5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Department</th>
              <th className="text-right py-3 px-5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Annual</th>
              <th className="text-right py-3 px-5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Monthly</th>
              <th className="text-right py-3 px-5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Tax (Est.)</th>
              <th className="text-right py-3 px-5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Net (Est.)</th>
            </tr>
          </thead>
          <tbody>
            {activeEmployees.map((emp, i) => {
              const monthly = Math.round(emp.salary / 12);
              const tax = Math.round(monthly * 0.28);
              const net = monthly - tax;
              return (
                <motion.tr
                  key={emp.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b last:border-b-0 hover:bg-accent/30 transition-colors"
                >
                  <td className="py-3 px-5 text-[13px] font-medium text-foreground">{emp.name}</td>
                  <td className="py-3 px-5 text-[13px] text-muted-foreground">{emp.department}</td>
                  <td className="py-3 px-5 text-right text-[13px] font-mono text-foreground tabular-nums">
                    ${emp.salary.toLocaleString()}
                  </td>
                  <td className="py-3 px-5 text-right text-[13px] font-mono text-foreground tabular-nums">
                    ${monthly.toLocaleString()}
                  </td>
                  <td className="py-3 px-5 text-right text-[12px] font-mono text-muted-foreground tabular-nums">
                    -${tax.toLocaleString()}
                  </td>
                  <td className="py-3 px-5 text-right text-[13px] font-mono text-foreground tabular-nums font-medium">
                    ${net.toLocaleString()}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}
