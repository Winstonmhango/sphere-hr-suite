import { ChevronRight, ChevronDown, Edit, Trash2, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AccountCardProps {
  account: {
    id: string;
    code: string;
    name: string;
    type: "balance-sheet" | "income-statement";
    category: string;
    balance: number;
    description?: string;
  };
  level: number;
  isExpanded: boolean;
  hasSubAccounts: boolean;
  onToggleExpand: () => void;
}

export function AccountCard({
  account,
  level,
  isExpanded,
  hasSubAccounts,
  onToggleExpand,
}: AccountCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Math.abs(amount));
  };

  const getTypeColor = () => {
    switch (account.type) {
      case "balance-sheet":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "income-statement":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getBalanceColor = () => {
    if (account.balance > 0) return "text-green-600";
    if (account.balance < 0) return "text-red-600";
    return "text-gray-600";
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors",
        level > 0 && "ml-6"
      )}
      style={{ marginLeft: level * 24 }}
    >
      <div className="flex items-center gap-3">
        {hasSubAccounts && (
          <button
            onClick={onToggleExpand}
            className="flex items-center justify-center w-5 h-5 rounded hover:bg-accent transition-colors"
          >
            {isExpanded ? (
              <ChevronDown size={14} className="text-muted-foreground" />
            ) : (
              <ChevronRight size={14} className="text-muted-foreground" />
            )}
          </button>
        )}
        
        {!hasSubAccounts && (
          <div className="w-5 h-5" />
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-mono text-muted-foreground">
              {account.code}
            </span>
            <p className="text-sm font-medium text-foreground truncate">
              {account.name}
            </p>
            <Badge className={cn("text-xs", getTypeColor())}>
              {account.category}
            </Badge>
          </div>
          
          {account.description && (
            <p className="text-xs text-muted-foreground truncate">
              {account.description}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className={cn("text-sm font-semibold tabular-nums", getBalanceColor())}>
            {account.balance < 0 ? "-" : ""}
            {formatCurrency(account.balance)}
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <Eye size={12} />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <Edit size={12} />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive">
            <Trash2 size={12} />
          </Button>
        </div>
      </div>
    </div>
  );
}
