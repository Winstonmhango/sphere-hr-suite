import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
}

export function StatCard({ label, value, change, changeType = "neutral", icon: Icon }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -1 }}
      className="sphere-card p-5"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
          <p className="text-[28px] font-semibold text-foreground mt-1 tracking-tight-ui tabular-nums">{value}</p>
          {change && (
            <p className={`text-[12px] mt-1 font-medium ${
              changeType === "positive" ? "text-emerald-600" :
              changeType === "negative" ? "text-red-500" :
              "text-muted-foreground"
            }`}>
              {change}
            </p>
          )}
        </div>
        <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center">
          <Icon size={18} className="text-muted-foreground" />
        </div>
      </div>
    </motion.div>
  );
}
