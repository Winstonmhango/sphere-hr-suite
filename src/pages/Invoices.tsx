import { AppLayout } from "@/components/layout/AppLayout";
import { InvoiceCard } from "@/components/crm/InvoiceCard";
import { CreateInvoiceModal } from "@/components/crm/modals/CreateInvoiceModal";
import { motion } from "framer-motion";
import {
  FileText,
  TrendingUp,
  DollarSign,
  Calendar,
  Search,
  Filter,
  Plus,
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { InventoryStatCard } from "@/components/inventory/InventoryStatCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

// Mock data
const invoiceStats = [
  {
    label: "Total Invoices",
    value: "3,421",
    change: "+156 this month",
    changeType: "positive" as const,
    icon: FileText,
    trend: "up" as const
  },
  {
    label: "Outstanding",
    value: "$428K",
    change: "+12.3% vs last month",
    changeType: "negative" as const,
    icon: DollarSign,
    trend: "down" as const
  },
  {
    label: "Paid This Month",
    value: "$1.2M",
    change: "+8.7% vs last month",
    changeType: "positive" as const,
    icon: CheckCircle,
    trend: "up" as const
  },
  {
    label: "Overdue",
    value: "23",
    change: "-5 from last week",
    changeType: "positive" as const,
    icon: AlertCircle,
    trend: "down" as const
  }
];

const invoices = [
  {
    id: "1",
    invoiceNumber: "INV-2024-001",
    customerName: "John Smith",
    customerCompany: "Acme Corporation",
    amount: 15420,
    status: "paid" as const,
    issueDate: "2024-03-01",
    dueDate: "2024-03-15",
    paidDate: "2024-03-14",
    items: 5,
    description: "Office Equipment Purchase",
    trend: "up" as const
  },
  {
    id: "2",
    invoiceNumber: "INV-2024-002",
    customerName: "Sarah Johnson",
    customerCompany: "Global Industries",
    amount: 8750,
    status: "pending" as const,
    issueDate: "2024-03-10",
    dueDate: "2024-04-10",
    items: 3,
    description: "Software Licenses",
    trend: "stable" as const
  },
  {
    id: "3",
    invoiceNumber: "INV-2024-003",
    customerName: "Michael Chen",
    customerCompany: "Tech Solutions Ltd",
    amount: 23400,
    status: "overdue" as const,
    issueDate: "2024-02-15",
    dueDate: "2024-03-15",
    items: 8,
    description: "Hardware Upgrade",
    trend: "down" as const
  },
  {
    id: "4",
    invoiceNumber: "INV-2024-004",
    customerName: "Emily Davis",
    customerCompany: "Retail Co",
    amount: 5670,
    status: "pending" as const,
    issueDate: "2024-03-18",
    dueDate: "2024-04-18",
    items: 2,
    description: "Consulting Services",
    trend: "up" as const
  },
  {
    id: "5",
    invoiceNumber: "INV-2024-005",
    customerName: "Robert Wilson",
    customerCompany: "Manufacturing Plus",
    amount: 32100,
    status: "paid" as const,
    issueDate: "2024-03-05",
    dueDate: "2024-03-20",
    paidDate: "2024-03-19",
    items: 12,
    description: "Raw Materials",
    trend: "stable" as const
  },
  {
    id: "6",
    invoiceNumber: "INV-2024-006",
    customerName: "Lisa Anderson",
    customerCompany: "Design Studio",
    amount: 12300,
    status: "cancelled" as const,
    issueDate: "2024-03-12",
    dueDate: "2024-04-12",
    items: 4,
    description: "Creative Services",
    trend: "down" as const
  }
];

const paidInvoices = invoices.filter(inv => inv.status === "paid");
const pendingInvoices = invoices.filter(inv => inv.status === "pending");
const overdueInvoices = invoices.filter(inv => inv.status === "overdue");

export default function Invoices() {
  const [createInvoiceModalOpen, setCreateInvoiceModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateInvoice = async (data: any) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Creating invoice:", data);
    setIsLoading(false);
    setCreateInvoiceModalOpen(false);
  };

  const handlePayInvoice = async (invoiceId: string) => {
    console.log("Paying invoice:", invoiceId);
    // Handle payment logic
  };

  return (
    <AppLayout title="Invoice Management" subtitle="Manage customer invoices and payments">
      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {invoiceStats.map((stat, index) => (
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

      {/* Overdue Alert */}
      {overdueInvoices.length > 0 && (
        <div className="sphere-card p-4 mb-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle size={20} className="text-red-500" />
              <div>
                <h3 className="text-sm font-semibold text-foreground">Overdue Invoices Alert</h3>
                <p className="text-xs text-muted-foreground">
                  {overdueInvoices.length} invoice(s) overdue - Total: ${overdueInvoices.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              View Overdue
            </Button>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="sphere-card p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[14px] font-semibold text-foreground tracking-tight-ui">Quick Actions</h2>
            <p className="text-[12px] text-muted-foreground mt-1">Invoice management tasks</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download size={14} className="mr-1" />
              Export
            </Button>
            <Button size="sm" onClick={() => setCreateInvoiceModalOpen(true)}>
              <Plus size={14} className="mr-1" />
              Create Invoice
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
              placeholder="Search invoices by number, customer, or amount..."
              className="pl-10 text-xs"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter size={14} className="mr-1" />
            Filters
          </Button>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Paid: {paidInvoices.length}
            </Badge>
            <Badge variant="outline" className="text-xs text-amber-600">
              Pending: {pendingInvoices.length}
            </Badge>
            <Badge variant="outline" className="text-xs text-red-600">
              Overdue: {overdueInvoices.length}
            </Badge>
          </div>
        </div>
      </div>

      {/* Invoice Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Invoices</TabsTrigger>
          <TabsTrigger value="paid">Paid</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="overdue">Overdue</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <div className="sphere-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-[14px] font-semibold text-foreground tracking-tight-ui">All Invoices</h2>
                <p className="text-[12px] text-muted-foreground mt-1">Complete invoice history</p>
              </div>
              <Button variant="ghost" size="sm">
                <Eye size={14} className="mr-1" />
                View All
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {invoices.map((invoice, index) => (
                <motion.div
                  key={invoice.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <InvoiceCard 
                    invoice={invoice} 
                    onPay={() => handlePayInvoice(invoice.id)}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="paid" className="space-y-6">
          <div className="sphere-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-[14px] font-semibold text-foreground tracking-tight-ui">Paid Invoices</h2>
                <p className="text-[12px] text-muted-foreground mt-1">Successfully paid invoices</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Total: ${paidInvoices.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {paidInvoices.map((invoice, index) => (
                <motion.div
                  key={invoice.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <InvoiceCard invoice={invoice} />
                </motion.div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="pending" className="space-y-6">
          <div className="sphere-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-[14px] font-semibold text-foreground tracking-tight-ui">Pending Invoices</h2>
                <p className="text-[12px] text-muted-foreground mt-1">Awaiting payment</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Total: ${pendingInvoices.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {pendingInvoices.map((invoice, index) => (
                <motion.div
                  key={invoice.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <InvoiceCard 
                    invoice={invoice} 
                    onPay={() => handlePayInvoice(invoice.id)}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="overdue" className="space-y-6">
          <div className="sphere-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-[14px] font-semibold text-foreground tracking-tight-ui">Overdue Invoices</h2>
                <p className="text-[12px] text-muted-foreground mt-1">Payment overdue</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-red-500 font-medium">
                  Total: ${overdueInvoices.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {overdueInvoices.map((invoice, index) => (
                <motion.div
                  key={invoice.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <InvoiceCard 
                    invoice={invoice} 
                    onPay={() => handlePayInvoice(invoice.id)}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Invoice Modal */}
      <CreateInvoiceModal
        open={createInvoiceModalOpen}
        onOpenChange={setCreateInvoiceModalOpen}
        onSubmit={handleCreateInvoice}
        isLoading={isLoading}
      />
    </AppLayout>
  );
}
