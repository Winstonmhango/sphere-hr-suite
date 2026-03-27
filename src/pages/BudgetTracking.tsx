import { AppLayout } from "@/components/layout/AppLayout";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Target,
  DollarSign,
  Calendar,
  Search,
  Filter,
  Eye,
  Download,
  BarChart3,
  PieChart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BudgetTrackingCard } from "@/components/budget/BudgetTrackingCard";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Mock data
const budgetTracking = [
  {
    id: "BT-001",
    budgetName: "Marketing Campaign Q1",
    department: "Marketing",
    category: "Marketing",
    budgetedAmount: 150000,
    actualAmount: 125000,
    remainingAmount: 25000,
    spentPercentage: 83.3,
    variance: -16.7,
    varianceType: "favorable" as const,
    period: "Q1 2024",
    lastUpdated: "2024-03-25",
    status: "on_track" as const,
    transactions: 45,
    monthlyTrend: [
      { month: "Jan", budgeted: 50000, actual: 45000 },
      { month: "Feb", budgeted: 50000, actual: 48000 },
      { month: "Mar", budgeted: 50000, actual: 32000 }
    ]
  },
  {
    id: "BT-002",
    budgetName: "Software Development",
    department: "IT",
    category: "Technology",
    budgetedAmount: 200000,
    actualAmount: 185000,
    remainingAmount: 15000,
    spentPercentage: 92.5,
    variance: -7.5,
    varianceType: "favorable" as const,
    period: "Q1 2024",
    lastUpdated: "2024-03-24",
    status: "on_track" as const,
    transactions: 28,
    monthlyTrend: [
      { month: "Jan", budgeted: 66667, actual: 62000 },
      { month: "Feb", budgeted: 66667, actual: 65000 },
      { month: "Mar", budgeted: 66667, actual: 58000 }
    ]
  },
  {
    id: "BT-003",
    budgetName: "Office Operations",
    department: "Administration",
    category: "Operations",
    budgetedAmount: 80000,
    actualAmount: 85000,
    remainingAmount: -5000,
    spentPercentage: 106.3,
    variance: 6.3,
    varianceType: "unfavorable" as const,
    period: "Q1 2024",
    lastUpdated: "2024-03-25",
    status: "over_budget" as const,
    transactions: 67,
    monthlyTrend: [
      { month: "Jan", budgeted: 26667, actual: 28000 },
      { month: "Feb", budgeted: 26667, actual: 27000 },
      { month: "Mar", budgeted: 26667, actual: 30000 }
    ]
  },
  {
    id: "BT-004",
    budgetName: "Sales Team Expenses",
    department: "Sales",
    category: "Sales",
    budgetedAmount: 120000,
    actualAmount: 95000,
    remainingAmount: 25000,
    spentPercentage: 79.2,
    variance: -20.8,
    varianceType: "favorable" as const,
    period: "Q1 2024",
    lastUpdated: "2024-03-23",
    status: "on_track" as const,
    transactions: 34,
    monthlyTrend: [
      { month: "Jan", budgeted: 40000, actual: 32000 },
      { month: "Feb", budgeted: 40000, actual: 33000 },
      { month: "Mar", budgeted: 40000, actual: 30000 }
    ]
  },
  {
    id: "BT-005",
    budgetName: "HR Training Program",
    department: "Human Resources",
    category: "Training",
    budgetedAmount: 50000,
    actualAmount: 45000,
    remainingAmount: 5000,
    spentPercentage: 90.0,
    variance: -10.0,
    varianceType: "favorable" as const,
    period: "Q1 2024",
    lastUpdated: "2024-03-22",
    status: "on_track" as const,
    transactions: 12,
    monthlyTrend: [
      { month: "Jan", budgeted: 16667, actual: 15000 },
      { month: "Feb", budgeted: 16667, actual: 15000 },
      { month: "Mar", budgeted: 16667, actual: 15000 }
    ]
  }
];

export default function BudgetTracking() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("Q1 2024");

  const onTrackBudgets = budgetTracking.filter(b => b.status === 'on_track');
  const overBudgetBudgets = budgetTracking.filter(b => b.status === 'over_budget');
  const totalBudgeted = budgetTracking.reduce((sum, b) => sum + b.budgetedAmount, 0);
  const totalSpent = budgetTracking.reduce((sum, b) => sum + b.actualAmount, 0);
  const totalRemaining = budgetTracking.reduce((sum, b) => sum + b.remainingAmount, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Math.abs(amount));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "on_track":
        return "bg-green-100 text-green-700 border-green-200";
      case "over_budget":
        return "bg-red-100 text-red-700 border-red-200";
      case "at_risk":
        return "bg-amber-100 text-amber-700 border-amber-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <AppLayout title="Budget Tracking" subtitle="Monitor actual spending against budgeted amounts">
      {/* Tracking Overview */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="sphere-card p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <Target size={16} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Budgeted</p>
            </div>
          </div>
          <div className="text-xl font-bold text-foreground tabular-nums">
            {formatCurrency(totalBudgeted)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Q1 2024</p>
        </div>

        <div className="sphere-card p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
              <DollarSign size={16} className="text-red-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Spent</p>
            </div>
          </div>
          <div className="text-xl font-bold text-foreground tabular-nums">
            {formatCurrency(totalSpent)}
          </div>
          <p className="text-xs text-red-600 mt-1">{((totalSpent / totalBudgeted) * 100).toFixed(1)}% used</p>
        </div>

        <div className="sphere-card p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
              <TrendingDown size={16} className="text-green-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Remaining</p>
            </div>
          </div>
          <div className={cn(
            "text-xl font-bold tabular-nums",
            totalRemaining < 0 ? "text-red-600" : "text-green-600"
          )}>
            {formatCurrency(totalRemaining)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {totalRemaining >= 0 ? "Available" : "Over budget"}
          </p>
        </div>

        <div className="sphere-card p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
              <BarChart3 size={16} className="text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Budget Status</p>
            </div>
          </div>
          <div className="text-xl font-bold text-foreground tabular-nums">
            {onTrackBudgets.length}/{budgetTracking.length}
          </div>
          <p className="text-xs text-green-600 mt-1">On track</p>
        </div>
      </div>

      {/* Alerts */}
      {overBudgetBudgets.length > 0 && (
        <div className="sphere-card p-4 mb-6 border-l-4 border-red-500">
          <div className="flex items-center gap-3">
            <AlertTriangle size={20} className="text-red-500" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-foreground">Budget Alert</h3>
              <p className="text-xs text-muted-foreground">
                {overBudgetBudgets.length} budget(s) have exceeded their allocated amount
              </p>
            </div>
            <Button variant="outline" size="sm">
              Review Details
            </Button>
          </div>
        </div>
      )}

      {/* Period Selection and Actions */}
      <div className="sphere-card p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[14px] font-semibold text-foreground tracking-tight-ui">Budget Monitoring</h2>
            <p className="text-[12px] text-muted-foreground mt-1">Track spending and budget performance</p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="text-xs px-3 py-1.5 rounded border bg-background"
            >
              <option value="Q1 2024">Q1 2024</option>
              <option value="Q4 2023">Q4 2023</option>
              <option value="Q3 2023">Q3 2023</option>
              <option value="Q2 2023">Q2 2023</option>
            </select>
            <Button variant="outline" size="sm">
              <PieChart size={14} className="mr-1" />
              Analytics
            </Button>
            <Button variant="outline" size="sm">
              <Download size={14} className="mr-1" />
              Export Report
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
              placeholder="Search budgets by name, department, or status..."
              className="pl-10 text-xs"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter size={14} className="mr-1" />
            Filters
          </Button>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              All: {budgetTracking.length}
            </Badge>
            <Badge variant="outline" className="text-xs text-green-600">
              On Track: {onTrackBudgets.length}
            </Badge>
            <Badge variant="outline" className="text-xs text-red-600">
              Over Budget: {overBudgetBudgets.length}
            </Badge>
          </div>
        </div>
      </div>

      {/* Budget Tracking List */}
      <div className="sphere-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[14px] font-semibold text-foreground">Budget Performance</h3>
            <p className="text-[12px] text-muted-foreground mt-1">
              Period: {selectedPeriod}
            </p>
          </div>
          <Button variant="outline" size="sm">
            <Eye size={14} className="mr-1" />
            View Details
          </Button>
        </div>

        <div className="space-y-3">
          {budgetTracking.map((budget, index) => (
            <motion.div
              key={budget.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <BudgetTrackingCard budget={budget} />
            </motion.div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
