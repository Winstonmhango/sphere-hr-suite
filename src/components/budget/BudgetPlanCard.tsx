import { Calendar, User, CheckCircle, Clock, Edit, Trash2, ChevronDown, ChevronRight, DollarSign, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BudgetPlanCardProps {
  plan: {
    id: string;
    name: string;
    department: string;
    category: string;
    totalAmount: number;
    allocatedAmount: number;
    status: "draft" | "pending_approval" | "approved" | "rejected";
    period: string;
    startDate: string;
    endDate: string;
    createdBy: string;
    createdAt: string;
    approvedBy?: string | null;
    approvedAt?: string | null;
    items: Array<{
      id: string;
      name: string;
      budgetedAmount: number;
      description: string;
    }>;
  };
  isSelected: boolean;
  onSelect: () => void;
}

export function BudgetPlanCard({ plan, isSelected, onSelect }: BudgetPlanCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getStatusColor = () => {
    switch (plan.status) {
      case "draft":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "pending_approval":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "approved":
        return "bg-green-100 text-green-700 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = () => {
    switch (plan.status) {
      case "draft":
        return <Edit size={12} />;
      case "pending_approval":
        return <Clock size={12} />;
      case "approved":
        return <CheckCircle size={12} />;
      case "rejected":
        return <Clock size={12} />;
      default:
        return null;
    }
  };

  const allocationPercentage = (plan.allocatedAmount / plan.totalAmount) * 100;

  return (
    <div className="border rounded-lg bg-card overflow-hidden">
      {/* Header */}
      <div
        className={cn(
          "flex items-center justify-between p-4 cursor-pointer hover:bg-accent/50 transition-colors",
          isSelected && "bg-accent"
        )}
        onClick={onSelect}
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {isSelected ? (
              <ChevronDown size={16} className="text-muted-foreground" />
            ) : (
              <ChevronRight size={16} className="text-muted-foreground" />
            )}
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
              <Target size={16} className="text-primary" />
            </div>
          </div>
          
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-mono text-muted-foreground">
                {plan.id}
              </span>
              <p className="text-sm font-medium text-foreground truncate">
                {plan.name}
              </p>
              <Badge className={cn("text-xs", getStatusColor())}>
                <span className="flex items-center gap-1">
                  {getStatusIcon()}
                  {plan.status.replace('_', ' ')}
                </span>
              </Badge>
            </div>
            
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <User size={12} />
                <span>{plan.department}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={12} />
                <span>{plan.period}</span>
              </div>
              <span className="font-semibold text-foreground">
                {formatCurrency(plan.allocatedAmount)} / {formatCurrency(plan.totalAmount)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <Edit size={12} />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive">
            <Trash2 size={12} />
          </Button>
        </div>
      </div>

      {/* Expanded Details */}
      {isSelected && (
        <div className="border-t bg-accent/30 p-4">
          <div className="space-y-4">
            {/* Plan Details */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Created by:</span>
                <span className="ml-2">{plan.createdBy}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Created at:</span>
                <span className="ml-2">{new Date(plan.createdAt).toLocaleDateString()}</span>
              </div>
              {plan.approvedBy && (
                <>
                  <div>
                    <span className="text-muted-foreground">Approved by:</span>
                    <span className="ml-2">{plan.approvedBy}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Approved at:</span>
                    <span className="ml-2">{new Date(plan.approvedAt).toLocaleDateString()}</span>
                  </div>
                </>
              )}
            </div>

            {/* Allocation Progress */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Allocation Progress</span>
                <span className="font-medium">{allocationPercentage.toFixed(1)}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    allocationPercentage >= 100 ? "bg-green-500" : "bg-blue-500"
                  )}
                  style={{ width: `${allocationPercentage}%` }}
                />
              </div>
            </div>

            {/* Budget Items */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">Budget Items</h4>
              <div className="space-y-2">
                {plan.items.map((item, index) => (
                  <div key={item.id} className="flex items-center justify-between p-2 rounded bg-background">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-6 h-6 rounded bg-muted">
                        <DollarSign size={12} className="text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {item.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-foreground tabular-nums">
                        {formatCurrency(item.budgetedAmount)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Items Total */}
              <div className="flex items-center justify-between p-2 rounded bg-muted mt-2">
                <div className="text-sm font-semibold text-foreground">Total Allocated</div>
                <div className="text-sm font-bold text-foreground tabular-nums">
                  {formatCurrency(plan.allocatedAmount)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
