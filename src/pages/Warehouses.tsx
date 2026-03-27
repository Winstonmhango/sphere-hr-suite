import { AppLayout } from "@/components/layout/AppLayout";
import { WarehouseCard } from "@/components/inventory/WarehouseCard";
import { AddWarehouseModal } from "@/components/inventory/modals/AddWarehouseModal";
import { motion } from "framer-motion";
import {
  Building2,
  Package,
  MapPin,
  Thermometer,
  Shield,
  Search,
  Filter,
  Plus,
  Activity,
  AlertTriangle,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { InventoryStatCard } from "@/components/inventory/InventoryStatCard";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Mock data
const warehouseStats = [
  {
    label: "Total Warehouses",
    value: "8",
    change: "+2 this year",
    changeType: "positive" as const,
    icon: Building2,
    trend: "up" as const
  },
  {
    label: "Avg Utilization",
    value: "72.4%",
    change: "+5.2% vs last month",
    changeType: "positive" as const,
    icon: Activity,
    trend: "up" as const
  },
  {
    label: "Total Capacity",
    value: "45,000",
    change: "85% utilized",
    changeType: "neutral" as const,
    icon: Package,
    trend: "stable" as const
  },
  {
    label: "Critical Alerts",
    value: "2",
    change: "-3 from yesterday",
    changeType: "positive" as const,
    icon: AlertTriangle,
    trend: "down" as const
  }
];

const warehouses = [
  {
    id: "1",
    name: "Main Distribution Center",
    code: "WH-001",
    location: "123 Industrial Ave, City, State 12345",
    totalProducts: 1247,
    totalStock: 18543,
    capacity: 25000,
    utilization: 74,
    temperature: "18-22°C",
    securityLevel: "high" as const,
    status: "active" as const,
    manager: "John Smith",
    lastUpdated: "2 hours ago"
  },
  {
    id: "2",
    name: "North Regional Warehouse",
    code: "WH-002",
    location: "456 Commerce Blvd, North City, State 67890",
    totalProducts: 892,
    totalStock: 12456,
    capacity: 15000,
    utilization: 83,
    temperature: "15-20°C",
    securityLevel: "medium" as const,
    status: "active" as const,
    manager: "Sarah Johnson",
    lastUpdated: "1 hour ago"
  },
  {
    id: "3",
    name: "South Storage Facility",
    code: "WH-003",
    location: "789 Logistics Park, South City, State 11223",
    totalProducts: 567,
    totalStock: 8234,
    capacity: 10000,
    utilization: 82,
    temperature: "20-25°C",
    securityLevel: "low" as const,
    status: "active" as const,
    manager: "Mike Wilson",
    lastUpdated: "4 hours ago"
  },
  {
    id: "4",
    name: "East Distribution Hub",
    code: "WH-004",
    location: "321 Transport Way, East City, State 44556",
    totalProducts: 445,
    totalStock: 5678,
    capacity: 8000,
    utilization: 71,
    temperature: "18-22°C",
    securityLevel: "medium" as const,
    status: "maintenance" as const,
    manager: "Emily Brown",
    lastUpdated: "1 day ago"
  },
  {
    id: "5",
    name: "West Storage Center",
    code: "WH-005",
    location: "654 Warehouse Rd, West City, State 77889",
    totalProducts: 234,
    totalStock: 3456,
    capacity: 5000,
    utilization: 69,
    temperature: "16-21°C",
    securityLevel: "low" as const,
    status: "active" as const,
    manager: "David Lee",
    lastUpdated: "3 hours ago"
  },
  {
    id: "6",
    name: "Central Processing Facility",
    code: "WH-006",
    location: "987 Processing Dr, Central City, State 99001",
    totalProducts: 1890,
    totalStock: 28765,
    capacity: 30000,
    utilization: 96,
    temperature: "12-18°C",
    securityLevel: "high" as const,
    status: "active" as const,
    manager: "Lisa Chen",
    lastUpdated: "30 minutes ago"
  }
];

export default function Warehouses() {
  const [addWarehouseModalOpen, setAddWarehouseModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddWarehouse = async (data: any) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Adding warehouse:", data);
    setIsLoading(false);
    setAddWarehouseModalOpen(false);
  };

  const criticalWarehouses = warehouses.filter(w => w.utilization >= 90);
  const activeWarehouses = warehouses.filter(w => w.status === "active");
  const totalCapacity = warehouses.reduce((sum, w) => sum + w.capacity, 0);
  const totalStock = warehouses.reduce((sum, w) => sum + w.totalStock, 0);
  const avgUtilization = Math.round((totalStock / totalCapacity) * 100);

  return (
    <AppLayout title="Warehouse Management" subtitle="Monitor and manage warehouse operations">
      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {warehouseStats.map((stat, index) => (
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

      {/* Critical Alerts */}
      {criticalWarehouses.length > 0 && (
        <div className="sphere-card p-4 mb-6 border-l-4 border-red-500">
          <div className="flex items-center gap-3">
            <AlertTriangle size={20} className="text-red-500" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-foreground">High Utilization Alert</h3>
              <p className="text-xs text-muted-foreground">
                {criticalWarehouses.length} warehouse(s) operating at 90%+ capacity
              </p>
            </div>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="sphere-card p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[14px] font-semibold text-foreground tracking-tight-ui">Quick Actions</h2>
            <p className="text-[12px] text-muted-foreground mt-1">Warehouse management tasks</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Activity size={14} className="mr-1" />
              Operations
            </Button>
            <Button variant="outline" size="sm">
              <MapPin size={14} className="mr-1" />
              Transfer
            </Button>
            <Button size="sm" onClick={() => setAddWarehouseModalOpen(true)}>
              <Plus size={14} className="mr-1" />
              Add Warehouse
            </Button>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="sphere-card p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-2.5 text-muted-foreground" />
            <Input
              placeholder="Search warehouses by name, code, or location..."
              className="pl-10 text-xs"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter size={14} className="mr-1" />
            Filters
          </Button>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Active: {activeWarehouses.length}
            </Badge>
            <Badge variant="outline" className="text-xs text-amber-600">
              High Utilization: {criticalWarehouses.length}
            </Badge>
          </div>
        </div>
      </div>

      {/* Warehouse Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
        {warehouses.map((warehouse, index) => (
          <motion.div
            key={warehouse.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <WarehouseCard warehouse={warehouse} />
          </motion.div>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-6 mt-6">
        <div className="sphere-card p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
              <Building2 size={16} className="text-emerald-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Overall Utilization</h3>
              <p className="text-xs text-muted-foreground">Across all warehouses</p>
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground tabular-nums">{avgUtilization}%</div>
          <div className="w-full h-2 rounded-full bg-muted overflow-hidden mt-2">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-blue-500"
              style={{ width: `${avgUtilization}%` }}
            />
          </div>
        </div>

        <div className="sphere-card p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <Package size={16} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Total Inventory</h3>
              <p className="text-xs text-muted-foreground">Items across all locations</p>
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground tabular-nums">
            {totalStock.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            of {totalCapacity.toLocaleString()} capacity
          </p>
        </div>

        <div className="sphere-card p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
              <Shield size={16} className="text-amber-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Security Status</h3>
              <p className="text-xs text-muted-foreground">Warehouse security levels</p>
            </div>
          </div>
          <div className="space-y-2">
            {["high", "medium", "low"].map((level) => {
              const count = warehouses.filter(w => w.securityLevel === level).length;
              const percentage = (count / warehouses.length) * 100;
              return (
                <div key={level} className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground capitalize w-12">{level}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        level === "high" ? "bg-red-500" :
                        level === "medium" ? "bg-amber-500" : "bg-emerald-500"
                      )}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium tabular-nums w-4 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Warehouse Modal */}
      <AddWarehouseModal
        open={addWarehouseModalOpen}
        onOpenChange={setAddWarehouseModalOpen}
        onSubmit={handleAddWarehouse}
        isLoading={isLoading}
      />
    </AppLayout>
  );
}
