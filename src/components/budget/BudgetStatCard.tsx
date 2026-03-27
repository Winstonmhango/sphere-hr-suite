import { LucideIcon, TrendingUp, TrendingDown, Minus, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface BudgetStatCardProps {
  label: string;
  value: string;
  budgeted: string;
  actual: string;
  variance: number;
  varianceType: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  trend: "up" | "down" | "stable";
}

export function BudgetStatCard({
  label,
  value,
  budgeted,
  actual,
  variance,
  varianceType,
  icon: Icon,
  trend,
}: BudgetStatCardProps) {
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

  const getVarianceColor = () => {
    switch (varianceType) {
      case "positive":
        return "text-green-600";
      case "negative":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getVarianceIcon = () => {
    if (Math.abs(variance) > 20) {
      return <AlertTriangle size={12} className="text-amber-500" />;
    }
    return null;
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
      <div className="space-y-1 mt-2">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Budgeted:</span>
          <span className="font-medium">{budgeted}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Actual:</span>
          <span className="font-medium">{actual}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Variance:</span>
          <div className={cn("flex items-center gap-1 font-medium", getVarianceColor())}>
            {getVarianceIcon()}
            <span>{variance > 0 ? "+" : ""}{variance}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
