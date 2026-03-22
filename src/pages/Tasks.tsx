import { useState } from "react";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/layout/AppLayout";
import { tasks, TaskStatus, TaskPriority } from "@/data/mockData";
import { CheckCircle2, Circle, Clock, Eye, AlertTriangle, ArrowUp, ArrowRight, ArrowDown, Flame } from "lucide-react";

const statusConfig: Record<TaskStatus, { label: string; color: string; icon: typeof Circle }> = {
  "todo": { label: "To Do", color: "bg-muted text-muted-foreground border-border", icon: Circle },
  "in-progress": { label: "In Progress", color: "bg-blue-500/10 text-blue-600 border-blue-500/20", icon: Clock },
  "review": { label: "In Review", color: "bg-amber-500/10 text-amber-600 border-amber-500/20", icon: Eye },
  "done": { label: "Done", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20", icon: CheckCircle2 },
};

const priorityConfig: Record<TaskPriority, { label: string; color: string; icon: typeof ArrowUp }> = {
  low: { label: "Low", color: "text-muted-foreground", icon: ArrowDown },
  medium: { label: "Medium", color: "text-blue-500", icon: ArrowRight },
  high: { label: "High", color: "text-amber-500", icon: ArrowUp },
  urgent: { label: "Urgent", color: "text-red-500", icon: Flame },
};

export default function Tasks() {
  const [filterStatus, setFilterStatus] = useState<TaskStatus | "all">("all");
  const filtered = filterStatus === "all" ? tasks : tasks.filter((t) => t.status === filterStatus);

  const counts = {
    all: tasks.length,
    todo: tasks.filter((t) => t.status === "todo").length,
    "in-progress": tasks.filter((t) => t.status === "in-progress").length,
    review: tasks.filter((t) => t.status === "review").length,
    done: tasks.filter((t) => t.status === "done").length,
  };

  return (
    <AppLayout title="Tasks" subtitle={`${tasks.length} total tasks`}>
      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {(["all", "todo", "in-progress", "review", "done"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-3.5 py-1.5 rounded-lg text-[12px] font-medium transition-colors border ${
              filterStatus === s
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground border-border hover:bg-accent"
            }`}
          >
            {s === "all" ? "All" : statusConfig[s].label}
            <span className="ml-1.5 tabular-nums">{counts[s]}</span>
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="sphere-card overflow-hidden">
        <div className="px-5 py-3.5 border-b bg-accent/50">
          <h2 className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Task Board</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Task</th>
              <th className="text-left py-3 px-5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Assignee</th>
              <th className="text-left py-3 px-5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Priority</th>
              <th className="text-left py-3 px-5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="text-left py-3 px-5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Category</th>
              <th className="text-left py-3 px-5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((task, i) => {
              const sCfg = statusConfig[task.status];
              const pCfg = priorityConfig[task.priority];
              const overdue = new Date(task.dueDate) < new Date() && task.status !== "done";
              return (
                <motion.tr
                  key={task.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b last:border-b-0 hover:bg-accent/30 transition-colors"
                >
                  <td className="py-3 px-5">
                    <p className="text-[13px] font-medium text-foreground">{task.title}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">{task.description}</p>
                  </td>
                  <td className="py-3 px-5 text-[13px] text-muted-foreground">{task.assigneeName}</td>
                  <td className="py-3 px-5">
                    <span className={`inline-flex items-center gap-1 text-[12px] font-medium ${pCfg.color}`}>
                      <pCfg.icon size={13} />
                      {pCfg.label}
                    </span>
                  </td>
                  <td className="py-3 px-5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${sCfg.color}`}>
                      <sCfg.icon size={12} />
                      {sCfg.label}
                    </span>
                  </td>
                  <td className="py-3 px-5">
                    <span className="text-[12px] px-2 py-0.5 rounded bg-accent text-muted-foreground">{task.category}</span>
                  </td>
                  <td className={`py-3 px-5 text-[13px] font-mono tabular-nums ${overdue ? "text-red-500 font-semibold" : "text-foreground"}`}>
                    {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    {overdue && <AlertTriangle size={12} className="inline ml-1" />}
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
