import { motion } from "framer-motion";
import { Building2, Package, AlertTriangle, TrendingUp, MapPin, Thermometer, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface WarehouseCardProps {
  warehouse: {
    id: string;
    name: string;
    code: string;
    location: string;
    totalProducts: number;
    totalStock: number;
    capacity: number;
    utilization: number;
    temperature?: string;
    securityLevel: "low" | "medium" | "high";
    status: "active" | "maintenance" | "inactive";
    manager: string;
    lastUpdated: string;
  };
  compact?: boolean;
  onClick?: () => void;
}

export function WarehouseCard({ warehouse, compact = false, onClick }: WarehouseCardProps) {
  const getUtilizationColor = () => {
    if (warehouse.utilization >= 90) return "text-red-600 bg-red-50";
    if (warehouse.utilization >= 75) return "text-amber-600 bg-amber-50";
    return "text-emerald-600 bg-emerald-50";
  };

  const getSecurityIcon = () => {
    switch (warehouse.securityLevel) {
      case "high":
        return <Shield size={14} className="text-red-500" />;
      case "medium":
        return <Shield size={14} className="text-amber-500" />;
      default:
        return <Shield size={14} className="text-green-500" />;
    }
  };

  const getStatusClass = () => {
    switch (warehouse.status) {
      case "active":
        return "status-active";
      case "maintenance":
        return "status-pending";
      default:
        return "status-inactive";
    }
  };

  if (compact) {
    return (
      <motion.div
        whileHover={{ scale: 1.01 }}
        className={cn(
          "sphere-card p-3 cursor-pointer",
          onClick && "hover:shadow-md"
        )}
        onClick={onClick}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <Building2 size={16} className="text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-foreground truncate">
              {warehouse.name}
            </h3>
            <p className="text-xs text-muted-foreground">{warehouse.code}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold tabular-nums">{warehouse.utilization}%</p>
            <div className="w-full h-1 rounded-full bg-muted overflow-hidden">
              <div
                className={cn("h-full rounded-full", 
                  warehouse.utilization >= 90 ? "bg-red-500" :
                  warehouse.utilization >= 75 ? "bg-amber-500" : "bg-emerald-500"
                )}
                style={{ width: `${warehouse.utilization}%` }}
              />
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
        "sphere-card p-4 cursor-pointer",
        onClick && "hover:shadow-md"
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
            <Building2 size={20} className="text-muted-foreground" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-foreground">{warehouse.name}</h3>
              <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-medium", getStatusClass())}>
                {warehouse.status}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{warehouse.code}</p>
          </div>
        </div>
        {warehouse.utilization >= 90 && (
          <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle size={12} className="text-red-600" />
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <MapPin size={12} className="text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{warehouse.location}</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-muted-foreground">Utilization</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-colors",
                    warehouse.utilization >= 90 ? "bg-red-500" :
                    warehouse.utilization >= 75 ? "bg-amber-500" : "bg-emerald-500"
                  )}
                  style={{ width: `${warehouse.utilization}%` }}
                />
              </div>
              <span className={cn("text-xs font-semibold tabular-nums", getUtilizationColor())}>
                {warehouse.utilization}%
              </span>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Products</p>
            <p className="text-sm font-semibold tabular-nums">{warehouse.totalProducts}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <Package size={12} className="text-muted-foreground" />
            <span className="text-muted-foreground">Stock:</span>
            <span className="font-medium tabular-nums">{warehouse.totalStock.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp size={12} className="text-muted-foreground" />
            <span className="text-muted-foreground">Cap:</span>
            <span className="font-medium tabular-nums">{warehouse.capacity.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            {getSecurityIcon()}
            <span className="text-muted-foreground">{warehouse.securityLevel}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="text-xs text-muted-foreground">
            <span className="font-medium">{warehouse.manager}</span> • {warehouse.lastUpdated}
          </div>
          {warehouse.temperature && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Thermometer size={10} />
              <span>{warehouse.temperature}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
