import { AppLayout } from "@/components/layout/AppLayout";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  Calendar,
  DollarSign,
  Target,
  TrendingUp,
  Users,
  Building,
  Save,
  Edit,
  Trash2,
  Copy,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BudgetPlanCard } from "@/components/budget/BudgetPlanCard";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Mock data
const budgetPlans = [
  {
    id: "BP-2024-001",
    name: "Q2 2024 Marketing Budget",
    department: "Marketing",
    category: "Marketing",
    totalAmount: 200000,
    allocatedAmount: 180000,
    status: "draft" as const,
    period: "Q2 2024",
    startDate: "2024-04-01",
    endDate: "2024-06-30",
    createdBy: "Sarah Johnson",
    createdAt: "2024-03-20T10:00:00Z",
    approvedBy: null,
    approvedAt: null,
    items: [
      {
        id: "item-1",
        name: "Digital Advertising",
        budgetedAmount: 80000,
        description: "Google Ads, Facebook Ads, LinkedIn campaigns"
      },
      {
        id: "item-2",
        name: "Content Creation",
        budgetedAmount: 50000,
        description: "Blog posts, videos, infographics"
      },
      {
        id: "item-3",
        name: "Trade Shows",
        budgetedAmount: 50000,
        description: "Industry conferences and exhibitions"
      }
    ]
  },
  {
    id: "BP-2024-002",
    name: "Q2 2024 IT Infrastructure",
    department: "IT",
    category: "Technology",
    totalAmount: 150000,
    allocatedAmount: 150000,
    status: "approved" as const,
    period: "Q2 2024",
    startDate: "2024-04-01",
    endDate: "2024-06-30",
    createdBy: "Mike Wilson",
    createdAt: "2024-03-18T14:30:00Z",
    approvedBy: "John Smith",
    approvedAt: "2024-03-22T09:15:00Z",
    items: [
      {
        id: "item-4",
        name: "Server Upgrades",
        budgetedAmount: 60000,
        description: "Hardware and software upgrades"
      },
      {
        id: "item-5",
        name: "Cloud Services",
        budgetedAmount: 45000,
        description: "AWS, Azure, and other cloud subscriptions"
      },
      {
        id: "item-6",
        name: "Security Software",
        budgetedAmount: 45000,
        description: "Antivirus, firewall, and security tools"
      }
    ]
  },
  {
    id: "BP-2024-003",
    name: "Q2 2024 Sales Expenses",
    department: "Sales",
    category: "Sales",
    totalAmount: 120000,
    allocatedAmount: 100000,
    status: "pending_approval" as const,
    period: "Q2 2024",
    startDate: "2024-04-01",
    endDate: "2024-06-30",
    createdBy: "Emily Brown",
    createdAt: "2024-03-15T11:20:00Z",
    approvedBy: null,
    approvedAt: null,
    items: [
      {
        id: "item-7",
        name: "Travel Expenses",
        budgetedAmount: 40000,
        description: "Client meetings and business trips"
      },
      {
        id: "item-8",
        name: "Sales Tools",
        budgetedAmount: 30000,
        description: "CRM software and sales automation"
      },
      {
        id: "item-9",
        name: "Commission Bonuses",
        budgetedAmount: 30000,
        description: "Performance-based commissions"
      }
    ]
  },
  {
    id: "BP-2024-004",
    name: "Q2 2024 HR Development",
    department: "Human Resources",
    category: "Training",
    totalAmount: 75000,
    allocatedAmount: 75000,
    status: "approved" as const,
    period: "Q2 2024",
    startDate: "2024-04-01",
    endDate: "2024-06-30",
    createdBy: "Lisa Chen",
    createdAt: "2024-03-12T16:45:00Z",
    approvedBy: "John Smith",
    approvedAt: "2024-03-19T13:30:00Z",
    items: [
      {
        id: "item-10",
        name: "Training Programs",
        budgetedAmount: 35000,
        description: "Employee skill development courses"
      },
      {
        id: "item-11",
        name: "Team Building",
        budgetedAmount: 20000,
        description: "Corporate events and activities"
      },
      {
        id: "item-12",
        name: "Recruitment Costs",
        budgetedAmount: 20000,
        description: "Job postings and recruitment services"
      }
    ]
  }
];

const departments = [
  { id: "marketing", name: "Marketing", budget: 250000 },
  { id: "it", name: "IT", budget: 300000 },
  { id: "sales", name: "Sales", budget: 200000 },
  { id: "hr", name: "Human Resources", budget: 150000 },
  { id: "admin", name: "Administration", budget: 100000 }
];

export default function BudgetPlanning() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const draftPlans = budgetPlans.filter(p => p.status === 'draft');
  const pendingPlans = budgetPlans.filter(p => p.status === 'pending_approval');
  const approvedPlans = budgetPlans.filter(p => p.status === 'approved');
  const totalAllocated = budgetPlans.reduce((sum, p) => sum + p.allocatedAmount, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "pending_approval":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "approved":
        return "bg-green-100 text-green-700 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <AppLayout title="Budget Planning" subtitle="Create and allocate budgets for departments and projects">
      {/* Planning Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="sphere-card p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <Target size={16} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Plans</p>
            </div>
          </div>
          <div className="text-xl font-bold text-foreground tabular-nums">{budgetPlans.length}</div>
          <p className="text-xs text-muted-foreground mt-1">Q2 2024</p>
        </div>

        <div className="sphere-card p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
              <Edit size={16} className="text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Draft Plans</p>
            </div>
          </div>
          <div className="text-xl font-bold text-foreground tabular-nums">{draftPlans.length}</div>
          <p className="text-xs text-amber-600 mt-1">In progress</p>
        </div>

        <div className="sphere-card p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
              <Calendar size={16} className="text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Pending Approval</p>
            </div>
          </div>
          <div className="text-xl font-bold text-foreground tabular-nums">{pendingPlans.length}</div>
          <p className="text-xs text-purple-600 mt-1">Awaiting review</p>
        </div>

        <div className="sphere-card p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
              <DollarSign size={16} className="text-green-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Allocated</p>
            </div>
          </div>
          <div className="text-xl font-bold text-foreground tabular-nums">
            {formatCurrency(totalAllocated)}
          </div>
          <p className="text-xs text-green-600 mt-1">Approved budgets</p>
        </div>
      </div>

      {/* Department Budget Overview */}
      <div className="sphere-card p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[14px] font-semibold text-foreground">Department Budget Capacity</h3>
            <p className="text-[12px] text-muted-foreground mt-1">Available budget limits by department</p>
          </div>
          <Button variant="outline" size="sm">
            <Edit size={14} className="mr-1" />
            Edit Limits
          </Button>
        </div>

        <div className="grid grid-cols-5 gap-4">
          {departments.map((dept, index) => (
            <motion.div
              key={dept.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="sphere-card p-3"
            >
              <div className="flex items-center gap-2 mb-2">
                <Building size={14} className="text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">{dept.name}</span>
              </div>
              <div className="text-lg font-bold text-foreground tabular-nums">
                {formatCurrency(dept.budget)}
              </div>
              <div className="text-xs text-muted-foreground">Q2 Limit</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="sphere-card p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[14px] font-semibold text-foreground tracking-tight-ui">Budget Planning</h2>
            <p className="text-[12px] text-muted-foreground mt-1">Create and manage budget plans</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Copy size={14} className="mr-1" />
              Copy Plan
            </Button>
            <Button variant="outline" size="sm">
              <TrendingUp size={14} className="mr-1" />
              Templates
            </Button>
            <Button size="sm">
              <Plus size={14} className="mr-1" />
              New Budget Plan
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
              placeholder="Search budget plans by name, department, or status..."
              className="pl-10 text-xs"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter size={14} className="mr-1" />
            Filters
          </Button>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              All: {budgetPlans.length}
            </Badge>
            <Badge variant="outline" className="text-xs text-amber-600">
              Draft: {draftPlans.length}
            </Badge>
            <Badge variant="outline" className="text-xs text-purple-600">
              Pending: {pendingPlans.length}
            </Badge>
            <Badge variant="outline" className="text-xs text-green-600">
              Approved: {approvedPlans.length}
            </Badge>
          </div>
        </div>
      </div>

      {/* Budget Plans List */}
      <div className="sphere-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[14px] font-semibold text-foreground">Budget Plans</h3>
            <p className="text-[12px] text-muted-foreground mt-1">Q2 2024 budget planning and allocation</p>
          </div>
          <Button variant="outline" size="sm">
            <Eye size={14} className="mr-1" />
            View All Plans
          </Button>
        </div>

        <div className="space-y-3">
          {budgetPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <BudgetPlanCard
                plan={plan}
                isSelected={selectedPlan === plan.id}
                onSelect={() => setSelectedPlan(plan.id)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
