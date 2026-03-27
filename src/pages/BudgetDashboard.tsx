import { AppLayout } from "@/components/layout/AppLayout";
import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  PieChart,
  BarChart3,
  Calendar,
  Plus,
  Search,
  Filter,
  Target,
  Wallet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BudgetStatCard } from "@/components/budget/BudgetStatCard";
import { BudgetCard } from "@/components/budget/BudgetCard";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Mock data
const budgetStats = [
  {
    label: "Total Budget",
    value: "$1,250,000",
    budgeted: "$1,250,000",
    actual: "$987,450",
    variance: -21.0,
    varianceType: "positive" as const,
    icon: Wallet,
    trend: "stable" as const
  },
  {
    label: "Spent This Month",
    value: "$82,340",
    budgeted: "$95,000",
    actual: "$82,340",
    variance: -13.3,
    varianceType: "positive" as const,
    icon: DollarSign,
    trend: "down" as const
  },
  {
    label: "Remaining Budget",
    value: "$262,550",
    budgeted: "$262,550",
    actual: "$0",
    variance: 0,
    varianceType: "neutral" as const,
    icon: Target,
    trend: "stable" as const
  },
  {
    label: "Budget Variance",
    value: "-8.7%",
    budgeted: "0%",
    actual: "-8.7%",
    variance: -8.7,
    varianceType: "positive" as const,
    icon: TrendingUp,
    trend: "up" as const
  }
];

const budgets = [
  {
    id: "1",
    name: "Marketing Campaign Q1",
    department: "Marketing",
    category: "Marketing",
    budgetedAmount: 150000,
    actualAmount: 125000,
    remainingAmount: 25000,
    period: "Q1 2024",
    startDate: "2024-01-01",
    endDate: "2024-03-31",
    status: "active" as const,
    variance: -16.7
  },
  {
    id: "2",
    name: "Software Development",
    department: "IT",
    category: "Technology",
    budgetedAmount: 200000,
    actualAmount: 185000,
    remainingAmount: 15000,
    period: "Q1 2024",
    startDate: "2024-01-01",
    endDate: "2024-03-31",
    status: "active" as const,
    variance: -7.5
  },
  {
    id: "3",
    name: "Office Operations",
    department: "Administration",
    category: "Operations",
    budgetedAmount: 80000,
    actualAmount: 85000,
    remainingAmount: -5000,
    period: "Q1 2024",
    startDate: "2024-01-01",
    endDate: "2024-03-31",
    status: "exceeded" as const,
    variance: 6.3
  },
  {
    id: "4",
    name: "Sales Team Expenses",
    department: "Sales",
    category: "Sales",
    budgetedAmount: 120000,
    actualAmount: 95000,
    remainingAmount: 25000,
    period: "Q1 2024",
    startDate: "2024-01-01",
    endDate: "2024-03-31",
    status: "active" as const,
    variance: -20.8
  },
  {
    id: "5",
    name: "HR Training Program",
    department: "Human Resources",
    category: "Training",
    budgetedAmount: 50000,
    actualAmount: 45000,
    remainingAmount: 5000,
    period: "Q1 2024",
    startDate: "2024-01-01",
    endDate: "2024-03-31",
    status: "active" as const,
    variance: -10.0
  },
  {
    id: "6",
    name: "Customer Support Tools",
    department: "Customer Service",
    category: "Technology",
    budgetedAmount: 75000,
    actualAmount: 72000,
    remainingAmount: 3000,
    period: "Q1 2024",
    startDate: "2024-01-01",
    endDate: "2024-03-31",
    status: "active" as const,
    variance: -4.0
  }
];

export default function BudgetDashboard() {
  const [isLoading, setIsLoading] = useState(false);

  const activeBudgets = budgets.filter(b => b.status === 'active');
  const exceededBudgets = budgets.filter(b => b.status === 'exceeded');
  const totalBudgeted = budgets.reduce((sum, b) => sum + b.budgetedAmount, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.actualAmount, 0);
  const totalRemaining = budgets.reduce((sum, b) => sum + b.remainingAmount, 0);

  return (
    <AppLayout title="Budget Dashboard" subtitle="Monitor and manage organizational budgets">
      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {budgetStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <BudgetStatCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Budget Alerts */}
      {exceededBudgets.length > 0 && (
        <div className="sphere-card p-4 mb-6 border-l-4 border-red-500">
          <div className="flex items-center gap-3">
            <AlertTriangle size={20} className="text-red-500" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-foreground">Budget Exceeded</h3>
              <p className="text-xs text-muted-foreground">
                {exceededBudgets.length} budget(s) have exceeded their allocated amount
              </p>
            </div>
            <Button variant="outline" size="sm">
              Review Details
            </Button>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="sphere-card p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[14px] font-semibold text-foreground tracking-tight-ui">Budget Management</h2>
            <p className="text-[12px] text-muted-foreground mt-1">Budget planning and operations</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <PieChart size={14} className="mr-1" />
              Analytics
            </Button>
            <Button variant="outline" size="sm">
              <BarChart3 size={14} className="mr-1" />
              Reports
            </Button>
            <Button size="sm">
              <Plus size={14} className="mr-1" />
              New Budget
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
              placeholder="Search budgets by name, department, or category..."
              className="pl-10 text-xs"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter size={14} className="mr-1" />
            Filters
          </Button>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Total: {budgets.length}
            </Badge>
            <Badge variant="outline" className="text-xs text-green-600">
              Active: {activeBudgets.length}
            </Badge>
            <Badge variant="outline" className="text-xs text-red-600">
              Exceeded: {exceededBudgets.length}
            </Badge>
          </div>
        </div>
      </div>

      {/* Budget Overview */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="sphere-card p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <Wallet size={16} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Budget Allocation</h3>
              <p className="text-xs text-muted-foreground">By department</p>
            </div>
          </div>
          
          <div className="space-y-2">
            {["Marketing", "IT", "Sales", "Administration", "HR"].map((dept, index) => {
              const deptBudgets = budgets.filter(b => b.department === dept);
              const deptTotal = deptBudgets.reduce((sum, b) => sum + b.budgetedAmount, 0);
              const percentage = (deptTotal / totalBudgeted) * 100;
              
              return (
                <div key={dept} className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-24">{dept}</span>
                  <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-blue-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium tabular-nums w-16 text-right">
                    {percentage.toFixed(1)}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="sphere-card p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
              <Target size={16} className="text-green-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Budget Performance</h3>
              <p className="text-xs text-muted-foreground">Variance analysis</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Under Budget</span>
              <span className="text-green-600 font-medium">
                {budgets.filter(b => b.variance < -5).length} budgets
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">On Track</span>
              <span className="text-blue-600 font-medium">
                {budgets.filter(b => Math.abs(b.variance) <= 5).length} budgets
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Over Budget</span>
              <span className="text-red-600 font-medium">
                {budgets.filter(b => b.variance > 5).length} budgets
              </span>
            </div>
            <div className="flex justify-between text-sm pt-2 border-t">
              <span className="text-muted-foreground">Total Saved</span>
              <span className="text-green-600 font-bold tabular-nums">
                ${Math.abs(totalRemaining).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Budget List */}
      <div className="sphere-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[14px] font-semibold text-foreground">Active Budgets</h3>
            <p className="text-[12px] text-muted-foreground mt-1">Current budget allocations and performance</p>
          </div>
          <Button variant="outline" size="sm">
            View All Budgets
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {budgets.map((budget, index) => (
            <motion.div
              key={budget.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <BudgetCard budget={budget} />
            </motion.div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
