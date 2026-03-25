import { motion } from "framer-motion";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface InventoryStatCardProps {
  label: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  trend?: "up" | "down" | "stable";
}

export function InventoryStatCard({ 
  label, 
  value, 
  change, 
  changeType = "neutral", 
  icon: Icon,
  trend = "stable"
}: InventoryStatCardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp size={14} className="text-emerald-600" />;
      case "down":
        return <TrendingDown size={14} className="text-red-500" />;
      default:
        return <Minus size={14} className="text-muted-foreground" />;
    }
  };

  return (
    <motion.div
      whileHover={{ y: -1 }}
      className="sphere-card p-5"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
          <p className="text-[28px] font-semibold text-foreground mt-1 tracking-tight-ui tabular-nums">{value}</p>
          {change && (
            <div className="flex items-center gap-1 mt-2">
              {getTrendIcon()}
              <p className={`text-[12px] font-medium ${
                changeType === "positive" ? "text-emerald-600" :
                changeType === "negative" ? "text-red-500" :
                "text-muted-foreground"
              }`}>
                {change}
              </p>
            </div>
          )}
        </div>
        <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center ml-3">
          <Icon size={20} className="text-muted-foreground" />
        </div>
      </div>
    </motion.div>
  );
}
