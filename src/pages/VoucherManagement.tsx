import { AppLayout } from "@/components/layout/AppLayout";
import { motion } from "framer-motion";
import {
  Ticket,
  Plus,
  Search,
  Filter,
  Download,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  BarChart3,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { VoucherCard } from "@/components/voucher/VoucherCard";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Voucher, VoucherUsage } from "@/types/voucher";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAudit } from "@/hooks/useAudit";
import { EntityType } from "@/types/audit";

// Mock data
const mockVouchers: Voucher[] = [
  {
    id: "VCH-001",
    code: "WELCOME2024",
    title: "Welcome Discount",
    description: "Special welcome discount for new employees on their first purchase",
    type: "discount",
    value: 15,
    valueType: "percentage",
    status: "active",
    issueDate: "2024-01-15",
    expiryDate: "2024-12-31",
    usageLimit: 100,
    usageCount: 23,
    conditions: [
      "Valid for first 3 months of employment",
      "Cannot be combined with other offers",
      "Maximum discount of $50 per transaction"
    ],
    createdBy: "HR Admin",
    createdAt: "2024-01-15T09:00:00Z",
    updatedAt: "2024-03-20T14:30:00Z"
  },
  {
    id: "VCH-002",
    code: "MEAL2024",
    title: "Meal Allowance",
    description: "Monthly meal allowance for all employees",
    type: "allowance",
    value: 200,
    valueType: "fixed",
    department: "All Departments",
    status: "active",
    issueDate: "2024-01-01",
    usageLimit: 12,
    usageCount: 3,
    conditions: [
      "Valid for one-time use per month",
      "Must be used by month end",
      "Valid at approved vendors only"
    ],
    createdBy: "HR Admin",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-03-25T10:15:00Z"
  },
  {
    id: "VCH-003",
    code: "HEALTHFIT",
    title: "Health & Fitness Benefit",
    description: "Gym membership and wellness program discount",
    type: "benefit",
    value: 50,
    valueType: "percentage",
    department: "All Departments",
    status: "active",
    issueDate: "2024-01-01",
    expiryDate: "2024-06-30",
    usageLimit: 1,
    usageCount: 45,
    conditions: [
      "Valid for approved fitness centers only",
      "Requires manager approval",
      "Annual benefit - one-time use"
    ],
    createdBy: "Wellness Coordinator",
    createdAt: "2024-01-01T08:00:00Z",
    updatedAt: "2024-03-18T16:45:00Z"
  },
  {
    id: "VCH-004",
    code: "TRAVEL2024",
    title: "Business Travel Reimbursement",
    description: "Reimbursement for approved business travel expenses",
    type: "reimbursement",
    value: 500,
    valueType: "fixed",
    department: "Sales",
    status: "active",
    issueDate: "2024-02-01",
    usageLimit: 4,
    usageCount: 1,
    conditions: [
      "Requires pre-approval for travel",
      "Valid receipts required",
      "Quarterly limit applies"
    ],
    createdBy: "Finance Manager",
    createdAt: "2024-02-01T11:30:00Z",
    updatedAt: "2024-03-22T09:20:00Z"
  },
  {
    id: "VCH-005",
    code: "EXPIRED2023",
    title: "Year-End Bonus",
    description: "Special year-end bonus voucher (expired)",
    type: "benefit",
    value: 100,
    valueType: "fixed",
    status: "expired",
    issueDate: "2023-12-01",
    expiryDate: "2023-12-31",
    usageLimit: 200,
    usageCount: 198,
    conditions: [
      "Valid for December 2023 only",
      "No extensions permitted",
      "Non-transferable"
    ],
    createdBy: "HR Admin",
    createdAt: "2023-12-01T00:00:00Z",
    updatedAt: "2023-12-31T23:59:00Z"
  }
];

const mockUsage: VoucherUsage[] = [
  {
    id: "USG-001",
    voucherId: "VCH-001",
    employeeId: "EMP-001",
    employeeName: "John Doe",
    usageDate: "2024-03-25",
    amountUsed: 45.50,
    transactionId: "TXN-12345",
    notes: "First purchase - office supplies"
  },
  {
    id: "USG-002",
    voucherId: "VCH-002",
    employeeId: "EMP-002",
    employeeName: "Jane Smith",
    usageDate: "2024-03-24",
    amountUsed: 200.00,
    transactionId: "TXN-12346",
    notes: "March meal allowance"
  }
];

export default function VoucherManagement() {
  const { logView, logCreate, logUpdate, logDelete, logExport, logActivate, logDeactivate } = useAudit();
  const [vouchers, setVouchers] = useState<Voucher[]>(mockVouchers);
  const [usage] = useState<VoucherUsage[]>(mockUsage);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUsageModal, setShowUsageModal] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);

  // Log page view
  useEffect(() => {
    logView(EntityType.VOUCHER, undefined, "Voucher Management");
  }, [logView]);

  // Calculate statistics
  const activeVouchers = vouchers.filter(v => v.status === "active");
  const expiredVouchers = vouchers.filter(v => v.status === "expired");
  const usedVouchers = vouchers.filter(v => v.status === "used");
  const totalValue = vouchers.reduce((sum, v) => sum + v.value, 0);
  const totalUsage = vouchers.reduce((sum, v) => sum + v.usageCount, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const filteredVouchers = vouchers.filter(voucher => {
    const matchesSearch = voucher.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         voucher.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         voucher.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || voucher.status === selectedStatus;
    const matchesType = selectedType === "all" || voucher.type === selectedType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleEdit = (voucher: Voucher) => {
    setSelectedVoucher(voucher);
    setShowCreateModal(true);
    logView(EntityType.VOUCHER, voucher.id, voucher.title);
  };

  const handleDelete = (voucher: Voucher) => {
    if (confirm(`Are you sure you want to delete voucher "${voucher.title}"?`)) {
      setVouchers(prev => prev.filter(v => v.id !== voucher.id));
      logDelete(EntityType.VOUCHER, voucher.id, voucher.title, voucher);
    }
  };

  const handleViewUsage = (voucher: Voucher) => {
    setSelectedVoucher(voucher);
    setShowUsageModal(true);
    logView(EntityType.VOUCHER, voucher.id, `${voucher.title} - Usage Details`);
  };

  const handleToggleStatus = (voucher: Voucher) => {
    const newStatus = voucher.status === "active" ? "inactive" : "active";
    const oldStatus = voucher.status;
    
    setVouchers(prev => prev.map(v => 
      v.id === voucher.id 
        ? { ...v, status: newStatus, updatedAt: new Date().toISOString() }
        : v
    ));

    // Log the status change
    if (newStatus === "active") {
      logActivate(EntityType.VOUCHER, voucher.id, voucher.title);
    } else {
      logDeactivate(EntityType.VOUCHER, voucher.id, voucher.title);
    }

    logUpdate(EntityType.VOUCHER, voucher.id, voucher.title, 
      { status: oldStatus }, 
      { status: newStatus }
    );
  };

  const handleCreateVoucher = () => {
    setSelectedVoucher(null);
    setShowCreateModal(true);
    logView(EntityType.VOUCHER, undefined, "Create New Voucher");
  };

  return (
    <AppLayout title="Voucher Management" subtitle="Manage employee vouchers and benefits">
      {/* Statistics Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle size={16} className="text-green-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Active Vouchers</p>
            </div>
          </div>
          <div className="text-xl font-bold text-green-600 tabular-nums">
            {activeVouchers.length}
          </div>
          <p className="text-xs text-green-600 mt-1">Currently available</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
              <XCircle size={16} className="text-red-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Expired Vouchers</p>
            </div>
          </div>
          <div className="text-xl font-bold text-red-600 tabular-nums">
            {expiredVouchers.length}
          </div>
          <p className="text-xs text-red-600 mt-1">No longer valid</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <TrendingUp size={16} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Usage</p>
            </div>
          </div>
          <div className="text-xl font-bold text-blue-600 tabular-nums">
            {totalUsage}
          </div>
          <p className="text-xs text-blue-600 mt-1">Times used</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
              <DollarSign size={16} className="text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Value</p>
            </div>
          </div>
          <div className="text-xl font-bold text-purple-600 tabular-nums">
            {formatCurrency(totalValue)}
          </div>
          <p className="text-xs text-purple-600 mt-1">Combined value</p>
        </Card>
      </div>

      {/* Controls */}
      <Card className="p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[14px] font-semibold text-foreground tracking-tight-ui">Voucher Inventory</h2>
            <p className="text-[12px] text-muted-foreground mt-1">Manage and track all employee vouchers</p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleCreateVoucher} size="sm">
              <Plus size={14} className="mr-1" />
              Create Voucher
            </Button>
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
      </Card>

      {/* Search and Filters */}
      <Card className="p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-2.5 text-muted-foreground" />
            <Input
              placeholder="Search vouchers by title, code, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-xs"
            />
          </div>
          
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs px-3 py-1.5 rounded border bg-background"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="expired">Expired</option>
            <option value="used">Used</option>
          </select>
          
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="text-xs px-3 py-1.5 rounded border bg-background"
          >
            <option value="all">All Types</option>
            <option value="discount">Discount</option>
            <option value="benefit">Benefit</option>
            <option value="allowance">Allowance</option>
            <option value="reimbursement">Reimbursement</option>
          </select>
          
          <Button variant="outline" size="sm">
            <Filter size={14} className="mr-1" />
            Advanced Filters
          </Button>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Total: {filteredVouchers.length}
            </Badge>
            <Badge variant="outline" className="text-xs text-green-600">
              Active: {activeVouchers.length}
            </Badge>
            <Badge variant="outline" className="text-xs text-red-600">
              Expired: {expiredVouchers.length}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Voucher List */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[14px] font-semibold text-foreground">Voucher List</h3>
            <p className="text-[12px] text-muted-foreground mt-1">
              Showing {filteredVouchers.length} of {vouchers.length} vouchers
            </p>
          </div>
          <Button variant="outline" size="sm">
            <BarChart3 size={14} className="mr-1" />
            Generate Report
          </Button>
        </div>

        <div className="space-y-3">
          {filteredVouchers.map((voucher, index) => (
            <motion.div
              key={voucher.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <VoucherCard
                voucher={voucher}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onViewUsage={handleViewUsage}
                onToggleStatus={handleToggleStatus}
              />
            </motion.div>
          ))}
        </div>

        {filteredVouchers.length === 0 && (
          <div className="text-center py-8">
            <Ticket size={48} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No vouchers found</p>
            <Button onClick={handleCreateVoucher} className="mt-4">
              <Plus size={14} className="mr-1" />
              Create Your First Voucher
            </Button>
          </div>
        )}
      </Card>
    </AppLayout>
  );
}
