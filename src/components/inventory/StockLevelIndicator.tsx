import { cn } from "@/lib/utils";

interface StockLevelIndicatorProps {
  currentStock: number;
  minStock: number;
  maxStock: number;
  reorderPoint?: number;
  size?: "sm" | "md" | "lg";
  showLabels?: boolean;
}

export function StockLevelIndicator({
  currentStock,
  minStock,
  maxStock,
  reorderPoint,
  size = "md",
  showLabels = false
}: StockLevelIndicatorProps) {
  const percentage = (currentStock / maxStock) * 100;
  const isLowStock = currentStock <= minStock;
  const isReorderPoint = reorderPoint && currentStock <= reorderPoint;
  
  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "h-1.5";
      case "lg":
        return "h-3";
      default:
        return "h-2";
    }
  };

  const getStatusColor = () => {
    if (isLowStock) return "bg-red-500";
    if (isReorderPoint) return "bg-amber-500";
    if (percentage < 30) return "bg-orange-500";
    if (percentage < 60) return "bg-blue-500";
    return "bg-emerald-500";
  };

  const getStatusText = () => {
    if (isLowStock) return "Low Stock";
    if (isReorderPoint) return "Reorder Point";
    if (percentage < 30) return "Low";
    if (percentage < 60) return "Medium";
    return "Good";
  };

  return (
    <div className="space-y-1">
      {showLabels && (
        <div className="flex justify-between items-center text-[11px]">
          <span className="text-muted-foreground">Stock Level</span>
          <span className={cn(
            "font-medium",
            isLowStock ? "text-red-600" :
            isReorderPoint ? "text-amber-600" :
            "text-muted-foreground"
          )}>
            {getStatusText()}
          </span>
        </div>
      )}
      <div className="relative">
        <div className={cn(
          "w-full rounded-full bg-muted overflow-hidden",
          getSizeClasses()
        )}>
          <div
            className={cn(
              "h-full rounded-full transition-all duration-300",
              getStatusColor()
            )}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        {reorderPoint && (
          <div
            className="absolute top-0 w-0.5 h-full bg-amber-400/50"
            style={{ left: `${(reorderPoint / maxStock) * 100}%` }}
          />
        )}
      </div>
      {showLabels && (
        <div className="flex justify-between text-[10px] text-muted-foreground tabular-nums">
          <span>{currentStock}</span>
          <span>{maxStock}</span>
        </div>
      )}
    </div>
  );
}
