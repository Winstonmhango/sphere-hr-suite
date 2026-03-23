import { useState } from "react";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/layout/AppLayout";
import { employees, employeeSalaries } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PayrollRunWizard } from "@/components/payroll/PayrollRunWizard";

function calcMonthlyBreakdown(employeeId: string) {
  const es = employeeSalaries.find((s) => s.employeeId === employeeId);
  if (!es) return { gross: 0, deductions: 0, net: 0, baseSalary: 0 };

  const monthly = es.baseSalary / 12;
  let earnings = 0;
  let deductions = 0;
  let bonuses = 0;

  es.components.forEach((c) => {
    const amt = c.isPercentage ? (monthly * c.amount) / 100 : c.amount;
    if (c.type === "earning") earnings += amt;
    else if (c.type === "deduction") deductions += amt;
    else bonuses += amt;
  });

  const gross = monthly + earnings + bonuses;
  return { gross, deductions, net: gross - deductions, baseSalary: es.baseSalary };
}

export default function Payroll() {
  const activeEmployees = employees.filter((e) => e.status !== "inactive");
  const breakdowns = activeEmployees.map((e) => ({ emp: e, bd: calcMonthlyBreakdown(e.id) }));
  const totalGross = breakdowns.reduce((s, b) => s + b.bd.gross, 0);
  const totalDeductions = breakdowns.reduce((s, b) => s + b.bd.deductions, 0);
  const totalNet = breakdowns.reduce((s, b) => s + b.bd.net, 0);

  return (
    <AppLayout title="Payroll" subtitle="March 2026 cycle">
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="sphere-card p-5">
          <p className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider">Gross Payroll</p>
          <p className="text-[24px] font-semibold text-foreground mt-1 tracking-tight-ui tabular-nums font-mono">
            ${Math.round(totalGross).toLocaleString()}
          </p>
        </div>
        <div className="sphere-card p-5">
          <p className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider">Total Deductions</p>
          <p className="text-[24px] font-semibold text-red-500 mt-1 tracking-tight-ui tabular-nums font-mono">
            -${Math.round(totalDeductions).toLocaleString()}
          </p>
        </div>
        <div className="sphere-card p-5">
          <p className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider">Net Payroll</p>
          <p className="text-[24px] font-semibold text-foreground mt-1 tracking-tight-ui tabular-nums font-mono">
            ${Math.round(totalNet).toLocaleString()}
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
              <th className="text-right py-3 px-5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Base (Annual)</th>
              <th className="text-right py-3 px-5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Monthly Gross</th>
              <th className="text-right py-3 px-5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Deductions</th>
              <th className="text-right py-3 px-5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Net Pay</th>
            </tr>
          </thead>
          <tbody>
            {breakdowns.map(({ emp, bd }, i) => (
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
                  ${bd.baseSalary.toLocaleString()}
                </td>
                <td className="py-3 px-5 text-right text-[13px] font-mono text-foreground tabular-nums">
                  ${Math.round(bd.gross).toLocaleString()}
                </td>
                <td className="py-3 px-5 text-right text-[12px] font-mono text-red-500 tabular-nums">
                  -${Math.round(bd.deductions).toLocaleString()}
                </td>
                <td className="py-3 px-5 text-right text-[13px] font-mono text-foreground tabular-nums font-semibold">
                  ${Math.round(bd.net).toLocaleString()}
                </td>
              </motion.tr>
            ))}
            {/* Totals row */}
            <tr className="bg-accent/50 font-semibold">
              <td className="py-3 px-5 text-[13px] text-foreground" colSpan={2}>Total</td>
              <td className="py-3 px-5 text-right text-[13px] font-mono text-foreground tabular-nums">—</td>
              <td className="py-3 px-5 text-right text-[13px] font-mono text-foreground tabular-nums">${Math.round(totalGross).toLocaleString()}</td>
              <td className="py-3 px-5 text-right text-[12px] font-mono text-red-500 tabular-nums">-${Math.round(totalDeductions).toLocaleString()}</td>
              <td className="py-3 px-5 text-right text-[13px] font-mono text-foreground tabular-nums">${Math.round(totalNet).toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <PayrollRunWizard open={wizardOpen} onOpenChange={setWizardOpen} />
    </AppLayout>
  );
}
