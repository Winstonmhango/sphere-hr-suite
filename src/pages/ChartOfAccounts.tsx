import { AppLayout } from "@/components/layout/AppLayout";
import { motion } from "framer-motion";
import {
  FolderTree,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  ChevronRight,
  ChevronDown,
  Eye,
  Calculator
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AccountCard } from "@/components/accounting/AccountCard";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Mock data
const accounts = [
  {
    id: "1",
    code: "1000",
    name: "Assets",
    type: "balance-sheet" as const,
    category: "Asset Accounts",
    balance: 425890,
    subAccounts: [
      {
        id: "1-1",
        code: "1100",
        name: "Current Assets",
        type: "balance-sheet" as const,
        category: "Current Assets",
        balance: 285340,
        subAccounts: [
          {
            id: "1-1-1",
            code: "1110",
            name: "Cash and Cash Equivalents",
            type: "balance-sheet" as const,
            category: "Cash",
            balance: 125890,
            description: "Bank accounts and petty cash"
          },
          {
            id: "1-1-2",
            code: "1120",
            name: "Accounts Receivable",
            type: "balance-sheet" as const,
            category: "Receivables",
            balance: 95450,
            description: "Amounts owed by customers"
          },
          {
            id: "1-1-3",
            code: "1130",
            name: "Inventory",
            type: "balance-sheet" as const,
            category: "Inventory",
            balance: 64000,
            description: "Raw materials and finished goods"
          }
        ]
      },
      {
        id: "1-2",
        code: "1200",
        name: "Fixed Assets",
        type: "balance-sheet" as const,
        category: "Fixed Assets",
        balance: 140550,
        subAccounts: [
          {
            id: "1-2-1",
            code: "1210",
            name: "Property, Plant & Equipment",
            type: "balance-sheet" as const,
            category: "PPE",
            balance: 185550,
            description: "Buildings, machinery, and equipment"
          },
          {
            id: "1-2-2",
            code: "1220",
            name: "Accumulated Depreciation",
            type: "balance-sheet" as const,
            category: "Contra-Asset",
            balance: -45000,
            description: "Depreciation on fixed assets"
          }
        ]
      }
    ]
  },
  {
    id: "2",
    code: "2000",
    name: "Liabilities",
    type: "balance-sheet" as const,
    category: "Liability Accounts",
    balance: 156320,
    subAccounts: [
      {
        id: "2-1",
        code: "2100",
        name: "Current Liabilities",
        type: "balance-sheet" as const,
        category: "Current Liabilities",
        balance: 89670,
        subAccounts: [
          {
            id: "2-1-1",
            code: "2110",
            name: "Accounts Payable",
            type: "balance-sheet" as const,
            category: "Payables",
            balance: 45670,
            description: "Amounts owed to suppliers"
          },
          {
            id: "2-1-2",
            code: "2120",
            name: "Accrued Expenses",
            type: "balance-sheet" as const,
            category: "Accrued",
            balance: 24000,
            description: "Expenses incurred but not yet paid"
          },
          {
            id: "2-1-3",
            code: "2130",
            name: "Taxes Payable",
            type: "balance-sheet" as const,
            category: "Taxes",
            balance: 20000,
            description: "Income and payroll taxes"
          }
        ]
      },
      {
        id: "2-2",
        code: "2200",
        name: "Long-term Liabilities",
        type: "balance-sheet" as const,
        category: "Long-term Liabilities",
        balance: 66650,
        subAccounts: [
          {
            id: "2-2-1",
            code: "2210",
            name: "Bank Loans",
            type: "balance-sheet" as const,
            category: "Loans",
            balance: 50000,
            description: "Long-term bank financing"
          },
          {
            id: "2-2-2",
            code: "2220",
            name: "Equipment Financing",
            type: "balance-sheet" as const,
            category: "Financing",
            balance: 16650,
            description: "Equipment purchase financing"
          }
        ]
      }
    ]
  },
  {
    id: "3",
    code: "3000",
    name: "Equity",
    type: "balance-sheet" as const,
    category: "Equity Accounts",
    balance: 269570,
    subAccounts: [
      {
        id: "3-1",
        code: "3100",
        name: "Owner's Equity",
        type: "balance-sheet" as const,
        category: "Owner Equity",
        balance: 200000,
        description: "Initial capital and investments"
      },
      {
        id: "3-2",
        code: "3200",
        name: "Retained Earnings",
        type: "balance-sheet" as const,
        category: "Retained Earnings",
        balance: 69570,
        description: "Accumulated profits"
      }
    ]
  },
  {
    id: "4",
    code: "4000",
    name: "Revenue",
    type: "income-statement" as const,
    category: "Revenue Accounts",
    balance: 284650,
    subAccounts: [
      {
        id: "4-1",
        code: "4100",
        name: "Service Revenue",
        type: "income-statement" as const,
        category: "Services",
        balance: 185650,
        description: "Consulting and service fees"
      },
      {
        id: "4-2",
        code: "4200",
        name: "Product Sales",
        type: "income-statement" as const,
        category: "Sales",
        balance: 99000,
        description: "Product and merchandise sales"
      }
    ]
  },
  {
    id: "5",
    code: "5000",
    name: "Expenses",
    type: "income-statement" as const,
    category: "Expense Accounts",
    balance: 156320,
    subAccounts: [
      {
        id: "5-1",
        code: "5100",
        name: "Operating Expenses",
        type: "income-statement" as const,
        category: "Operating",
        balance: 110640,
        subAccounts: [
          {
            id: "5-1-1",
            code: "5110",
            name: "Salaries and Wages",
            type: "income-statement" as const,
            category: "Payroll",
            balance: 45680,
            description: "Employee salaries and wages"
          },
          {
            id: "5-1-2",
            code: "5120",
            name: "Rent Expense",
            type: "income-statement" as const,
            category: "Rent",
            balance: 12000,
            description: "Office and facility rent"
          },
          {
            id: "5-1-3",
            code: "5130",
            name: "Utilities",
            type: "income-statement" as const,
            category: "Utilities",
            balance: 8960,
            description: "Electricity, water, and internet"
          }
        ]
      },
      {
        id: "5-2",
        code: "5200",
        name: "Administrative Expenses",
        type: "income-statement" as const,
        category: "Administrative",
        balance: 45680,
        subAccounts: [
          {
            id: "5-2-1",
            code: "5210",
            name: "Office Supplies",
            type: "income-statement" as const,
            category: "Supplies",
            balance: 2400,
            description: "Office supplies and materials"
          },
          {
            id: "5-2-2",
            code: "5220",
            name: "Software Licenses",
            type: "income-statement" as const,
            category: "Software",
            balance: 2400,
            description: "Software subscriptions and licenses"
          }
        ]
      }
    ]
  }
];

export default function ChartOfAccounts() {
  const [expandedAccounts, setExpandedAccounts] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  const toggleExpanded = (accountId: string) => {
    const newExpanded = new Set(expandedAccounts);
    if (newExpanded.has(accountId)) {
      newExpanded.delete(accountId);
    } else {
      newExpanded.add(accountId);
    }
    setExpandedAccounts(newExpanded);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Math.abs(amount));
  };

  const renderAccount = (account: any, level: number = 0) => {
    const isExpanded = expandedAccounts.has(account.id);
    const hasSubAccounts = account.subAccounts && account.subAccounts.length > 0;
    const indent = level * 24;

    return (
      <div key={account.id} className="w-full">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: level * 0.05 }}
        >
          <AccountCard
            account={account}
            level={level}
            isExpanded={isExpanded}
            hasSubAccounts={hasSubAccounts}
            onToggleExpand={() => toggleExpanded(account.id)}
          />
        </motion.div>
        
        {hasSubAccounts && isExpanded && (
          <div className="ml-6 mt-2 space-y-2">
            {account.subAccounts.map((subAccount: any) => 
              renderAccount(subAccount, level + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  const totalAssets = accounts.find(a => a.name === "Assets")?.balance || 0;
  const totalLiabilities = accounts.find(a => a.name === "Liabilities")?.balance || 0;
  const totalEquity = accounts.find(a => a.name === "Equity")?.balance || 0;
  const totalRevenue = accounts.find(a => a.name === "Revenue")?.balance || 0;
  const totalExpenses = accounts.find(a => a.name === "Expenses")?.balance || 0;

  return (
    <AppLayout title="Chart of Accounts" subtitle="Manage account structure and balances">
      {/* Summary Stats */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="sphere-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center">
              <Calculator size={12} className="text-blue-600" />
            </div>
            <span className="text-xs text-muted-foreground">Total Assets</span>
          </div>
          <div className="text-lg font-bold text-foreground tabular-nums">
            {formatCurrency(totalAssets)}
          </div>
        </div>
        
        <div className="sphere-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded bg-red-100 flex items-center justify-center">
              <Calculator size={12} className="text-red-600" />
            </div>
            <span className="text-xs text-muted-foreground">Total Liabilities</span>
          </div>
          <div className="text-lg font-bold text-foreground tabular-nums">
            {formatCurrency(totalLiabilities)}
          </div>
        </div>
        
        <div className="sphere-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded bg-green-100 flex items-center justify-center">
              <Calculator size={12} className="text-green-600" />
            </div>
            <span className="text-xs text-muted-foreground">Total Equity</span>
          </div>
          <div className="text-lg font-bold text-foreground tabular-nums">
            {formatCurrency(totalEquity)}
          </div>
        </div>
        
        <div className="sphere-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded bg-emerald-100 flex items-center justify-center">
              <Calculator size={12} className="text-emerald-600" />
            </div>
            <span className="text-xs text-muted-foreground">Total Revenue</span>
          </div>
          <div className="text-lg font-bold text-foreground tabular-nums">
            {formatCurrency(totalRevenue)}
          </div>
        </div>
        
        <div className="sphere-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded bg-orange-100 flex items-center justify-center">
              <Calculator size={12} className="text-orange-600" />
            </div>
            <span className="text-xs text-muted-foreground">Total Expenses</span>
          </div>
          <div className="text-lg font-bold text-foreground tabular-nums">
            {formatCurrency(totalExpenses)}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="sphere-card p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[14px] font-semibold text-foreground tracking-tight-ui">Account Management</h2>
            <p className="text-[12px] text-muted-foreground mt-1">Chart of accounts operations</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Eye size={14} className="mr-1" />
              Trial Balance
            </Button>
            <Button variant="outline" size="sm">
              <Calculator size={14} className="mr-1" />
              Reconcile
            </Button>
            <Button size="sm">
              <Plus size={14} className="mr-1" />
              New Account
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
              placeholder="Search accounts by name, code, or description..."
              className="pl-10 text-xs"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter size={14} className="mr-1" />
            Filters
          </Button>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Total: {accounts.length}
            </Badge>
            <Badge variant="outline" className="text-xs text-blue-600">
              Assets: 1
            </Badge>
            <Badge variant="outline" className="text-xs text-red-600">
              Liabilities: 1
            </Badge>
          </div>
        </div>
      </div>

      {/* Accounts Tree */}
      <div className="sphere-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[14px] font-semibold text-foreground">Account Structure</h3>
            <p className="text-[12px] text-muted-foreground mt-1">Hierarchical view of all accounts</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setExpandedAccounts(new Set(accounts.map(a => a.id)))}>
              Expand All
            </Button>
            <Button variant="outline" size="sm" onClick={() => setExpandedAccounts(new Set())}>
              Collapse All
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          {accounts.map((account) => renderAccount(account))}
        </div>
      </div>
    </AppLayout>
  );
}
