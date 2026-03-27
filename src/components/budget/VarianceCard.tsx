import { TrendingUp, TrendingDown, AlertTriangle, Calendar, DollarSign, Target, ChevronDown, ChevronRight, Lightbulb, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface VarianceCardProps {
  variance: {
    id: string;
    budgetName: string;
    department: string;
    category: string;
    budgetedAmount: number;
    actualAmount: number;
    variance: number;
    variancePercentage: number;
    varianceType: "favorable" | "unfavorable" | "neutral";
    period: string;
    impact: "high" | "medium" | "low";
    trend: "improving" | "declining" | "stable";
    lastUpdated: string;
    reasons: string[];
    actions: string[];
  };
}

export function VarianceCard({ variance }: VarianceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Math.abs(amount));
  };

  const getVarianceColor = () => {
    if (variance.varianceType === "favorable") return "text-green-600";
    if (variance.varianceType === "unfavorable") return "text-red-600";
    return "text-gray-600";
  };

  const getVarianceIcon = () => {
    if (variance.varianceType === "favorable") {
      return <TrendingDown size={16} className="text-green-500" />;
    } else if (variance.varianceType === "unfavorable") {
      return <TrendingUp size={16} className="text-red-500" />;
    }
    return null;
  };

  const getImpactColor = () => {
    switch (variance.impact) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200";
      case "medium":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "low":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getTrendIcon = () => {
    switch (variance.trend) {
      case "improving":
        return <div className="w-2 h-2 bg-green-500 rounded-full" />;
      case "declining":
        return <div className="w-2 h-2 bg-red-500 rounded-full" />;
      default:
        return <div className="w-2 h-2 bg-gray-500 rounded-full" />;
    }
  };

  return (
    <div className="border rounded-lg bg-card overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-accent/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {isExpanded ? (
              <ChevronDown size={16} className="text-muted-foreground" />
            ) : (
              <ChevronRight size={16} className="text-muted-foreground" />
            )}
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
              {getVarianceIcon()}
            </div>
          </div>
          
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-mono text-muted-foreground">
                {variance.id}
              </span>
              <p className="text-sm font-medium text-foreground truncate">
                {variance.budgetName}
              </p>
              <Badge className={cn("text-xs", getImpactColor())}>
                {variance.impact} impact
              </Badge>
              <div className="flex items-center gap-1">
                {getTrendIcon()}
                <span className="text-xs text-muted-foreground">{variance.trend}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Target size={12} />
                <span>{variance.department}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={12} />
                <span>{variance.period}</span>
              </div>
              <div className={cn("flex items-center gap-1 font-medium", getVarianceColor())}>
                <DollarSign size={12} />
                <span>{variance.variance > 0 ? "+" : ""}{formatCurrency(variance.variance)}</span>
                <span>({variance.variancePercentage > 0 ? "+" : ""}{variance.variancePercentage.toFixed(1)}%)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge className={cn(
            "text-xs",
            variance.varianceType === "favorable" 
              ? "bg-green-100 text-green-700 border-green-200"
              : "bg-red-100 text-red-700 border-red-200"
          )}>
            {variance.varianceType}
          </Badge>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t bg-accent/30 p-4">
          <div className="space-y-4">
            {/* Budget Comparison */}
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Budgeted:</span>
                <span className="ml-2 font-medium">{formatCurrency(variance.budgetedAmount)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Actual:</span>
                <span className="ml-2 font-medium">{formatCurrency(variance.actualAmount)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Variance:</span>
                <span className={cn("ml-2 font-medium", getVarianceColor())}>
                  {variance.variance > 0 ? "+" : ""}{formatCurrency(variance.variance)}
                </span>
              </div>
            </div>

            {/* Reasons */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                <Lightbulb size={14} className="text-amber-500" />
                Variance Reasons
              </h4>
              <ul className="space-y-1">
                {variance.reasons.map((reason, index) => (
                  <li key={index} className="text-xs text-muted-foreground flex items-start gap-2">
                    <span className="w-1 h-1 bg-muted-foreground rounded-full mt-1 flex-shrink-0" />
                    {reason}
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommended Actions */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                <CheckCircle size={14} className="text-green-500" />
                Recommended Actions
              </h4>
              <ul className="space-y-1">
                {variance.actions.map((action, index) => (
                  <li key={index} className="text-xs text-muted-foreground flex items-start gap-2">
                    <span className="w-1 h-1 bg-muted-foreground rounded-full mt-1 flex-shrink-0" />
                    {action}
                  </li>
                ))}
              </ul>
            </div>

            {/* Last Updated */}
            <div className="text-xs text-muted-foreground pt-2 border-t">
              Last updated: {new Date(variance.lastUpdated).toLocaleDateString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
