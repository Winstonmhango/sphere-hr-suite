import { motion } from "framer-motion";
import { Package, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import { StockLevelIndicator } from "./StockLevelIndicator";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    sku: string;
    category: string;
    currentStock: number;
    minStock: number;
    maxStock: number;
    reorderPoint?: number;
    unitPrice: number;
    location?: string;
    lastUpdated: string;
    trend?: "up" | "down" | "stable";
  };
  compact?: boolean;
  onClick?: () => void;
}

export function ProductCard({ product, compact = false, onClick }: ProductCardProps) {
  const isLowStock = product.currentStock <= product.minStock;
  const isReorderPoint = product.reorderPoint && product.currentStock <= product.reorderPoint;
  
  const getTrendIcon = () => {
    switch (product.trend) {
      case "up":
        return <TrendingUp size={12} className="text-emerald-600" />;
      case "down":
        return <TrendingDown size={12} className="text-red-500" />;
      default:
        return null;
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
            <Package size={16} className="text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium text-foreground truncate">
                {product.name}
              </h3>
              {getTrendIcon()}
            </div>
            <p className="text-xs text-muted-foreground">{product.sku}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold tabular-nums">{product.currentStock}</p>
            <StockLevelIndicator
              currentStock={product.currentStock}
              minStock={product.minStock}
              maxStock={product.maxStock}
              reorderPoint={product.reorderPoint}
              size="sm"
            />
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
            <Package size={20} className="text-muted-foreground" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-foreground">{product.name}</h3>
              {getTrendIcon()}
            </div>
            <p className="text-xs text-muted-foreground">{product.sku}</p>
          </div>
        </div>
        {(isLowStock || isReorderPoint) && (
          <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
            <AlertTriangle size={12} className="text-amber-600" />
          </div>
        )}
      </div>

      <div className="space-y-3">
        <StockLevelIndicator
          currentStock={product.currentStock}
          minStock={product.minStock}
          maxStock={product.maxStock}
          reorderPoint={product.reorderPoint}
          showLabels
        />

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <p className="text-muted-foreground">Category</p>
            <p className="font-medium">{product.category}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Unit Price</p>
            <p className="font-medium tabular-nums">${product.unitPrice.toFixed(2)}</p>
          </div>
          {product.location && (
            <div>
              <p className="text-muted-foreground">Location</p>
              <p className="font-medium">{product.location}</p>
            </div>
          )}
          <div>
            <p className="text-muted-foreground">Last Updated</p>
            <p className="font-medium">{product.lastUpdated}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
