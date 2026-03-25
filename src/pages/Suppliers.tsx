import { AppLayout } from "@/components/layout/AppLayout";
import { SupplierCard } from "@/components/crm/SupplierCard";
import { AddSupplierModal } from "@/components/crm/modals/AddSupplierModal";
import { motion } from "framer-motion";
import {
  Building2,
  TrendingUp,
  DollarSign,
  Package,
  Search,
  Filter,
  Plus,
  Download,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  AlertCircle,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { InventoryStatCard } from "@/components/inventory/InventoryStatCard";
import { cn } from "@/lib/utils";
import { useState } from "react";

// Mock data
const supplierStats = [
  {
    label: "Total Suppliers",
    value: "342",
    change: "+8 this month",
    changeType: "positive" as const,
    icon: Building2,
    trend: "up" as const
  },
  {
    label: "Active Suppliers",
    value: "267",
    change: "+5 this month",
    changeType: "positive" as const,
    icon: TrendingUp,
    trend: "up" as const
  },
  {
    label: "Total Orders",
    value: "1,892",
    change: "+156 this month",
    changeType: "positive" as const,
    icon: Package,
    trend: "up" as const
  },
  {
    label: "Avg Reliability",
    value: "94.2%",
    change: "+2.1% improvement",
    changeType: "positive" as const,
    icon: CheckCircle,
    trend: "up" as const
  }
];

const suppliers = [
  {
    id: "1",
    name: "Global Supply Co",
    email: "orders@globalsupply.com",
    phone: "+1 (555) 123-4567",
    address: "123 Supplier Ave, New York, NY 10001",
    category: "Electronics",
    status: "active" as const,
    totalOrders: 156,
    totalValue: 456780,
    lastDeliveryDate: "2 days ago",
    rating: 5,
    leadTime: "3-7 days",
    reliability: 98,
    products: ["Laptops", "Monitors", "Keyboards"],
    trend: "up" as const
  },
  {
    id: "2",
    name: "Office Furniture Plus",
    email: "sales@officefurniture.com",
    phone: "+1 (555) 987-6543",
    address: "456 Commerce Blvd, Los Angeles, CA 90001",
    category: "Furniture",
    status: "active" as const,
    totalOrders: 89,
    totalValue: 234560,
    lastDeliveryDate: "1 week ago",
    rating: 4,
    leadTime: "1-2 weeks",
    reliability: 92,
    products: ["Desks", "Chairs", "Storage"],
    trend: "stable" as const
  },
  {
    id: "3",
    name: "Tech Components Ltd",
    email: "info@techcomponents.com",
    phone: "+1 (555) 456-7890",
    address: "789 Tech Park, San Francisco, CA 94105",
    category: "Electronics",
    status: "pending" as const,
    totalOrders: 0,
    totalValue: 0,
    lastDeliveryDate: "Never",
    rating: 0,
    leadTime: "2-4 weeks",
    reliability: 0,
    products: ["CPUs", "RAM", "Storage"],
    trend: "up" as const
  },
  {
    id: "4",
    name: "Raw Materials Inc",
    email: "procurement@rawmaterials.com",
    phone: "+1 (555) 234-5678",
    address: "321 Industrial Dr, Chicago, IL 60601",
    category: "Raw Materials",
    status: "active" as const,
    totalOrders: 234,
    totalValue: 678920,
    lastDeliveryDate: "3 days ago",
    rating: 4,
    leadTime: "1-2 weeks",
    reliability: 88,
    products: ["Steel", "Plastic", "Components"],
    trend: "down" as const
  },
  {
    id: "5",
    name: "Software Solutions Pro",
    email: "sales@softwaresolutions.com",
    phone: "+1 (555) 345-6789",
    address: "654 Digital Way, Austin, TX 73301",
    category: "Software",
    status: "inactive" as const,
    totalOrders: 45,
    totalValue: 123450,
    lastDeliveryDate: "2 months ago",
    rating: 3,
    leadTime: "Immediate",
    reliability: 75,
    products: ["License Keys", "Support"],
    trend: "stable" as const
  }
];

const topSuppliers = suppliers
  .filter(s => s.status === "active")
  .sort((a, b) => b.totalValue - a.totalValue)
  .slice(0, 3);

const recentDeliveries = suppliers
  .filter(s => s.lastDeliveryDate !== "Never")
  .sort((a, b) => {
    const dateA = a.lastDeliveryDate.includes("day") ? 1 : a.lastDeliveryDate.includes("week") ? 7 : 30;
    const dateB = b.lastDeliveryDate.includes("day") ? 1 : b.lastDeliveryDate.includes("week") ? 7 : 30;
    return dateA - dateB;
  })
  .slice(0, 3);

export default function Suppliers() {
  const [addSupplierModalOpen, setAddSupplierModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddSupplier = async (data: any) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Adding supplier:", data);
    setIsLoading(false);
    setAddSupplierModalOpen(false);
  };

  return (
    <AppLayout title="Supplier Management" subtitle="Manage your supplier relationships">
      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {supplierStats.map((stat, index) => (
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
            <p className="text-[12px] text-muted-foreground mt-1">Supplier management tasks</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download size={14} className="mr-1" />
              Export
            </Button>
            <Button size="sm" onClick={() => setAddSupplierModalOpen(true)}>
              <Plus size={14} className="mr-1" />
              Add Supplier
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
              placeholder="Search suppliers by name, category, or email..."
              className="pl-10 text-xs"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter size={14} className="mr-1" />
            Filters
          </Button>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Active: {suppliers.filter(s => s.status === "active").length}
            </Badge>
            <Badge variant="outline" className="text-xs">
              Pending: {suppliers.filter(s => s.status === "pending").length}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-6">
        {/* Suppliers List */}
        <div className="col-span-8">
          <div className="sphere-card p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-[14px] font-semibold text-foreground tracking-tight-ui">All Suppliers</h2>
                <p className="text-[12px] text-muted-foreground mt-1">Supplier directory</p>
              </div>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {suppliers.map((supplier, index) => (
                <motion.div
                  key={supplier.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <SupplierCard supplier={supplier} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-span-4 space-y-4">
          {/* Top Suppliers */}
          <div className="sphere-card p-5">
            <h2 className="text-[14px] font-semibold text-foreground tracking-tight-ui mb-4">
              <DollarSign size={16} className="inline mr-2 text-emerald-600" />
              Top Suppliers
            </h2>
            <div className="space-y-3">
              {topSuppliers.map((supplier, index) => (
                <div key={supplier.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{supplier.name}</p>
                    <p className="text-xs text-muted-foreground">{supplier.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold tabular-nums">
                      ${(supplier.totalValue / 1000).toFixed(1)}k
                    </p>
                    <div className="flex items-center gap-1">
                      {supplier.reliability >= 90 ? (
                        <CheckCircle size={12} className="text-emerald-600" />
                      ) : (
                        <AlertCircle size={12} className="text-amber-600" />
                      )}
                      <span className="text-xs text-muted-foreground">{supplier.reliability}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Deliveries */}
          <div className="sphere-card p-5">
            <h2 className="text-[14px] font-semibold text-foreground tracking-tight-ui mb-4">
              <Package size={16} className="inline mr-2 text-blue-600" />
              Recent Deliveries
            </h2>
            <div className="space-y-3">
              {recentDeliveries.map((supplier) => (
                <div key={supplier.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{supplier.name}</p>
                    <p className="text-xs text-muted-foreground">{supplier.lastDeliveryDate}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={12} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{supplier.leadTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Supplier Categories */}
          <div className="sphere-card p-5">
            <h2 className="text-[14px] font-semibold text-foreground tracking-tight-ui mb-4">Categories</h2>
            <div className="space-y-2">
              {["Electronics", "Furniture", "Raw Materials", "Software", "Services"].map((category) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-xs font-medium">{category}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary/60"
                        style={{ width: `${Math.random() * 60 + 20}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground tabular-nums w-4 text-right">
                      {Math.floor(Math.random() * 50 + 10)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reliability Overview */}
          <div className="sphere-card p-5">
            <h2 className="text-[14px] font-semibold text-foreground tracking-tight-ui mb-4">Reliability Overview</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Excellent (95%+)</span>
                <span className="text-xs font-semibold text-emerald-600">
                  {suppliers.filter(s => s.reliability >= 95).length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Good (85-94%)</span>
                <span className="text-xs font-semibold text-blue-600">
                  {suppliers.filter(s => s.reliability >= 85 && s.reliability < 95).length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Fair (70-84%)</span>
                <span className="text-xs font-semibold text-amber-600">
                  {suppliers.filter(s => s.reliability >= 70 && s.reliability < 85).length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Poor (&lt;70%)</span>
                <span className="text-xs font-semibold text-red-500">
                  {suppliers.filter(s => s.reliability < 70).length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Supplier Modal */}
      <AddSupplierModal
        open={addSupplierModalOpen}
        onOpenChange={setAddSupplierModalOpen}
        onSubmit={handleAddSupplier}
        isLoading={isLoading}
      />
    </AppLayout>
  );
}
