import { useState } from "react";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/layout/AppLayout";
import { employees, employeeSalaries, EmployeeSalary, SalaryComponent } from "@/data/mockData";
import { ChevronDown, ChevronRight, TrendingUp, TrendingDown, Gift, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SalaryComponentModal } from "@/components/salary/SalaryComponentModal";
import { AddEmployeeSalaryModal } from "@/components/salary/AddEmployeeSalaryModal";

function calcSalaryBreakdown(salary: EmployeeSalary) {
  const monthly = salary.baseSalary / 12;
  let earnings = 0;
  let deductions = 0;
  let bonuses = 0;

  salary.components.forEach((c) => {
    const amt = c.isPercentage ? (monthly * c.amount) / 100 : c.amount;
    if (c.type === "earning") earnings += amt;
    else if (c.type === "deduction") deductions += amt;
    else bonuses += amt;
  });

  return { monthly, earnings, deductions, bonuses, gross: monthly + earnings + bonuses, net: monthly + earnings + bonuses - deductions };
}

function ComponentRow({ comp, monthly }: { comp: SalaryComponent; monthly: number }) {
  const amt = comp.isPercentage ? (monthly * comp.amount) / 100 : comp.amount;
  const typeIcon = comp.type === "earning" ? <TrendingUp size={12} className="text-emerald-500" /> : comp.type === "deduction" ? <TrendingDown size={12} className="text-red-500" /> : <Gift size={12} className="text-amber-500" />;
  const typeColor = comp.type === "earning" ? "text-emerald-600" : comp.type === "deduction" ? "text-red-600" : "text-amber-600";

  return (
    <tr className="border-b last:border-b-0 hover:bg-accent/20 transition-colors">
      <td className="py-2 px-5 pl-12 text-[12px] text-muted-foreground flex items-center gap-2">{typeIcon}{comp.name}</td>
      <td className="py-2 px-5 text-[11px] text-muted-foreground capitalize">{comp.type}</td>
      <td className="py-2 px-5 text-right text-[12px] font-mono text-muted-foreground tabular-nums">
        {comp.isPercentage ? `${comp.amount}%` : `$${comp.amount.toLocaleString()}`}
      </td>
      <td className={`py-2 px-5 text-right text-[12px] font-mono tabular-nums font-medium ${typeColor}`}>
        {comp.type === "deduction" ? "-" : "+"}${Math.round(amt).toLocaleString()}
      </td>
    </tr>
  );
}

export default function Salary() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [componentModalOpen, setComponentModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<{ id: string; name: string } | null>(null);

  const totalAnnual = employeeSalaries.reduce((s, es) => s + es.baseSalary, 0);
  const activeCount = employeeSalaries.filter((es) => {
    const emp = employees.find((e) => e.id === es.employeeId);
    return emp && emp.status !== "inactive";
  }).length;

  return (
    <AppLayout title="Employee Salary" subtitle="Salary structure & compensation details">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="sphere-card p-5">
          <p className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider">Total Annual Payroll</p>
          <p className="text-[24px] font-semibold text-foreground mt-1 tabular-nums font-mono">${totalAnnual.toLocaleString()}</p>
        </div>
        <div className="sphere-card p-5">
          <p className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider">Average Base Salary</p>
          <p className="text-[24px] font-semibold text-foreground mt-1 tabular-nums font-mono">${Math.round(totalAnnual / employeeSalaries.length).toLocaleString()}</p>
        </div>
        <div className="sphere-card p-5">
          <p className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider">Active Employees</p>
          <p className="text-[24px] font-semibold text-foreground mt-1 tabular-nums">{activeCount}</p>
        </div>
      </div>

      {/* Salary Table */}
      <div className="sphere-card overflow-hidden">
        <div className="px-5 py-3.5 border-b bg-accent/50">
          <h2 className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Salary Breakdown by Employee</h2>
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
            {employeeSalaries.map((es, i) => {
              const emp = employees.find((e) => e.id === es.employeeId);
              if (!emp) return null;
              const bd = calcSalaryBreakdown(es);
              const isExpanded = expanded === es.employeeId;

              return (
                <motion.tbody key={es.employeeId} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}>
                  <tr
                    className="border-b hover:bg-accent/30 transition-colors cursor-pointer"
                    onClick={() => setExpanded(isExpanded ? null : es.employeeId)}
                  >
                    <td className="py-3 px-5 text-[13px] font-medium text-foreground flex items-center gap-2">
                      {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      {emp.name}
                    </td>
                    <td className="py-3 px-5 text-[13px] text-muted-foreground">{emp.department}</td>
                    <td className="py-3 px-5 text-right text-[13px] font-mono text-foreground tabular-nums">${es.baseSalary.toLocaleString()}</td>
                    <td className="py-3 px-5 text-right text-[13px] font-mono text-foreground tabular-nums">${Math.round(bd.gross).toLocaleString()}</td>
                    <td className="py-3 px-5 text-right text-[12px] font-mono text-red-500 tabular-nums">-${Math.round(bd.deductions).toLocaleString()}</td>
                    <td className="py-3 px-5 text-right text-[13px] font-mono text-foreground tabular-nums font-semibold">${Math.round(bd.net).toLocaleString()}</td>
                  </tr>
                  {isExpanded && (
                    <>
                      <tr className="bg-accent/20">
                        <td colSpan={2} className="py-2 px-5 pl-12 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Component</td>
                        <td className="py-2 px-5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Type</td>
                        <td className="py-2 px-5 text-right text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Rate</td>
                        <td className="py-2 px-5 text-right text-[11px] font-semibold text-muted-foreground uppercase tracking-wider" colSpan={2}>Amount</td>
                      </tr>
                      {es.components.map((comp) => (
                        <ComponentRow key={comp.id} comp={comp} monthly={bd.monthly} />
                      ))}
                      <tr className="bg-accent/30 border-b">
                        <td colSpan={4} className="py-2 px-5 pl-12 text-[12px] font-semibold text-foreground">Monthly Net Pay</td>
                        <td className="py-2 px-5 text-right text-[13px] font-mono font-bold text-foreground tabular-nums" colSpan={2}>${Math.round(bd.net).toLocaleString()}</td>
                      </tr>
                      <tr className="border-b">
                        <td colSpan={6} className="py-2 px-5 pl-12">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[12px] text-primary h-7 gap-1"
                            onClick={(e) => { e.stopPropagation(); setSelectedEmployee({ id: es.employeeId, name: emp.name }); setComponentModalOpen(true); }}
                          >
                            <Plus size={12} /> Add Component
                          </Button>
                        </td>
                      </tr>
                    </>
                  )}
                </motion.tbody>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedEmployee && (
        <SalaryComponentModal
          open={componentModalOpen}
          onOpenChange={setComponentModalOpen}
          employeeName={selectedEmployee.name}
          onSave={(comp) => {
            console.log("New component for", selectedEmployee.id, comp);
          }}
        />
      )}
    </AppLayout>
  );
}
