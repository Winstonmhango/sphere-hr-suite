import { motion } from "framer-motion";
import { AppLayout } from "@/components/layout/AppLayout";
import { departmentStats } from "@/data/mockData";
import { employees } from "@/data/mockData";

export default function Departments() {
  return (
    <AppLayout title="Departments" subtitle={`${departmentStats.length} departments`}>
      <div className="grid grid-cols-3 gap-4">
        {departmentStats.map((dept, i) => {
          const deptEmployees = employees.filter((e) => e.department === dept.name);
          return (
            <motion.div
              key={dept.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -2 }}
              className="sphere-card-hover p-5 cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-[15px] font-semibold text-foreground tracking-tight-ui">{dept.name}</h3>
                  <p className="text-[12px] text-muted-foreground mt-0.5">{dept.headcount} members</p>
                </div>
                <span className="text-[12px] font-mono text-muted-foreground tabular-nums">
                  ${(dept.budget / 1000000).toFixed(1)}M
                </span>
              </div>

              {/* Utilization Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] text-muted-foreground">Utilization</span>
                  <span className="text-[11px] font-mono text-muted-foreground tabular-nums">{dept.utilization}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-accent overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${dept.utilization}%` }}
                    transition={{ delay: i * 0.05 + 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full rounded-full bg-primary"
                  />
                </div>
              </div>

              {/* Team Avatars */}
              <div className="flex items-center">
                <div className="flex -space-x-2">
                  {deptEmployees.slice(0, 4).map((emp) => (
                    <div
                      key={emp.id}
                      className="w-6 h-6 rounded-full bg-primary/10 border-2 border-card flex items-center justify-center"
                    >
                      <span className="text-[8px] font-bold text-primary">
                        {emp.name.split(" ").map((n) => n[0]).join("")}
                      </span>
                    </div>
                  ))}
                </div>
                {deptEmployees.length > 4 && (
                  <span className="text-[11px] text-muted-foreground ml-2">
                    +{deptEmployees.length - 4}
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </AppLayout>
  );
}
