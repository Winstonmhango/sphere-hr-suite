import { motion } from "framer-motion";
import { leaveRequests } from "@/data/mockData";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Check, X } from "lucide-react";

export function ActionQueue() {
  const pending = leaveRequests.filter((r) => r.status === "pending");

  return (
    <div className="sphere-card">
      <div className="px-5 py-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <h2 className="text-[14px] font-semibold text-foreground tracking-tight-ui">Action Queue</h2>
          <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-md text-[11px] font-bold bg-primary text-primary-foreground">
            {pending.length}
          </span>
        </div>
        <span className="text-[12px] text-muted-foreground">Leave Requests</span>
      </div>
      <div className="divide-y">
        {pending.map((request, i) => (
          <motion.div
            key={request.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="px-5 py-3.5 flex items-center justify-between hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-[11px] font-semibold text-primary">
                  {request.employeeName.split(" ").map(n => n[0]).join("")}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-medium text-foreground truncate">{request.employeeName}</p>
                <p className="text-[11px] text-muted-foreground">
                  {request.type.charAt(0).toUpperCase() + request.type.slice(1)} · {request.days} day{request.days > 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <StatusBadge status="pending" />
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-emerald-50 text-emerald-600 transition-colors"
              >
                <Check size={14} />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-red-50 text-red-500 transition-colors"
              >
                <X size={14} />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
