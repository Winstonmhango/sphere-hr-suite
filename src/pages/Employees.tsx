import { useState } from "react";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/layout/AppLayout";
import { employees as initialEmployees, Employee } from "@/data/mockData";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AddEmployeeModal } from "@/components/employees/AddEmployeeModal";

export default function Employees() {
  const [employeeList, setEmployeeList] = useState<Employee[]>(initialEmployees);
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState<string>("all");
  const [modalOpen, setModalOpen] = useState(false);

  const departments = ["all", ...new Set(employeeList.map((e) => e.department))];

  const filtered = employeeList.filter((e) => {
    const matchSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.role.toLowerCase().includes(search.toLowerCase()) ||
      e.id.toLowerCase().includes(search.toLowerCase());
    const matchDept = filterDept === "all" || e.department === filterDept;
    return matchSearch && matchDept;
  });

  return (
    <AppLayout title="Employee Directory" subtitle={`${employeeList.length} employees`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
            <Input
              placeholder="Search employees..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 w-[260px] pl-8 text-[13px] bg-card"
            />
          </div>
          {/* Department Segmented Control */}
          <div className="flex items-center rounded-lg border bg-card p-0.5">
            {departments.slice(0, 5).map((dept) => (
              <button
                key={dept}
                onClick={() => setFilterDept(dept)}
                className={`px-2.5 py-1 rounded-md text-[12px] transition-colors ${
                  filterDept === dept
                    ? "bg-accent text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {dept === "all" ? "All" : dept}
              </button>
            ))}
          </div>
        </div>
        <Button size="sm" className="h-8 text-[13px] gap-1.5" onClick={() => setModalOpen(true)}>
          <Plus size={14} />
          Add Employee
        </Button>
      </div>

      {/* Table */}
      <div className="sphere-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-accent/50">
              <th className="text-left py-3 px-5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Employee</th>
              <th className="text-left py-3 px-5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">ID</th>
              <th className="text-left py-3 px-5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Department</th>
              <th className="text-left py-3 px-5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="text-right py-3 px-5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Salary</th>
              <th className="text-left py-3 px-5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Hire Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((emp, i) => (
              <motion.tr
                key={emp.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03, duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="border-b last:border-b-0 hover:bg-accent/30 transition-colors cursor-pointer group"
              >
                <td className="py-3.5 px-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-[11px] font-semibold text-primary">
                        {emp.name.split(" ").map((n) => n[0]).join("")}
                      </span>
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-foreground">{emp.name}</p>
                      <p className="text-[11px] text-muted-foreground">{emp.role}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-5 text-[12px] font-mono text-muted-foreground">{emp.id}</td>
                <td className="py-3.5 px-5 text-[13px] text-muted-foreground">{emp.department}</td>
                <td className="py-3.5 px-5">
                  <StatusBadge status={emp.status} />
                </td>
                <td className="py-3.5 px-5 text-right text-[13px] font-mono text-foreground tabular-nums">
                  ${emp.salary.toLocaleString()}
                </td>
                <td className="py-3.5 px-5 text-[12px] text-muted-foreground tabular-nums">
                  {new Date(emp.hireDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-[13px] text-muted-foreground">No employees found</p>
          </div>
        )}
      </div>

      <AddEmployeeModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSave={(emp) => {
          const newEmp: Employee = { ...emp, id: `EMP-${Date.now()}` };
          setEmployeeList((prev) => [...prev, newEmp]);
        }}
      />
    </AppLayout>
  );
}
