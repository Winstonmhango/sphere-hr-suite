import { AppLayout } from "@/components/layout/AppLayout";
import { motion } from "framer-motion";
import {
  Calculator,
  Download,
  Search,
  Filter,
  Plus,
  Minus,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Mock data for trial balance
const trialBalanceData = [
  {
    accountCode: "1110",
    accountName: "Cash and Cash Equivalents",
    debitBalance: 125890,
    creditBalance: 0,
    category: "Current Assets"
  },
  {
    accountCode: "1120",
    accountName: "Accounts Receivable",
    debitBalance: 95450,
    creditBalance: 0,
    category: "Current Assets"
  },
  {
    accountCode: "1130",
    accountName: "Inventory",
    debitBalance: 64000,
    creditBalance: 0,
    category: "Current Assets"
  },
  {
    accountCode: "1210",
    accountName: "Property, Plant & Equipment",
    debitBalance: 185550,
    creditBalance: 0,
    category: "Fixed Assets"
  },
  {
    accountCode: "1220",
    accountName: "Accumulated Depreciation",
    debitBalance: 0,
    creditBalance: 45000,
    category: "Contra-Asset"
  },
  {
    accountCode: "2110",
    accountName: "Accounts Payable",
    debitBalance: 0,
    creditBalance: 45670,
    category: "Current Liabilities"
  },
  {
    accountCode: "2120",
    accountName: "Accrued Expenses",
    debitBalance: 0,
    creditBalance: 24000,
    category: "Current Liabilities"
  },
  {
    accountCode: "2130",
    accountName: "Taxes Payable",
    debitBalance: 0,
    creditBalance: 20000,
    category: "Current Liabilities"
  },
  {
    accountCode: "2210",
    accountName: "Bank Loans",
    debitBalance: 0,
    creditBalance: 50000,
    category: "Long-term Liabilities"
  },
  {
    accountCode: "2220",
    accountName: "Equipment Financing",
    debitBalance: 0,
    creditBalance: 16650,
    category: "Long-term Liabilities"
  },
  {
    accountCode: "3100",
    accountName: "Owner's Equity",
    debitBalance: 0,
    creditBalance: 200000,
    category: "Owner Equity"
  },
  {
    accountCode: "3200",
    accountName: "Retained Earnings",
    debitBalance: 0,
    creditBalance: 69570,
    category: "Retained Earnings"
  },
  {
    accountCode: "4100",
    accountName: "Service Revenue",
    debitBalance: 0,
    creditBalance: 185650,
    category: "Revenue"
  },
  {
    accountCode: "4200",
    accountName: "Product Sales",
    debitBalance: 0,
    creditBalance: 99000,
    category: "Revenue"
  },
  {
    accountCode: "5110",
    accountName: "Salaries and Wages",
    debitBalance: 45680,
    creditBalance: 0,
    category: "Operating Expenses"
  },
  {
    accountCode: "5120",
    accountName: "Rent Expense",
    debitBalance: 12000,
    creditBalance: 0,
    category: "Operating Expenses"
  },
  {
    accountCode: "5130",
    accountName: "Utilities",
    debitBalance: 8960,
    creditBalance: 0,
    category: "Operating Expenses"
  },
  {
    accountCode: "5210",
    accountName: "Office Supplies",
    debitBalance: 2400,
    creditBalance: 0,
    category: "Administrative"
  },
  {
    accountCode: "5220",
    accountName: "Software Licenses",
    debitBalance: 2400,
    creditBalance: 0,
    category: "Administrative"
  }
];

export default function TrialBalance() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("March 2024");

  const totalDebits = trialBalanceData.reduce((sum, account) => sum + account.debitBalance, 0);
  const totalCredits = trialBalanceData.reduce((sum, account) => sum + account.creditBalance, 0);
  const isBalanced = totalDebits === totalCredits;
  const difference = Math.abs(totalDebits - totalCredits);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      "Current Assets": "bg-blue-100 text-blue-700 border-blue-200",
      "Fixed Assets": "bg-blue-100 text-blue-700 border-blue-200",
      "Contra-Asset": "bg-red-100 text-red-700 border-red-200",
      "Current Liabilities": "bg-orange-100 text-orange-700 border-orange-200",
      "Long-term Liabilities": "bg-orange-100 text-orange-700 border-orange-200",
      "Owner Equity": "bg-green-100 text-green-700 border-green-200",
      "Retained Earnings": "bg-green-100 text-green-700 border-green-200",
      "Revenue": "bg-emerald-100 text-emerald-700 border-emerald-200",
      "Operating Expenses": "bg-red-100 text-red-700 border-red-200",
      "Administrative": "bg-red-100 text-red-700 border-red-200"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  return (
    <AppLayout title="Trial Balance" subtitle="Verify account balances and ensure debits equal credits">
      {/* Balance Status */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="sphere-card p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
              <Plus size={16} className="text-red-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Debits</p>
            </div>
          </div>
          <div className="text-xl font-bold text-foreground tabular-nums">
            {formatCurrency(totalDebits)}
          </div>
        </div>

        <div className="sphere-card p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
              <Minus size={16} className="text-green-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Credits</p>
            </div>
          </div>
          <div className="text-xl font-bold text-foreground tabular-nums">
            {formatCurrency(totalCredits)}
          </div>
        </div>

        <div className="sphere-card p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center",
              isBalanced ? "bg-emerald-100" : "bg-red-100"
            )}>
              {isBalanced ? (
                <CheckCircle size={16} className="text-emerald-600" />
              ) : (
                <AlertTriangle size={16} className="text-red-600" />
              )}
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Balance Status</p>
            </div>
          </div>
          <div className={cn(
            "text-lg font-bold tabular-nums",
            isBalanced ? "text-emerald-600" : "text-red-600"
          )}>
            {isBalanced ? "Balanced" : "Out of Balance"}
          </div>
          {!isBalanced && (
            <p className="text-xs text-red-600 mt-1">
              Difference: {formatCurrency(difference)}
            </p>
          )}
        </div>
      </div>

      {/* Period Selection and Actions */}
      <div className="sphere-card p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[14px] font-semibold text-foreground tracking-tight-ui">Trial Balance Period</h2>
            <p className="text-[12px] text-muted-foreground mt-1">Select accounting period</p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="text-xs px-3 py-1.5 rounded border bg-background"
            >
              <option value="March 2024">March 2024</option>
              <option value="February 2024">February 2024</option>
              <option value="January 2024">January 2024</option>
              <option value="December 2023">December 2023</option>
            </select>
            <Button variant="outline" size="sm">
              <Download size={14} className="mr-1" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Calculator size={14} className="mr-1" />
              Generate Report
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
              placeholder="Search accounts by name or code..."
              className="pl-10 text-xs"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter size={14} className="mr-1" />
            Filters
          </Button>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Total: {trialBalanceData.length}
            </Badge>
            <Badge variant="outline" className="text-xs text-blue-600">
              Assets: 5
            </Badge>
            <Badge variant="outline" className="text-xs text-orange-600">
              Liabilities: 5
            </Badge>
          </div>
        </div>
      </div>

      {/* Trial Balance Table */}
      <div className="sphere-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[14px] font-semibold text-foreground">Trial Balance Report</h3>
            <p className="text-[12px] text-muted-foreground mt-1">
              Period: {selectedPeriod}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={cn(
              "text-xs",
              isBalanced ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-red-100 text-red-700 border-red-200"
            )}>
              {isBalanced ? "Balanced" : "Out of Balance"}
            </Badge>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 font-semibold text-foreground">Account Code</th>
                <th className="text-left p-3 font-semibold text-foreground">Account Name</th>
                <th className="text-left p-3 font-semibold text-foreground">Category</th>
                <th className="text-right p-3 font-semibold text-foreground">Debit Balance</th>
                <th className="text-right p-3 font-semibold text-foreground">Credit Balance</th>
              </tr>
            </thead>
            <tbody>
              {trialBalanceData.map((account, index) => (
                <motion.tr
                  key={account.accountCode}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className="border-b hover:bg-accent/50"
                >
                  <td className="p-3 font-mono text-muted-foreground">{account.accountCode}</td>
                  <td className="p-3 font-medium text-foreground">{account.accountName}</td>
                  <td className="p-3">
                    <Badge className={cn("text-xs", getCategoryColor(account.category))}>
                      {account.category}
                    </Badge>
                  </td>
                  <td className="p-3 text-right font-semibold text-red-600 tabular-nums">
                    {account.debitBalance > 0 ? formatCurrency(account.debitBalance) : "-"}
                  </td>
                  <td className="p-3 text-right font-semibold text-green-600 tabular-nums">
                    {account.creditBalance > 0 ? formatCurrency(account.creditBalance) : "-"}
                  </td>
                </motion.tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-muted-foreground/20 bg-muted/50">
                <td colSpan={3} className="p-3 font-bold text-foreground">Totals</td>
                <td className="p-3 text-right font-bold text-red-600 tabular-nums">
                  {formatCurrency(totalDebits)}
                </td>
                <td className="p-3 text-right font-bold text-green-600 tabular-nums">
                  {formatCurrency(totalCredits)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
