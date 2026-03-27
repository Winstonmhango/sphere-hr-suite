import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccountingStatCardProps {
  label: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  trend: "up" | "down" | "stable";
}

export function AccountingStatCard({
  label,
  value,
  change,
  changeType,
  icon: Icon,
  trend,
}: AccountingStatCardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp size={14} className="text-green-500" />;
      case "down":
        return <TrendingDown size={14} className="text-red-500" />;
      default:
        return <Minus size={14} className="text-gray-500" />;
    }
  };

  const getChangeColor = () => {
    switch (changeType) {
      case "positive":
        return "text-green-600";
      case "negative":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="sphere-card p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon size={16} className="text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-xs text-muted-foreground">{label}</p>
          {getTrendIcon()}
        </div>
      </div>
      <div className="text-xl font-bold text-foreground tabular-nums">{value}</div>
      <p className={cn("text-xs mt-1", getChangeColor())}>{change}</p>
    </div>
  );
}
