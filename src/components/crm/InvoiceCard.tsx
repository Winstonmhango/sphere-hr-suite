import { motion } from "framer-motion";
import { FileText, Calendar, DollarSign, User, Building2, CheckCircle, Clock, AlertCircle, TrendingUp, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface InvoiceCardProps {
  invoice: {
    id: string;
    invoiceNumber: string;
    customerName: string;
    customerCompany: string;
    amount: number;
    status: "paid" | "pending" | "overdue" | "cancelled";
    issueDate: string;
    dueDate: string;
    paidDate?: string;
    items: number;
    description?: string;
    trend?: "up" | "down" | "stable";
  };
  compact?: boolean;
  onView?: () => void;
  onEdit?: () => void;
  onPay?: () => void;
}

export function InvoiceCard({ invoice, compact = false, onView, onEdit, onPay }: InvoiceCardProps) {
  const getStatusColor = () => {
    switch (invoice.status) {
      case "paid":
        return "status-active";
      case "pending":
        return "status-pending";
      case "overdue":
        return "status-rejected";
      default:
        return "status-inactive";
    }
  };

  const getStatusIcon = () => {
    switch (invoice.status) {
      case "paid":
        return <CheckCircle size={12} className="text-emerald-600" />;
      case "pending":
        return <Clock size={12} className="text-amber-600" />;
      case "overdue":
        return <AlertCircle size={12} className="text-red-500" />;
      default:
        return <AlertCircle size={12} className="text-muted-foreground" />;
    }
  };

  const getTrendIcon = () => {
    switch (invoice.trend) {
      case "up":
        return <TrendingUp size={12} className="text-emerald-600" />;
      case "down":
        return <TrendingDown size={12} className="text-red-500" />;
      default:
        return null;
    }
  };

  const isOverdue = new Date(invoice.dueDate) < new Date() && invoice.status !== "paid";

  if (compact) {
    return (
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="sphere-card p-3 cursor-pointer hover:shadow-md"
        onClick={onView}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <FileText size={16} className="text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium text-foreground truncate">{invoice.invoiceNumber}</h3>
              {getTrendIcon()}
            </div>
            <p className="text-xs text-muted-foreground">{invoice.customerName}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold tabular-nums">${invoice.amount.toLocaleString()}</p>
            <div className="flex items-center gap-1">
              {getStatusIcon()}
              <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-medium", getStatusColor())}>
                {invoice.status}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -1 }}
      className={cn(
        "sphere-card p-4 cursor-pointer hover:shadow-md",
        isOverdue && "border-l-4 border-red-500"
      )}
      onClick={onView}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
            <FileText size={20} className="text-muted-foreground" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-foreground">{invoice.invoiceNumber}</h3>
              {getTrendIcon()}
            </div>
            <p className="text-xs text-muted-foreground">{invoice.description || "Standard Invoice"}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1">
            {getStatusIcon()}
            <span className={cn("px-2 py-1 rounded text-xs font-medium", getStatusColor())}>
              {invoice.status}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <User size={12} />
          <span>{invoice.customerName}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Building2 size={12} />
          <span>{invoice.customerCompany}</span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <p className="text-muted-foreground">Amount</p>
            <p className="font-semibold tabular-nums">${invoice.amount.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Items</p>
            <p className="font-medium">{invoice.items}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <p className="text-muted-foreground">Issue Date</p>
            <p className="font-medium">{invoice.issueDate}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Due Date</p>
            <p className={cn("font-medium", isOverdue && "text-red-500")}>
              {invoice.dueDate}
            </p>
          </div>
        </div>

        {invoice.paidDate && (
          <div className="flex items-center gap-2 text-xs">
            <p className="text-muted-foreground">Paid Date:</p>
            <p className="font-medium text-emerald-600">{invoice.paidDate}</p>
          </div>
        )}

        {isOverdue && (
          <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded">
            <AlertCircle size={12} className="text-red-600" />
            <p className="text-xs text-red-700">Invoice is overdue</p>
          </div>
        )}

        <div className="flex items-center gap-2 pt-2">
          <Button size="sm" variant="outline" className="flex-1">
            View Details
          </Button>
          {invoice.status === "pending" && onPay && (
            <Button size="sm" onClick={(e) => { e.stopPropagation(); onPay?.(); }}>
              Pay Now
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); onEdit?.(); }}>
            Edit
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
