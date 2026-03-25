import { AppLayout } from "@/components/layout/AppLayout";
import { CustomerCard } from "@/components/crm/CustomerCard";
import { AddCustomerModal } from "@/components/crm/modals/AddCustomerModal";
import { motion } from "framer-motion";
import {
  Users,
  TrendingUp,
  DollarSign,
  Star,
  Search,
  Filter,
  Plus,
  Download,
  Mail,
  Phone,
  MapPin,
  Building2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { InventoryStatCard } from "@/components/inventory/InventoryStatCard";
import { useState } from "react";

// Mock data
const customerStats = [
  {
    label: "Total Customers",
    value: "1,247",
    change: "+23 this month",
    changeType: "positive" as const,
    icon: Users,
    trend: "up" as const
  },
  {
    label: "Active Customers",
    value: "892",
    change: "+15 this month",
    changeType: "positive" as const,
    icon: TrendingUp,
    trend: "up" as const
  },
  {
    label: "Total Revenue",
    value: "$2.4M",
    change: "+18.3% vs last month",
    changeType: "positive" as const,
    icon: DollarSign,
    trend: "up" as const
  },
  {
    label: "Avg Rating",
    value: "4.6",
    change: "+0.2 improvement",
    changeType: "positive" as const,
    icon: Star,
    trend: "up" as const
  }
];

const customers = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@acme.com",
    phone: "+1 (555) 123-4567",
    company: "Acme Corporation",
    address: "123 Business St, New York, NY 10001",
    status: "active" as const,
    totalOrders: 45,
    totalSpent: 125430,
    lastOrderDate: "2 days ago",
    rating: 5,
    joinDate: "Jan 15, 2024",
    trend: "up" as const
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.johnson@global.com",
    phone: "+1 (555) 987-6543",
    company: "Global Industries",
    address: "456 Commerce Ave, Los Angeles, CA 90001",
    status: "active" as const,
    totalOrders: 23,
    totalSpent: 78920,
    lastOrderDate: "1 week ago",
    rating: 4,
    joinDate: "Feb 20, 2024",
    trend: "stable" as const
  },
  {
    id: "3",
    name: "Michael Chen",
    email: "michael.chen@techsolutions.com",
    phone: "+1 (555) 456-7890",
    company: "Tech Solutions Ltd",
    address: "789 Innovation Dr, San Francisco, CA 94105",
    status: "prospect" as const,
    totalOrders: 0,
    totalSpent: 0,
    lastOrderDate: "Never",
    rating: 0,
    joinDate: "Mar 10, 2024",
    trend: "up" as const
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.davis@retailco.com",
    phone: "+1 (555) 234-5678",
    company: "Retail Co",
    address: "321 Market St, Chicago, IL 60601",
    status: "inactive" as const,
    totalOrders: 12,
    totalSpent: 34560,
    lastOrderDate: "3 months ago",
    rating: 3,
    joinDate: "Dec 5, 2023",
    trend: "down" as const
  }
];

const topCustomers = customers
  .filter(c => c.status === "active")
  .sort((a, b) => b.totalSpent - a.totalSpent)
  .slice(0, 3);

const recentCustomers = customers
  .sort((a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime())
  .slice(0, 3);

export default function Customers() {
  const [addCustomerModalOpen, setAddCustomerModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddCustomer = async (data: any) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Adding customer:", data);
    setIsLoading(false);
    setAddCustomerModalOpen(false);
  };

  return (
    <AppLayout title="Customer Management" subtitle="Manage your customer relationships">
      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {customerStats.map((stat, index) => (
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
            <p className="text-[12px] text-muted-foreground mt-1">Customer management tasks</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download size={14} className="mr-1" />
              Export
            </Button>
            <Button size="sm" onClick={() => setAddCustomerModalOpen(true)}>
              <Plus size={14} className="mr-1" />
              Add Customer
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
              placeholder="Search customers by name, company, or email..."
              className="pl-10 text-xs"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter size={14} className="mr-1" />
            Filters
          </Button>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Active: {customers.filter(c => c.status === "active").length}
            </Badge>
            <Badge variant="outline" className="text-xs">
              Prospects: {customers.filter(c => c.status === "prospect").length}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-6">
        {/* Customers List */}
        <div className="col-span-8">
          <div className="sphere-card p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-[14px] font-semibold text-foreground tracking-tight-ui">All Customers</h2>
                <p className="text-[12px] text-muted-foreground mt-1">Customer directory</p>
              </div>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {customers.map((customer, index) => (
                <motion.div
                  key={customer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <CustomerCard customer={customer} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-span-4 space-y-4">
          {/* Top Customers */}
          <div className="sphere-card p-5">
            <h2 className="text-[14px] font-semibold text-foreground tracking-tight-ui mb-4">
              <DollarSign size={16} className="inline mr-2 text-emerald-600" />
              Top Customers
            </h2>
            <div className="space-y-3">
              {topCustomers.map((customer, index) => (
                <div key={customer.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{customer.name}</p>
                    <p className="text-xs text-muted-foreground">{customer.company}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold tabular-nums">
                      ${(customer.totalSpent / 1000).toFixed(1)}k
                    </p>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={8}
                          className={i < customer.rating ? "text-amber-400 fill-amber-400" : "text-muted-foreground"}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Customers */}
          <div className="sphere-card p-5">
            <h2 className="text-[14px] font-semibold text-foreground tracking-tight-ui mb-4">
              <Users size={16} className="inline mr-2 text-blue-600" />
              Recent Customers
            </h2>
            <div className="space-y-3">
              {recentCustomers.map((customer) => (
                <div key={customer.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{customer.name}</p>
                    <p className="text-xs text-muted-foreground">Joined {customer.joinDate}</p>
                  </div>
                  <span className={cn(
                    "px-2 py-1 rounded text-xs font-medium",
                    customer.status === "active" ? "status-active" :
                    customer.status === "prospect" ? "status-pending" :
                    "status-inactive"
                  )}>
                    {customer.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Categories */}
          <div className="sphere-card p-5">
            <h2 className="text-[14px] font-semibold text-foreground tracking-tight-ui mb-4">Categories</h2>
            <div className="space-y-2">
              {["Retail", "Corporate", "Wholesale", "Government"].map((category) => (
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
                <span className="text-xs text-muted-foreground">New Customers</span>
                <span className="text-xs font-semibold text-emerald-600">+3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Orders Placed</span>
                <span className="text-xs font-semibold text-blue-600">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Revenue</span>
                <span className="text-xs font-semibold tabular-nums">$4,580</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Support Tickets</span>
                <span className="text-xs font-semibold text-amber-600">5</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Customer Modal */}
      <AddCustomerModal
        open={addCustomerModalOpen}
        onOpenChange={setAddCustomerModalOpen}
        onSubmit={handleAddCustomer}
        isLoading={isLoading}
      />
    </AppLayout>
  );
}
