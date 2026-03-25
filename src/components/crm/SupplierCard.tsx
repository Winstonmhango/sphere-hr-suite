import { motion } from "framer-motion";
import { Building2, Mail, Phone, MapPin, Package, TrendingUp, TrendingDown, Star, CheckCircle, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SupplierCardProps {
  supplier: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    category: string;
    status: "active" | "inactive" | "pending";
    totalOrders: number;
    totalValue: number;
    lastDeliveryDate: string;
    rating: number;
    leadTime: string;
    reliability: number;
    products: string[];
    trend?: "up" | "down" | "stable";
  };
  compact?: boolean;
  onView?: () => void;
  onEdit?: () => void;
}

export function SupplierCard({ supplier, compact = false, onView, onEdit }: SupplierCardProps) {
  const getStatusColor = () => {
    switch (supplier.status) {
      case "active":
        return "status-active";
      case "inactive":
        return "status-inactive";
      default:
        return "status-pending";
    }
  };

  const getTrendIcon = () => {
    switch (supplier.trend) {
      case "up":
        return <TrendingUp size={12} className="text-emerald-600" />;
      case "down":
        return <TrendingDown size={12} className="text-red-500" />;
      default:
        return null;
    }
  };

  const getRatingStars = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={12}
        className={cn(
          i < supplier.rating ? "text-amber-400 fill-amber-400" : "text-muted-foreground"
        )}
      />
    ));
  };

  const getReliabilityColor = () => {
    if (supplier.reliability >= 90) return "text-emerald-600";
    if (supplier.reliability >= 70) return "text-amber-600";
    return "text-red-500";
  };

  const getReliabilityIcon = () => {
    if (supplier.reliability >= 90) return <CheckCircle size={12} className="text-emerald-600" />;
    if (supplier.reliability >= 70) return <AlertCircle size={12} className="text-amber-600" />;
    return <AlertCircle size={12} className="text-red-500" />;
  };

  if (compact) {
    return (
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="sphere-card p-3 cursor-pointer hover:shadow-md"
        onClick={onView}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <Building2 size={16} className="text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium text-foreground truncate">{supplier.name}</h3>
              {getTrendIcon()}
            </div>
            <p className="text-xs text-muted-foreground">{supplier.category}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold tabular-nums">${supplier.totalValue.toLocaleString()}</p>
            <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-medium", getStatusColor())}>
              {supplier.status}
            </span>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -1 }}
      className="sphere-card p-4 cursor-pointer hover:shadow-md"
      onClick={onView}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
            <Building2 size={20} className="text-muted-foreground" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-foreground">{supplier.name}</h3>
              {getTrendIcon()}
            </div>
            <p className="text-xs text-muted-foreground">{supplier.category}</p>
          </div>
        </div>
        <span className={cn("px-2 py-1 rounded text-xs font-medium", getStatusColor())}>
          {supplier.status}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Mail size={12} />
          <span>{supplier.email}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Phone size={12} />
          <span>{supplier.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <MapPin size={12} />
          <span>{supplier.address}</span>
        </div>

        <div className="flex items-center gap-4 pt-2 border-t border-border">
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground">Rating:</span>
            <div className="flex items-center gap-0.5">
              {getRatingStars()}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground">Lead Time:</span>
            <span className="text-xs font-medium">{supplier.leadTime}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <p className="text-muted-foreground">Total Orders</p>
            <p className="font-semibold tabular-nums">{supplier.totalOrders}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Total Value</p>
            <p className="font-semibold tabular-nums">${supplier.totalValue.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Reliability:</span>
          {getReliabilityIcon()}
          <span className={cn("text-xs font-medium", getReliabilityColor())}>
            {supplier.reliability}%
          </span>
        </div>

        {supplier.products.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground mb-1">Products:</p>
            <div className="flex flex-wrap gap-1">
              {supplier.products.slice(0, 3).map((product) => (
                <Badge key={product} variant="outline" className="text-xs">
                  {product}
                </Badge>
              ))}
              {supplier.products.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{supplier.products.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 pt-2">
          <Button size="sm" variant="outline" className="flex-1">
            View Details
          </Button>
          <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); onEdit?.(); }}>
            Edit
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
