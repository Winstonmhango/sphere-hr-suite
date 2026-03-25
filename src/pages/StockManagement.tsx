import { AppLayout } from "@/components/layout/AppLayout";
import { InventoryStatCard } from "@/components/inventory/InventoryStatCard";
import { StockMovementTable } from "@/components/inventory/StockMovementTable";
import { StockLevelIndicator } from "@/components/inventory/StockLevelIndicator";
import { StockMovementModal } from "@/components/inventory/modals/StockMovementModal";
import { StockTransferModal } from "@/components/inventory/modals/StockTransferModal";
import { StockAdjustmentModal } from "@/components/inventory/modals/StockAdjustmentModal";
import { motion } from "framer-motion";
import {
  Package,
  TrendingUp,
  TrendingDown,
  ArrowUpDown,
  Search,
  Filter,
  Plus,
  BarChart3,
  Clock,
  AlertTriangle,
  Activity,
  Download,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

// Mock data
const stockStats = [
  {
    label: "Total Stock Items",
    value: "45,892",
    change: "+1,234 this week",
    changeType: "positive" as const,
    icon: Package,
    trend: "up" as const
  },
  {
    label: "Stock Movements",
    value: "892",
    change: "+156 today",
    changeType: "positive" as const,
    icon: Activity,
    trend: "up" as const
  },
  {
    label: "Accuracy Rate",
    value: "99.2%",
    change: "+0.3% improvement",
    changeType: "positive" as const,
    icon: BarChart3,
    trend: "up" as const
  },
  {
    label: "Pending Audits",
    value: "7",
    change: "-2 from yesterday",
    changeType: "positive" as const,
    icon: Clock,
    trend: "down" as const
  }
];

const criticalStockLevels = [
  {
    id: "1",
    productName: "Wireless Mouse Model X",
    sku: "WMX-001",
    currentStock: 8,
    minStock: 20,
    maxStock: 100,
    reorderPoint: 25,
    location: "Warehouse A - Zone 1",
    trend: "down" as const,
    lastUpdated: "2 hours ago"
  },
  {
    id: "2",
    productName: "Office Chair Deluxe",
    sku: "OCD-002",
    currentStock: 5,
    minStock: 15,
    maxStock: 50,
    reorderPoint: 20,
    location: "Warehouse B - Zone 3",
    trend: "down" as const,
    lastUpdated: "1 day ago"
  },
  {
    id: "3",
    productName: "USB-C Cable 2m",
    sku: "UCC-003",
    currentStock: 22,
    minStock: 50,
    maxStock: 200,
    reorderPoint: 75,
    location: "Warehouse A - Zone 2",
    trend: "stable" as const,
    lastUpdated: "4 hours ago"
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
  },
  {
    id: "4",
    type: "adjustment" as const,
    productName: "Laptop Stand Pro",
    sku: "LSP-004",
    quantity: -3,
    toLocation: "Warehouse A - Zone 3",
    reason: "Damaged Items",
    reference: "ADJ-2024-023",
    performedBy: "Lisa Chen",
    timestamp: "8 hours ago",
    status: "completed" as const
  },
  {
    id: "5",
    type: "in" as const,
    productName: "Desk Lamp LED",
    sku: "DLL-005",
    quantity: 100,
    toLocation: "Warehouse B - Zone 2",
    reason: "New Arrival",
    reference: "PO-2024-090",
    performedBy: "David Lee",
    timestamp: "1 day ago",
    status: "pending" as const
  }
];

const stockCategories = [
  { name: "Electronics", totalItems: 15420, lowStock: 8, trend: "up" },
  { name: "Furniture", totalItems: 8934, lowStock: 3, trend: "stable" },
  { name: "Office Supplies", totalItems: 12567, lowStock: 12, trend: "down" },
  { name: "Equipment", totalItems: 8971, lowStock: 0, trend: "up" }
];

export default function StockManagement() {
  const [stockMovementModalOpen, setStockMovementModalOpen] = useState(false);
  const [stockTransferModalOpen, setStockTransferModalOpen] = useState(false);
  const [stockAdjustmentModalOpen, setStockAdjustmentModalOpen] = useState(false);
  const [movementType, setMovementType] = useState<"in" | "out" | "transfer" | "adjustment">("in");
  const [isLoading, setIsLoading] = useState(false);

  const handleStockMovement = async (data: any) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Stock movement:", data);
    setIsLoading(false);
    setStockMovementModalOpen(false);
  };

  const handleStockTransfer = async (data: any) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Stock transfer:", data);
    setIsLoading(false);
    setStockTransferModalOpen(false);
  };

  const handleStockAdjustment = async (data: any) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Stock adjustment:", data);
    setIsLoading(false);
    setStockAdjustmentModalOpen(false);
  };

  return (
    <AppLayout title="Stock Management" subtitle="Monitor stock levels and movements">
      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {stockStats.map((stat, index) => (
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

      {/* Critical Stock Alerts */}
      <div className="sphere-card p-4 mb-6 border-l-4 border-amber-500">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle size={20} className="text-amber-500" />
            <div>
              <h3 className="text-sm font-semibold text-foreground">Low Stock Alert</h3>
              <p className="text-xs text-muted-foreground">
                {criticalStockLevels.length} items require immediate attention
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw size={14} className="mr-1" />
              Reorder All
            </Button>
            <Button size="sm">
              View Details
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="movements">Movements</TabsTrigger>
          <TabsTrigger value="levels">Stock Levels</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-12 gap-6">
            {/* Critical Stock Items */}
            <div className="col-span-8">
              <div className="sphere-card p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-[14px] font-semibold text-foreground tracking-tight-ui">Critical Stock Items</h2>
                    <p className="text-[12px] text-muted-foreground mt-1">Items below minimum stock level</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    View All Critical Items
                  </Button>
                </div>

                <div className="space-y-4">
                  {criticalStockLevels.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="sphere-card p-4 border-l-4 border-red-500"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="text-sm font-semibold text-foreground">{item.productName}</h3>
                          <p className="text-xs text-muted-foreground">{item.sku} • {item.location}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-red-600 tabular-nums">{item.currentStock}</span>
                            <span className="text-xs text-muted-foreground">/ {item.maxStock}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">Min: {item.minStock}</p>
                        </div>
                      </div>

                      <StockLevelIndicator
                        currentStock={item.currentStock}
                        minStock={item.minStock}
                        maxStock={item.maxStock}
                        reorderPoint={item.reorderPoint}
                        showLabels
                      />

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs text-red-600 border-red-300">
                            Critical
                          </Badge>
                          <span className="text-xs text-muted-foreground">Updated {item.lastUpdated}</span>
                        </div>
                        <Button size="sm" variant="outline">
                          <ArrowUpDown size={12} className="mr-1" />
                          Reorder
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="col-span-4 space-y-4">
              {/* Category Overview */}
              <div className="sphere-card p-5">
                <h2 className="text-[14px] font-semibold text-foreground tracking-tight-ui mb-4">Stock by Category</h2>
                <div className="space-y-3">
                  {stockCategories.map((category) => (
                    <div key={category.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium">{category.name}</span>
                        <div className="flex items-center gap-1">
                          {category.lowStock > 0 && (
                            <AlertTriangle size={10} className="text-amber-500" />
                          )}
                          <span className="text-xs text-muted-foreground tabular-nums">
                            {category.totalItems.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full",
                            category.lowStock > 0 ? "bg-amber-500" : "bg-emerald-500"
                          )}
                          style={{ width: `${(category.totalItems / 20000) * 100}%` }}
                        />
                      </div>
                      {category.lowStock > 0 && (
                        <p className="text-xs text-amber-600">{category.lowStock} items low stock</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="sphere-card p-5">
                <h2 className="text-[14px] font-semibold text-foreground tracking-tight-ui mb-4">Quick Actions</h2>
                <div className="space-y-2">
                  <Button size="sm" variant="outline" onClick={() => setStockMovementModalOpen(true)}>
                    <Plus size={14} className="mr-2" />
                    Stock In
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => {
                    setMovementType("out");
                    setStockMovementModalOpen(true);
                  }}>
                    <Package size={14} className="mr-2" />
                    Stock Out
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setStockTransferModalOpen(true)}>
                    <ArrowUpDown size={14} className="mr-2" />
                    Transfer Stock
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setStockAdjustmentModalOpen(true)}>
                    <RefreshCw size={14} className="mr-2" />
                    Stock Adjustment
                  </Button>
                </div>
              </div>

              {/* Today's Summary */}
              <div className="sphere-card p-5">
                <h2 className="text-[14px] font-semibold text-foreground tracking-tight-ui mb-4">Today's Summary</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Stock In</span>
                    <span className="text-xs font-semibold text-emerald-600 tabular-nums">+234 items</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Stock Out</span>
                    <span className="text-xs font-semibold text-red-500 tabular-nums">-156 items</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Transfers</span>
                    <span className="text-xs font-semibold text-blue-600 tabular-nums">89 items</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Adjustments</span>
                    <span className="text-xs font-semibold text-amber-600 tabular-nums">12 items</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-xs font-medium">Net Change</span>
                    <span className="text-xs font-semibold text-emerald-600 tabular-nums">+79 items</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="movements" className="space-y-6">
          <div className="sphere-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-[14px] font-semibold text-foreground tracking-tight-ui">Stock Movements</h2>
                <p className="text-[12px] text-muted-foreground mt-1">Recent stock transactions</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search size={14} className="absolute left-2.5 top-2.5 text-muted-foreground" />
                  <Input
                    placeholder="Search movements..."
                    className="pl-8 w-64 h-8 text-xs"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter size={14} className="mr-1" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <Download size={14} className="mr-1" />
                  Export
                </Button>
              </div>
            </div>

            <StockMovementTable movements={recentMovements} />
          </div>
        </TabsContent>

        <TabsContent value="levels" className="space-y-6">
          <div className="sphere-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-[14px] font-semibold text-foreground tracking-tight-ui">Stock Levels</h2>
                <p className="text-[12px] text-muted-foreground mt-1">Current inventory status across all locations</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <RefreshCw size={14} className="mr-1" />
                  Refresh
                </Button>
                <Button variant="outline" size="sm">
                  <Download size={14} className="mr-1" />
                  Export
                </Button>
              </div>
            </div>

            <div className="text-center py-8 text-muted-foreground">
              <Package size={48} className="mx-auto mb-4 opacity-50" />
              <p>Stock levels analysis would be displayed here</p>
              <p className="text-sm">Detailed breakdown of inventory across all locations</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="sphere-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-[14px] font-semibold text-foreground tracking-tight-ui">Stock Analytics</h2>
                <p className="text-[12px] text-muted-foreground mt-1">Inventory performance and trends</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <BarChart3 size={14} className="mr-1" />
                  Reports
                </Button>
                <Button variant="outline" size="sm">
                  <Download size={14} className="mr-1" />
                  Export
                </Button>
              </div>
            </div>

            <div className="text-center py-8 text-muted-foreground">
              <BarChart3 size={48} className="mx-auto mb-4 opacity-50" />
              <p>Stock analytics would be displayed here</p>
              <p className="text-sm">Charts, graphs, and performance metrics</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <StockMovementModal
        open={stockMovementModalOpen}
        onOpenChange={setStockMovementModalOpen}
        onSubmit={handleStockMovement}
        isLoading={isLoading}
        defaultType={movementType}
      />

      <StockTransferModal
        open={stockTransferModalOpen}
        onOpenChange={setStockTransferModalOpen}
        onSubmit={handleStockTransfer}
        isLoading={isLoading}
      />

      <StockAdjustmentModal
        open={stockAdjustmentModalOpen}
        onOpenChange={setStockAdjustmentModalOpen}
        onSubmit={handleStockAdjustment}
        isLoading={isLoading}
      />
    </AppLayout>
  );
}
