import { motion } from "framer-motion";
import { departmentStats } from "@/data/mockData";

export function DepartmentOverview() {
  return (
    <div className="sphere-card">
      <div className="px-5 py-4 border-b">
        <h2 className="text-[14px] font-semibold text-foreground tracking-tight-ui">Departments</h2>
      </div>
      <div className="divide-y">
        {departmentStats.slice(0, 5).map((dept, i) => (
          <motion.div
            key={dept.name}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="px-5 py-3.5 flex items-center justify-between hover:bg-accent/50 transition-colors"
          >
            <div>
              <p className="text-[13px] font-medium text-foreground">{dept.name}</p>
              <p className="text-[11px] text-muted-foreground">{dept.headcount} employees</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-20 h-1.5 rounded-full bg-accent overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${dept.utilization}%` }}
                  transition={{ delay: i * 0.05 + 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full rounded-full bg-primary"
                />
              </div>
              <span className="text-[12px] font-mono text-muted-foreground tabular-nums w-8 text-right">
                {dept.utilization}%
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
