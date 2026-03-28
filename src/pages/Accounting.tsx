import { AppLayout } from "@/components/layout/AppLayout";
import { motion } from "framer-motion";
import {
  Calculator,
  FileText,
  TrendingUp,
  Scale,
  Receipt,
  DollarSign,
  AlertTriangle,
  ArrowUpRight,
  Plus,
  Search,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AccountingStatCard } from "@/components/accounting/AccountingStatCard";
import { TransactionCard } from "@/components/accounting/TransactionCard";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Mock data
const accountingStats = [
  {
    label: "Total Revenue",
    value: "$284,650",
    change: "+12.5% vs last month",
    changeType: "positive" as const,
    icon: DollarSign,
    trend: "up" as const
  },
  {
    label: "Total Expenses",
    value: "$156,320",
    change: "+5.2% vs last month",
    changeType: "negative" as const,
    icon: Receipt,
    trend: "up" as const
  },
  {
    label: "Net Profit",
    value: "$128,330",
    change: "+18.7% vs last month",
    changeType: "positive" as const,
    icon: TrendingUp,
    trend: "up" as const
  },
  {
    label: "Cash Balance",
    value: "$425,890",
    change: "+8.3% vs last month",
    changeType: "positive" as const,
    icon: Scale,
    trend: "up" as const
  }
];

const recentTransactions = [
  {
    id: "1",
    date: "2024-03-25",
    description: "Salary Payments - March 2024",
    category: "Payroll",
    debit: 0,
    credit: 45680,
    account: "Salaries Expense",
    status: "completed" as const,
    reference: "PAY-2024-03-001"
  },
  {
    id: "2",
    date: "2024-03-24",
    description: "Office Rent Payment",
    category: "Operating Expenses",
    debit: 12000,
    credit: 0,
    account: "Rent Expense",
    status: "completed" as const,
    reference: "REN-2024-03-001"
  },
  {
    id: "3",
    date: "2024-03-23",
    description: "Client Payment - ABC Corp",
    category: "Revenue",
    debit: 0,
    credit: 28500,
    account: "Accounts Receivable",
    status: "completed" as const,
    reference: "INV-2024-03-042"
  },
  {
    id: "4",
    date: "2024-03-22",
    description: "Software Licenses",
    category: "Operating Expenses",
    debit: 2400,
    credit: 0,
    account: "Software Expenses",
    status: "pending" as const,
    reference: "SW-2024-03-001"
  },
  {
    id: "5",
    date: "2024-03-21",
    description: "Consulting Services",
    category: "Revenue",
    debit: 0,
    credit: 12500,
    account: "Service Revenue",
    status: "completed" as const,
    reference: "SRV-2024-03-008"
  }
];

export default function Accounting() {
  const [isLoading, setIsLoading] = useState(false);

  const totalRevenue = accountingStats[0].value;
  const totalExpenses = accountingStats[1].value;
  const netProfit = accountingStats[2].value;
  const cashBalance = accountingStats[3].value;

  return (
    <AppLayout title="Accounting" subtitle="Financial management and reporting">
      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {accountingStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <AccountingStatCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="sphere-card p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[14px] font-semibold text-foreground tracking-tight-ui">Quick Actions</h2>
            <p className="text-[12px] text-muted-foreground mt-1">Common accounting tasks</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <FileText size={14} className="mr-1" />
              New Journal Entry
            </Button>
            <Button variant="outline" size="sm">
              <Calculator size={14} className="mr-1" />
              Generate Report
            </Button>
            <Button size="sm">
              <Plus size={14} className="mr-1" />
              Record Transaction
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
              placeholder="Search transactions by description, reference, or account..."
              className="pl-10 text-xs"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter size={14} className="mr-1" />
            Filters
          </Button>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              All: {recentTransactions.length}
            </Badge>
            <Badge variant="outline" className="text-xs text-green-600">
              Completed: {recentTransactions.filter(t => t.status === 'completed').length}
            </Badge>
            <Badge variant="outline" className="text-xs text-amber-600">
              Pending: {recentTransactions.filter(t => t.status === 'pending').length}
            </Badge>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="sphere-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[14px] font-semibold text-foreground">Recent Transactions</h3>
            <p className="text-[12px] text-muted-foreground mt-1">Latest journal entries and transactions</p>
          </div>
          <Button variant="outline" size="sm">
            View All Transactions
          </Button>
        </div>

        <div className="space-y-3">
          {recentTransactions.map((transaction, index) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <TransactionCard transaction={transaction} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-3 gap-6 mt-6">
        <div className="sphere-card p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
              <TrendingUp size={16} className="text-emerald-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Profit Margin</h3>
              <p className="text-xs text-muted-foreground">Net profit percentage</p>
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground tabular-nums">45.1%</div>
          <div className="flex items-center gap-1 mt-2">
            <ArrowUpRight size={12} className="text-green-500" />
            <span className="text-xs text-green-500">+3.2% vs last month</span>
          </div>
        </div>

        <div className="sphere-card p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <Scale size={16} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Account Balance</h3>
              <p className="text-xs text-muted-foreground">Total across all accounts</p>
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground tabular-nums">{cashBalance}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Across 12 active accounts
          </p>
        </div>

        <div className="sphere-card p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
              <AlertTriangle size={16} className="text-amber-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Pending Items</h3>
              <p className="text-xs text-muted-foreground">Awaiting reconciliation</p>
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground tabular-nums">8</div>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-xs text-amber-600">Requires attention</span>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
