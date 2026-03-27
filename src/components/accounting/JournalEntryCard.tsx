import { Calendar, User, CheckCircle, Clock, Eye, Edit, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface JournalEntryCardProps {
  entry: {
    id: string;
    date: string;
    description: string;
    status: "posted" | "pending" | "draft";
    totalAmount: number;
    reference: string;
    lines: Array<{
      accountId: string;
      accountName: string;
      accountCode: string;
      debit: number;
      credit: number;
      description: string;
    }>;
    createdBy: string;
    createdAt: string;
    approvedBy?: string | null;
    approvedAt?: string | null;
  };
  isSelected: boolean;
  onSelect: () => void;
}

export function JournalEntryCard({ entry, isSelected, onSelect }: JournalEntryCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getStatusColor = () => {
    switch (entry.status) {
      case "posted":
        return "bg-green-100 text-green-700 border-green-200";
      case "pending":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "draft":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = () => {
    switch (entry.status) {
      case "posted":
        return <CheckCircle size={12} />;
      case "pending":
        return <Clock size={12} />;
      case "draft":
        return <Clock size={12} />;
      default:
        return null;
    }
  };

  const totalDebits = entry.lines.reduce((sum, line) => sum + line.debit, 0);
  const totalCredits = entry.lines.reduce((sum, line) => sum + line.credit, 0);
  const isBalanced = totalDebits === totalCredits;

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
              <Calendar size={16} className="text-primary" />
            </div>
          </div>
          
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-mono text-muted-foreground">
                {entry.id}
              </span>
              <p className="text-sm font-medium text-foreground truncate">
                {entry.description}
              </p>
              <Badge className={cn("text-xs", getStatusColor())}>
                <span className="flex items-center gap-1">
                  {getStatusIcon()}
                  {entry.status}
                </span>
              </Badge>
              {!isBalanced && (
                <Badge variant="destructive" className="text-xs">
                  Out of Balance
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar size={12} />
                <span>{entry.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <User size={12} />
                <span>{entry.createdBy}</span>
              </div>
              <span className="font-mono">{entry.reference}</span>
              <span className="font-semibold text-foreground">
                {formatCurrency(entry.totalAmount)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
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

      {/* Expanded Details */}
      {isSelected && (
        <div className="border-t bg-accent/30 p-4">
          <div className="space-y-3">
            {/* Entry Details */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Created:</span>
                <span className="ml-2">{entry.createdAt}</span>
              </div>
              {entry.approvedBy && (
                <div>
                  <span className="text-muted-foreground">Approved by:</span>
                  <span className="ml-2">{entry.approvedBy}</span>
                </div>
              )}
            </div>

            {/* Journal Lines */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">Journal Lines</h4>
              <div className="space-y-2">
                {entry.lines.map((line, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded bg-background">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-muted-foreground">
                        {line.accountCode}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {line.accountName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {line.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-semibold text-red-600 tabular-nums">
                          {line.debit > 0 ? formatCurrency(line.debit) : "-"}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-green-600 tabular-nums">
                          {line.credit > 0 ? formatCurrency(line.credit) : "-"}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Totals */}
              <div className="flex items-center justify-between p-2 rounded bg-muted mt-2">
                <div className="text-sm font-semibold text-foreground">Totals</div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-bold text-red-600 tabular-nums">
                      {formatCurrency(totalDebits)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-green-600 tabular-nums">
                      {formatCurrency(totalCredits)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
