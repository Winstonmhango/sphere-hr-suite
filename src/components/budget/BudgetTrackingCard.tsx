import { TrendingUp, TrendingDown, AlertTriangle, Calendar, DollarSign, Target, Eye, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BudgetTrackingCardProps {
  budget: {
    id: string;
    budgetName: string;
    department: string;
    category: string;
    budgetedAmount: number;
    actualAmount: number;
    remainingAmount: number;
    spentPercentage: number;
    variance: number;
    varianceType: "favorable" | "unfavorable" | "neutral";
    period: string;
    lastUpdated: string;
    status: "on_track" | "over_budget" | "at_risk";
    transactions: number;
    monthlyTrend: Array<{
      month: string;
      budgeted: number;
      actual: number;
    }>;
  };
}

export function BudgetTrackingCard({ budget }: BudgetTrackingCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Math.abs(amount));
  };

  const getStatusColor = () => {
    switch (budget.status) {
      case "on_track":
        return "bg-green-100 text-green-700 border-green-200";
      case "over_budget":
        return "bg-red-100 text-red-700 border-red-200";
      case "at_risk":
        return "bg-amber-100 text-amber-700 border-amber-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getProgressColor = () => {
    if (budget.spentPercentage >= 100) return "bg-red-500";
    if (budget.spentPercentage >= 90) return "bg-amber-500";
    return "bg-green-500";
  };

  const getVarianceIcon = () => {
    if (budget.varianceType === "favorable") {
      return <TrendingDown size={14} className="text-green-500" />;
    } else if (budget.varianceType === "unfavorable") {
      return <TrendingUp size={14} className="text-red-500" />;
    }
    return null;
  };

  const getVarianceColor = () => {
    if (budget.varianceType === "favorable") return "text-green-600";
    if (budget.varianceType === "unfavorable") return "text-red-600";
    return "text-gray-600";
  };

  return (
    <div className="border rounded-lg bg-card p-4 hover:bg-accent/50 transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
            <Target size={16} className="text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">{budget.budgetName}</h3>
            <p className="text-xs text-muted-foreground">{budget.department}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={cn("text-xs", getStatusColor())}>
            {budget.status.replace('_', ' ')}
          </Badge>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <Eye size={12} />
          </Button>
        </div>
      </div>

      {/* Budget Summary */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <p className="text-xs text-muted-foreground">Budgeted</p>
          <p className="text-sm font-semibold text-foreground tabular-nums">
            {formatCurrency(budget.budgetedAmount)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Actual</p>
          <p className="text-sm font-semibold text-foreground tabular-nums">
            {formatCurrency(budget.actualAmount)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Remaining</p>
          <p className={cn(
            "text-sm font-semibold tabular-nums",
            budget.remainingAmount < 0 ? "text-red-600" : "text-green-600"
          )}>
            {formatCurrency(budget.remainingAmount)}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-muted-foreground">Spent</span>
          <span className="font-medium">{budget.spentPercentage.toFixed(1)}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all", getProgressColor())}
            style={{ width: `${Math.min(budget.spentPercentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Variance and Details */}
      <div className="flex items-center justify-between pt-3 border-t">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            {getVarianceIcon()}
            <span className={cn("text-xs font-medium", getVarianceColor())}>
              {budget.variance > 0 ? "+" : ""}{budget.variance.toFixed(1)}%
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar size={12} />
            <span>Updated {budget.lastUpdated}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <BarChart3 size={12} />
            <span>{budget.transactions} transactions</span>
          </div>
        </div>
        <Badge variant="outline" className="text-xs">
          {budget.category}
        </Badge>
      </div>

      {/* Monthly Trend */}
      <div className="mt-4 pt-3 border-t">
        <h4 className="text-xs font-semibold text-foreground mb-2">Monthly Trend</h4>
        <div className="flex items-center gap-2">
          {budget.monthlyTrend.map((month, index) => {
            const percentage = (month.actual / month.budgeted) * 100;
            return (
              <div key={month.month} className="flex-1 text-center">
                <div className="text-xs text-muted-foreground mb-1">{month.month}</div>
                <div className="w-full h-8 rounded bg-muted overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded transition-all",
                      percentage >= 100 ? "bg-red-500" : percentage >= 90 ? "bg-amber-500" : "bg-green-500"
                    )}
                    style={{ height: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
                <div className="text-xs font-medium mt-1">{percentage.toFixed(0)}%</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
