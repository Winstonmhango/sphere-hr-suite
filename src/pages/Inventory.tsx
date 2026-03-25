import { AppLayout } from "@/components/layout/AppLayout";
import { InventoryStatCard } from "@/components/inventory/InventoryStatCard";
import { ProductCard } from "@/components/inventory/ProductCard";
import { StockMovementTable } from "@/components/inventory/StockMovementTable";
import { AddProductModal } from "@/components/inventory/modals/AddProductModal";
import { StockMovementModal } from "@/components/inventory/modals/StockMovementModal";
import { motion } from "framer-motion";
import {
  Package,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Search,
  Filter,
  Plus,
  Download,
  BarChart3,
  ArrowUpDown,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

// Mock data
const inventoryStats = [
  {
    label: "Total Products",
    value: "2,847",
    change: "+124 this month",
    changeType: "positive" as const,
    icon: Package,
    trend: "up" as const
  },
  {
    label: "Low Stock Items",
    value: "23",
    change: "-8 from last week",
    changeType: "positive" as const,
    icon: AlertTriangle,
    trend: "down" as const
  },
  {
    label: "Total Value",
    value: "$1.2M",
    change: "+12.3% vs last month",
    changeType: "positive" as const,
    icon: DollarSign,
    trend: "up" as const
  },
  {
    label: "Stock Accuracy",
    value: "98.7%",
    change: "+0.5% improvement",
    changeType: "positive" as const,
    icon: BarChart3,
    trend: "up" as const
  }
];

const recentProducts = [
  {
    id: "1",
    name: "Wireless Mouse Model X",
    sku: "WMX-001",
    category: "Electronics",
    currentStock: 45,
    minStock: 20,
    maxStock: 100,
    reorderPoint: 25,
    unitPrice: 29.99,
    location: "Warehouse A - Zone 1",
    lastUpdated: "2 hours ago",
    trend: "up" as const
  },
  {
    id: "2",
    name: "Office Chair Deluxe",
    sku: "OCD-002",
    category: "Furniture",
    currentStock: 8,
    minStock: 15,
    maxStock: 50,
    reorderPoint: 20,
    unitPrice: 189.99,
    location: "Warehouse B - Zone 3",
    lastUpdated: "1 day ago",
    trend: "down" as const
  },
  {
    id: "3",
    name: "USB-C Cable 2m",
    sku: "UCC-003",
    category: "Electronics",
    currentStock: 156,
    minStock: 50,
    maxStock: 200,
    reorderPoint: 75,
    unitPrice: 12.99,
    location: "Warehouse A - Zone 2",
    lastUpdated: "4 hours ago",
    trend: "stable" as const
  }
];

const recentMovements = [
  {
    id: "1",
    type: "in" as const,
    productName: "Wireless Mouse Model X",
    sku: "WMX-001",
    quantity: 50,
    toLocation: "Warehouse A - Zone 1",
    reason: "New Stock",
    reference: "PO-2024-089",
    performedBy: "John Smith",
    timestamp: "2 hours ago",
    status: "completed" as const
  },
  {
    id: "2",
    type: "out" as const,
    productName: "Office Chair Deluxe",
    sku: "OCD-002",
    quantity: 5,
    toLocation: "Main Office",
    reason: "Office Setup",
    reference: "REQ-2024-156",
    performedBy: "Sarah Johnson",
    timestamp: "4 hours ago",
    status: "completed" as const
  },
  {
    id: "3",
    type: "transfer" as const,
    productName: "USB-C Cable 2m",
    sku: "UCC-003",
    quantity: 25,
    fromLocation: "Warehouse B - Zone 1",
    toLocation: "Warehouse A - Zone 2",
    reason: "Stock Rebalancing",
    performedBy: "Mike Wilson",
    timestamp: "6 hours ago",
    status: "completed" as const
  }
];

export default function Inventory() {
  const [addProductModalOpen, setAddProductModalOpen] = useState(false);
  const [stockMovementModalOpen, setStockMovementModalOpen] = useState(false);
  const [movementType, setMovementType] = useState<"in" | "out" | "transfer" | "adjustment">("in");
  const [isLoading, setIsLoading] = useState(false);

  const handleAddProduct = async (data: any) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Adding product:", data);
    setIsLoading(false);
    setAddProductModalOpen(false);
  };

  const handleStockMovement = async (data: any) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Stock movement:", data);
    setIsLoading(false);
    setStockMovementModalOpen(false);
  };

  return (
    <AppLayout title="Inventory Management" subtitle="Track and manage your product inventory">
      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {inventoryStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <InventoryStatCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="sphere-card p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[14px] font-semibold text-foreground tracking-tight-ui">Quick Actions</h2>
            <p className="text-[12px] text-muted-foreground mt-1">Common inventory tasks</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download size={14} className="mr-1" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <ArrowUpDown size={14} className="mr-1" />
              Reorder
            </Button>
            <Button size="sm" onClick={() => setAddProductModalOpen(true)}>
              <Plus size={14} className="mr-1" />
              Add Product
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-6">
        {/* Products Section */}
        <div className="col-span-8">
          <div className="sphere-card p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-[14px] font-semibold text-foreground tracking-tight-ui">Recent Products</h2>
                <p className="text-[12px] text-muted-foreground mt-1">Latest inventory updates</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search size={14} className="absolute left-2.5 top-2.5 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    className="pl-8 w-64 h-8 text-xs"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter size={14} className="mr-1" />
                  Filter
                </Button>
                <Button variant="ghost" size="sm">
                  <Eye size={14} className="mr-1" />
                  View All
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {recentProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Stock Movements */}
          <div className="sphere-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-[14px] font-semibold text-foreground tracking-tight-ui">Recent Movements</h2>
                <p className="text-[12px] text-muted-foreground mt-1">Latest stock transactions</p>
              </div>
              <Button variant="ghost" size="sm">
                <Eye size={14} className="mr-1" />
                View All
              </Button>
            </div>

            <StockMovementTable movements={recentMovements} compact />
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-span-4 space-y-4">
          {/* Low Stock Alerts */}
          <div className="sphere-card p-5">
            <h2 className="text-[14px] font-semibold text-foreground tracking-tight-ui mb-4">
              <AlertTriangle size={16} className="inline mr-2 text-amber-500" />
              Low Stock Alerts
            </h2>
            <div className="space-y-3">
              {recentProducts.filter(p => p.currentStock <= p.minStock).map((product) => (
                <div key={product.id} className="flex items-center justify-between p-2 rounded bg-amber-50 border border-amber-200">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-foreground">{product.name}</p>
                    <p className="text-xs text-amber-600">Stock: {product.currentStock} (Min: {product.minStock})</p>
                  </div>
                  <Badge variant="outline" className="text-xs text-amber-600 border-amber-300">
                    Reorder
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Categories Overview */}
          <div className="sphere-card p-5">
            <h2 className="text-[14px] font-semibold text-foreground tracking-tight-ui mb-4">Categories</h2>
            <div className="space-y-2">
              {["Electronics", "Furniture", "Office Supplies", "Equipment"].map((category, index) => (
                <div key={category} className="flex items-center justify-between p-2 rounded hover:bg-accent transition-colors cursor-pointer">
                  <span className="text-xs font-medium">{category}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-1 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary/60"
                        style={{ width: `${Math.random() * 60 + 20}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground tabular-nums w-8 text-right">
                      {Math.floor(Math.random() * 100 + 20)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="sphere-card p-5">
            <h2 className="text-[14px] font-semibold text-foreground tracking-tight-ui mb-4">Today's Activity</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Stock In</span>
                <span className="text-xs font-semibold text-emerald-600 tabular-nums">+127 items</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Stock Out</span>
                <span className="text-xs font-semibold text-red-500 tabular-nums">-89 items</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Transfers</span>
                <span className="text-xs font-semibold text-blue-600 tabular-nums">34 items</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Adjustments</span>
                <span className="text-xs font-semibold text-amber-600 tabular-nums">12 items</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddProductModal
        open={addProductModalOpen}
        onOpenChange={setAddProductModalOpen}
        onSubmit={handleAddProduct}
        isLoading={isLoading}
      />

      <StockMovementModal
        open={stockMovementModalOpen}
        onOpenChange={setStockMovementModalOpen}
        onSubmit={handleStockMovement}
        isLoading={isLoading}
        defaultType={movementType}
      />
    </AppLayout>
  );
}
