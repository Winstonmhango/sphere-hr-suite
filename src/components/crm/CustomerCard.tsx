import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Building2, TrendingUp, TrendingDown, Star, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CustomerCardProps {
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
    company: string;
    address: string;
    status: "active" | "inactive" | "prospect";
    totalOrders: number;
    totalSpent: number;
    lastOrderDate: string;
    rating: number;
    joinDate: string;
    trend?: "up" | "down" | "stable";
  };
  compact?: boolean;
  onView?: () => void;
  onEdit?: () => void;
}

export function CustomerCard({ customer, compact = false, onView, onEdit }: CustomerCardProps) {
  const getStatusColor = () => {
    switch (customer.status) {
      case "active":
        return "status-active";
      case "inactive":
        return "status-inactive";
      default:
        return "status-pending";
    }
  };

  const getTrendIcon = () => {
    switch (customer.trend) {
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
          i < customer.rating ? "text-amber-400 fill-amber-400" : "text-muted-foreground"
        )}
      />
    ));
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
            <User size={16} className="text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium text-foreground truncate">{customer.name}</h3>
              {getTrendIcon()}
            </div>
            <p className="text-xs text-muted-foreground">{customer.company}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold tabular-nums">${customer.totalSpent.toLocaleString()}</p>
            <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-medium", getStatusColor())}>
              {customer.status}
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
            <User size={20} className="text-muted-foreground" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-foreground">{customer.name}</h3>
              {getTrendIcon()}
            </div>
            <p className="text-xs text-muted-foreground">{customer.company}</p>
          </div>
        </div>
        <span className={cn("px-2 py-1 rounded text-xs font-medium", getStatusColor())}>
          {customer.status}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Mail size={12} />
          <span>{customer.email}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Phone size={12} />
          <span>{customer.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <MapPin size={12} />
          <span>{customer.address}</span>
        </div>

        <div className="flex items-center gap-4 pt-2 border-t border-border">
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground">Rating:</span>
            <div className="flex items-center gap-0.5">
              {getRatingStars()}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground">Orders:</span>
            <span className="text-xs font-medium">{customer.totalOrders}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <p className="text-muted-foreground">Total Spent</p>
            <p className="font-semibold tabular-nums">${customer.totalSpent.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Last Order</p>
            <p className="font-medium">{customer.lastOrderDate}</p>
          </div>
        </div>

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
