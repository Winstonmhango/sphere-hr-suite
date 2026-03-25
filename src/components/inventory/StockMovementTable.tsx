import { motion } from "framer-motion";
import { ArrowDownIcon, ArrowUpIcon, ArrowRightIcon, Clock, Package, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StockMovement {
  id: string;
  type: "in" | "out" | "transfer" | "adjustment";
  productName: string;
  sku: string;
  quantity: number;
  fromLocation?: string;
  toLocation?: string;
  reason: string;
  reference?: string;
  performedBy: string;
  timestamp: string;
  status: "completed" | "pending" | "cancelled";
}

interface StockMovementTableProps {
  movements: StockMovement[];
  compact?: boolean;
}

export function StockMovementTable({ movements, compact = false }: StockMovementTableProps) {
  const getMovementIcon = (type: StockMovement["type"]) => {
    switch (type) {
      case "in":
        return <ArrowDownIcon size={14} className="text-emerald-600" />;
      case "out":
        return <ArrowUpIcon size={14} className="text-red-500" />;
      case "transfer":
        return <ArrowRightIcon size={14} className="text-blue-600" />;
      case "adjustment":
        return <Package size={14} className="text-amber-600" />;
    }
  };

  const getMovementType = (type: StockMovement["type"]) => {
    switch (type) {
      case "in":
        return "Stock In";
      case "out":
        return "Stock Out";
      case "transfer":
        return "Transfer";
      case "adjustment":
        return "Adjustment";
    }
  };

  const getStatusColor = (status: StockMovement["status"]) => {
    switch (status) {
      case "completed":
        return "status-active";
      case "pending":
        return "status-pending";
      case "cancelled":
        return "status-rejected";
    }
  };

  if (compact) {
    return (
      <div className="space-y-2">
        {movements.map((movement, index) => (
          <motion.div
            key={movement.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="sphere-card p-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                {getMovementIcon(movement.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-medium text-foreground truncate">
                    {movement.productName}
                  </h4>
                  <Badge variant="outline" className="text-xs">
                    {getMovementType(movement.type)}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className={cn(
                    "text-xs font-medium tabular-nums",
                    movement.type === "in" ? "text-emerald-600" :
                    movement.type === "out" ? "text-red-500" :
                    "text-blue-600"
                  )}>
                    {movement.type === "out" ? "-" : "+"}{movement.quantity}
                  </span>
                  <span className="text-xs text-muted-foreground">{movement.reason}</span>
                </div>
              </div>
              <div className="text-right">
                <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-medium", getStatusColor(movement.status))}>
                  {movement.status}
                </span>
                <p className="text-xs text-muted-foreground mt-1">{movement.timestamp}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="sphere-card">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Movement
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Product
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Quantity
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Location
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Reason
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Performed By
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Time
              </th>
            </tr>
          </thead>
          <tbody>
            {movements.map((movement, index) => (
              <motion.tr
                key={movement.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-border last:border-b-0 hover:bg-accent/50 transition-colors"
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-accent flex items-center justify-center">
                      {getMovementIcon(movement.type)}
                    </div>
                    <span className="text-xs font-medium">{getMovementType(movement.type)}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">{movement.productName}</p>
                    <p className="text-xs text-muted-foreground">{movement.sku}</p>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className={cn(
                    "text-sm font-semibold tabular-nums",
                    movement.type === "in" ? "text-emerald-600" :
                    movement.type === "out" ? "text-red-500" :
                    "text-blue-600"
                  )}>
                    {movement.type === "out" ? "-" : "+"}{movement.quantity}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="text-xs">
                    {movement.type === "transfer" ? (
                      <div>
                        <p className="text-muted-foreground">From: {movement.fromLocation}</p>
                        <p className="text-muted-foreground">To: {movement.toLocation}</p>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">{movement.toLocation || "—"}</span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div>
                    <p className="text-sm text-foreground">{movement.reason}</p>
                    {movement.reference && (
                      <p className="text-xs text-muted-foreground">Ref: {movement.reference}</p>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1">
                    <User size={12} className="text-muted-foreground" />
                    <span className="text-sm">{movement.performedBy}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className={cn("px-2 py-1 rounded text-xs font-medium", getStatusColor(movement.status))}>
                    {movement.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock size={10} />
                    <span>{movement.timestamp}</span>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
