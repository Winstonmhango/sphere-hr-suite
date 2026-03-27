import { Calendar, DollarSign, TrendingUp, TrendingDown, AlertTriangle, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BudgetCardProps {
  budget: {
    id: string;
    name: string;
    department: string;
    category: string;
    budgetedAmount: number;
    actualAmount: number;
    remainingAmount: number;
    period: string;
    startDate: string;
    endDate: string;
    status: "active" | "completed" | "exceeded" | "pending";
    variance: number;
  };
}

export function BudgetCard({ budget }: BudgetCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Math.abs(amount));
  };

  const getVarianceColor = () => {
    if (budget.variance > 10) return "text-red-600";
    if (budget.variance > 5) return "text-amber-600";
    return "text-green-600";
  };

  const getStatusColor = () => {
    switch (budget.status) {
      case "active":
        return "bg-green-100 text-green-700 border-green-200";
      case "completed":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "exceeded":
        return "bg-red-100 text-red-700 border-red-200";
      case "pending":
        return "bg-amber-100 text-amber-700 border-amber-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getProgressColor = () => {
    const percentageUsed = (budget.actualAmount / budget.budgetedAmount) * 100;
    if (percentageUsed >= 100) return "bg-red-500";
    if (percentageUsed >= 80) return "bg-amber-500";
    return "bg-green-500";
  };

  const percentageUsed = (budget.actualAmount / budget.budgetedAmount) * 100;

  return (
    <div className="sphere-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
            <DollarSign size={16} className="text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">{budget.name}</h3>
            <p className="text-xs text-muted-foreground">{budget.department}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={cn("text-xs", getStatusColor())}>
            {budget.status}
          </Badge>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <MoreHorizontal size={14} />
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {/* Budget Amounts */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div>
            <p className="text-muted-foreground">Budgeted</p>
            <p className="font-semibold text-foreground tabular-nums">
              {formatCurrency(budget.budgetedAmount)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Actual</p>
            <p className="font-semibold text-foreground tabular-nums">
              {formatCurrency(budget.actualAmount)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Remaining</p>
            <p className={cn("font-semibold tabular-nums", 
              budget.remainingAmount < 0 ? "text-red-600" : "text-green-600"
            )}>
              {formatCurrency(budget.remainingAmount)}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">Usage</span>
            <span className="font-medium">{percentageUsed.toFixed(1)}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all", getProgressColor())}
              style={{ width: `${Math.min(percentageUsed, 100)}%` }}
            />
          </div>
        </div>

        {/* Variance and Period */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {budget.category}
            </Badge>
            <div className="flex items-center gap-1 text-xs">
              <Calendar size={12} className="text-muted-foreground" />
              <span className="text-muted-foreground">{budget.period}</span>
            </div>
          </div>
          <div className={cn("flex items-center gap-1 text-xs font-medium", getVarianceColor())}>
            {budget.variance > 0 ? (
              <TrendingUp size={12} />
            ) : budget.variance < 0 ? (
              <TrendingDown size={12} />
            ) : null}
            <span>{Math.abs(budget.variance).toFixed(1)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
