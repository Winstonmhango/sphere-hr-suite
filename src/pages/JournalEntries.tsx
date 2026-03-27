import { AppLayout } from "@/components/layout/AppLayout";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  Calendar,
  FileText,
  Calculator,
  Download,
  Eye,
  Edit,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { JournalEntryCard } from "@/components/accounting/JournalEntryCard";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Mock data
const journalEntries = [
  {
    id: "JE-2024-001",
    date: "2024-03-25",
    description: "Monthly Salary Payments - March 2024",
    status: "posted" as const,
    totalAmount: 45680,
    reference: "PAY-2024-03-001",
    lines: [
      {
        accountId: "5110",
        accountName: "Salaries and Wages",
        accountCode: "5110",
        debit: 45680,
        credit: 0,
        description: "Employee salaries for March 2024"
      },
      {
        accountId: "2110",
        accountName: "Accounts Payable",
        accountCode: "2110",
        debit: 0,
        credit: 45680,
        description: "Salary payable to employees"
      }
    ],
    createdBy: "John Smith",
    createdAt: "2024-03-25T09:00:00Z",
    approvedBy: "Sarah Johnson",
    approvedAt: "2024-03-25T10:30:00Z"
  },
  {
    id: "JE-2024-002",
    date: "2024-03-24",
    description: "Office Rent Payment - March 2024",
    status: "posted" as const,
    totalAmount: 12000,
    reference: "REN-2024-03-001",
    lines: [
      {
        accountId: "5120",
        accountName: "Rent Expense",
        accountCode: "5120",
        debit: 12000,
        credit: 0,
        description: "Monthly office rent"
      },
      {
        accountId: "1110",
        accountName: "Cash and Cash Equivalents",
        accountCode: "1110",
        debit: 0,
        credit: 12000,
        description: "Rent payment from bank account"
      }
    ],
    createdBy: "Emily Brown",
    createdAt: "2024-03-24T14:20:00Z",
    approvedBy: "Sarah Johnson",
    approvedAt: "2024-03-24T15:45:00Z"
  },
  {
    id: "JE-2024-003",
    date: "2024-03-23",
    description: "Client Payment - ABC Corporation",
    status: "posted" as const,
    totalAmount: 28500,
    reference: "INV-2024-03-042",
    lines: [
      {
        accountId: "1110",
        accountName: "Cash and Cash Equivalents",
        accountCode: "1110",
        debit: 28500,
        credit: 0,
        description: "Payment received from ABC Corp"
      },
      {
        accountId: "1120",
        accountName: "Accounts Receivable",
        accountCode: "1120",
        debit: 0,
        credit: 28500,
        description: "Clearing ABC Corp receivable"
      }
    ],
    createdBy: "David Lee",
    createdAt: "2024-03-23T11:15:00Z",
    approvedBy: "Sarah Johnson",
    approvedAt: "2024-03-23T12:00:00Z"
  },
  {
    id: "JE-2024-004",
    date: "2024-03-22",
    description: "Software License Purchase",
    status: "pending" as const,
    totalAmount: 2400,
    reference: "SW-2024-03-001",
    lines: [
      {
        accountId: "5220",
        accountName: "Software Licenses",
        accountCode: "5220",
        debit: 2400,
        credit: 0,
        description: "Annual software license"
      },
      {
        accountId: "2110",
        accountName: "Accounts Payable",
        accountCode: "2110",
        debit: 0,
        credit: 2400,
        description: "Software license payable"
      }
    ],
    createdBy: "Mike Wilson",
    createdAt: "2024-03-22T16:30:00Z",
    approvedBy: null,
    approvedAt: null
  },
  {
    id: "JE-2024-005",
    date: "2024-03-21",
    description: "Consulting Services Revenue",
    status: "posted" as const,
    totalAmount: 12500,
    reference: "SRV-2024-03-008",
    lines: [
      {
        accountId: "1120",
        accountName: "Accounts Receivable",
        accountCode: "1120",
        debit: 12500,
        credit: 0,
        description: "Consulting services invoiced"
      },
      {
        accountId: "4100",
        accountName: "Service Revenue",
        accountCode: "4100",
        debit: 0,
        credit: 12500,
        description: "Revenue from consulting services"
      }
    ],
    createdBy: "Lisa Chen",
    createdAt: "2024-03-21T13:45:00Z",
    approvedBy: "Sarah Johnson",
    approvedAt: "2024-03-21T14:20:00Z"
  }
];

export default function JournalEntries() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null);

  const postedEntries = journalEntries.filter(e => e.status === 'posted');
  const pendingEntries = journalEntries.filter(e => e.status === 'pending');
  const totalPostedValue = postedEntries.reduce((sum, entry) => sum + entry.totalAmount, 0);
  const totalPendingValue = pendingEntries.reduce((sum, entry) => sum + entry.totalAmount, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <AppLayout title="Journal Entries" subtitle="Record and manage financial transactions">
      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="sphere-card p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <FileText size={16} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Entries</p>
            </div>
          </div>
          <div className="text-xl font-bold text-foreground tabular-nums">{journalEntries.length}</div>
          <p className="text-xs text-muted-foreground mt-1">This month</p>
        </div>

        <div className="sphere-card p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
              <Calculator size={16} className="text-green-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Posted Entries</p>
            </div>
          </div>
          <div className="text-xl font-bold text-foreground tabular-nums">{postedEntries.length}</div>
          <p className="text-xs text-green-600 mt-1">{formatCurrency(totalPostedValue)}</p>
        </div>

        <div className="sphere-card p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
              <Calendar size={16} className="text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Pending Entries</p>
            </div>
          </div>
          <div className="text-xl font-bold text-foreground tabular-nums">{pendingEntries.length}</div>
          <p className="text-xs text-amber-600 mt-1">{formatCurrency(totalPendingValue)}</p>
        </div>

        <div className="sphere-card p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
              <Download size={16} className="text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">This Month</p>
            </div>
          </div>
          <div className="text-xl font-bold text-foreground tabular-nums">{formatCurrency(totalPostedValue + totalPendingValue)}</div>
          <p className="text-xs text-muted-foreground mt-1">Total value</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="sphere-card p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[14px] font-semibold text-foreground tracking-tight-ui">Journal Operations</h2>
            <p className="text-[12px] text-muted-foreground mt-1">Entry management tasks</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download size={14} className="mr-1" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Calculator size={14} className="mr-1" />
              Batch Post
            </Button>
            <Button size="sm">
              <Plus size={14} className="mr-1" />
              New Entry
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
              placeholder="Search entries by description, reference, or account..."
              className="pl-10 text-xs"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter size={14} className="mr-1" />
            Filters
          </Button>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              All: {journalEntries.length}
            </Badge>
            <Badge variant="outline" className="text-xs text-green-600">
              Posted: {postedEntries.length}
            </Badge>
            <Badge variant="outline" className="text-xs text-amber-600">
              Pending: {pendingEntries.length}
            </Badge>
          </div>
        </div>
      </div>

      {/* Journal Entries List */}
      <div className="sphere-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[14px] font-semibold text-foreground">Recent Journal Entries</h3>
            <p className="text-[12px] text-muted-foreground mt-1">Latest financial transactions</p>
          </div>
          <Button variant="outline" size="sm">
            View All Entries
          </Button>
        </div>

        <div className="space-y-3">
          {journalEntries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <JournalEntryCard
                entry={entry}
                isSelected={selectedEntry === entry.id}
                onSelect={() => setSelectedEntry(entry.id)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
