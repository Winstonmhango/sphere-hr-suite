import { Calendar, Tag, CheckCircle, Clock, ArrowUp, ArrowDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TransactionCardProps {
  transaction: {
    id: string;
    date: string;
    description: string;
    category: string;
    debit: number;
    credit: number;
    account: string;
    status: "completed" | "pending" | "failed";
    reference: string;
  };
}

export function TransactionCard({ transaction }: TransactionCardProps) {
  const getStatusColor = () => {
    switch (transaction.status) {
      case "completed":
        return "bg-green-100 text-green-700 border-green-200";
      case "pending":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "failed":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = () => {
    switch (transaction.status) {
      case "completed":
        return <CheckCircle size={12} />;
      case "pending":
        return <Clock size={12} />;
      case "failed":
        return <ArrowDown size={12} />;
      default:
        return null;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted">
          {transaction.debit > 0 ? (
            <ArrowUp size={16} className="text-red-500" />
          ) : (
            <ArrowDown size={16} className="text-green-500" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm font-medium text-foreground truncate">
              {transaction.description}
            </p>
            <Badge variant="outline" className="text-xs">
              {transaction.category}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar size={12} />
              <span>{transaction.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Tag size={12} />
              <span>{transaction.account}</span>
            </div>
            <span className="font-mono">{transaction.reference}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className={cn(
            "text-sm font-semibold tabular-nums",
            transaction.debit > 0 ? "text-red-600" : "text-green-600"
          )}>
            {transaction.debit > 0 ? "-" : "+"}
            {formatCurrency(transaction.debit || transaction.credit)}
          </div>
          <Badge className={cn("text-xs", getStatusColor())}>
            <span className="flex items-center gap-1">
              {getStatusIcon()}
              {transaction.status}
            </span>
          </Badge>
        </div>
      </div>
    </div>
  );
}
