import { AppLayout } from "@/components/layout/AppLayout";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Target,
  DollarSign,
  Search,
  Filter,
  Download,
  BarChart3,
  PieChart,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { VarianceCard } from "../components/budget/VarianceCard";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Mock data
const varianceData = [
  {
    id: "VAR-001",
    budgetName: "Marketing Campaign Q1",
    department: "Marketing",
    category: "Marketing",
    budgetedAmount: 150000,
    actualAmount: 125000,
    variance: -25000,
    variancePercentage: -16.7,
    varianceType: "favorable" as const,
    period: "Q1 2024",
    impact: "low" as const,
    trend: "improving" as const,
    lastUpdated: "2024-03-25",
    reasons: [
      "Reduced digital ad spend due to better optimization",
      "Lower content creation costs than expected",
      "Efficient vendor negotiations"
    ],
    actions: [
      "Reallocate savings to Q2 marketing initiatives",
      "Document successful optimization strategies",
      "Review vendor contracts for future savings"
    ]
  },
  {
    id: "VAR-002",
    budgetName: "Office Operations",
    department: "Administration",
    category: "Operations",
    budgetedAmount: 80000,
    actualAmount: 85000,
    variance: 5000,
    variancePercentage: 6.3,
    varianceType: "unfavorable" as const,
    period: "Q1 2024",
    impact: "medium" as const,
    trend: "stable" as const,
    lastUpdated: "2024-03-25",
    reasons: [
      "Increased utility costs due to extreme weather",
      "Unexpected office maintenance expenses",
      "Higher supply costs than anticipated"
    ],
    actions: [
      "Review utility contracts for better rates",
      "Implement energy-saving measures",
      "Establish maintenance reserve fund"
    ]
  },
  {
    id: "VAR-003",
    budgetName: "Sales Team Expenses",
    department: "Sales",
    category: "Sales",
    budgetedAmount: 120000,
    actualAmount: 95000,
    variance: -25000,
    variancePercentage: -20.8,
    varianceType: "favorable" as const,
    period: "Q1 2024",
    impact: "high" as const,
    trend: "improving" as const,
    lastUpdated: "2024-03-23",
    reasons: [
      "Reduced travel expenses with virtual meetings",
      "Lower entertainment costs than budgeted",
      "Efficient use of sales tools and resources"
    ],
    actions: [
      "Invest savings in sales training programs",
      "Expand virtual meeting capabilities",
      "Review travel policy for optimization"
    ]
  },
  {
    id: "VAR-004",
    budgetName: "Software Development",
    department: "IT",
    category: "Technology",
    budgetedAmount: 200000,
    actualAmount: 185000,
    variance: -15000,
    variancePercentage: -7.5,
    varianceType: "favorable" as const,
    period: "Q1 2024",
    impact: "medium" as const,
    trend: "stable" as const,
    lastUpdated: "2024-03-24",
    reasons: [
      "Efficient resource allocation",
      "Optimized development processes",
      "Lower cloud infrastructure costs"
    ],
    actions: [
      "Reinvest in developer training",
      "Document process improvements",
      "Review cloud usage optimization"
    ]
  },
  {
    id: "VAR-005",
    budgetName: "HR Training Program",
    department: "Human Resources",
    category: "Training",
    budgetedAmount: 50000,
    actualAmount: 45000,
    variance: -5000,
    variancePercentage: -10.0,
    varianceType: "favorable" as const,
    period: "Q1 2024",
    impact: "low" as const,
    trend: "stable" as const,
    lastUpdated: "2024-03-22",
    reasons: [
      "Bulk training provider discounts",
      "Internal trainer utilization",
      "Lower material costs than expected"
    ],
    actions: [
      "Expand training program coverage",
      "Develop internal training capabilities",
      "Negotiate long-term provider contracts"
    ]
  }
];

export default function BudgetVarianceAnalysis() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("Q1 2024");
  const [selectedVarianceType, setSelectedVarianceType] = useState("all");

  const favorableVariances = varianceData.filter(v => v.varianceType === 'favorable');
  const unfavorableVariances = varianceData.filter(v => v.varianceType === 'unfavorable');
  const highImpactVariances = varianceData.filter(v => v.impact === 'high');
  const totalFavorable = favorableVariances.reduce((sum, v) => sum + Math.abs(v.variance), 0);
  const totalUnfavorable = unfavorableVariances.reduce((sum, v) => sum + Math.abs(v.variance), 0);
  const netVariance = totalFavorable - totalUnfavorable;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Math.abs(amount));
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200";
      case "medium":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "low":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving":
        return <ArrowUpRight size={12} className="text-green-500" />;
      case "declining":
        return <ArrowDownRight size={12} className="text-red-500" />;
      default:
        return <div className="w-3 h-3 bg-gray-400 rounded-full" />;
    }
  };

  const filteredVariances = selectedVarianceType === "all" 
    ? varianceData 
    : varianceData.filter(v => v.varianceType === selectedVarianceType);

  return (
    <AppLayout title="Budget Variance Analysis" subtitle="Analyze budget deviations and identify trends">
      {/* Variance Summary */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="sphere-card p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
              <TrendingDown size={16} className="text-green-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Favorable Variance</p>
            </div>
          </div>
          <div className="text-xl font-bold text-green-600 tabular-nums">
            {formatCurrency(totalFavorable)}
          </div>
          <p className="text-xs text-green-600 mt-1">{favorableVariances.length} items</p>
        </div>

        <div className="sphere-card p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
              <TrendingUp size={16} className="text-red-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Unfavorable Variance</p>
            </div>
          </div>
          <div className="text-xl font-bold text-red-600 tabular-nums">
            {formatCurrency(totalUnfavorable)}
          </div>
          <p className="text-xs text-red-600 mt-1">{unfavorableVariances.length} items</p>
        </div>

        <div className="sphere-card p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <Target size={16} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Net Variance</p>
            </div>
          </div>
          <div className={cn(
            "text-xl font-bold tabular-nums",
            netVariance >= 0 ? "text-green-600" : "text-red-600"
          )}>
            {netVariance >= 0 ? "+" : ""}{formatCurrency(netVariance)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Overall impact</p>
        </div>

        <div className="sphere-card p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
              <AlertTriangle size={16} className="text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">High Impact</p>
            </div>
          </div>
          <div className="text-xl font-bold text-foreground tabular-nums">
            {highImpactVariances.length}
          </div>
          <p className="text-xs text-purple-600 mt-1">Requires attention</p>
        </div>
      </div>

      {/* High Impact Alerts */}
      {highImpactVariances.length > 0 && (
        <div className="sphere-card p-4 mb-6 border-l-4 border-amber-500">
          <div className="flex items-center gap-3">
            <AlertTriangle size={20} className="text-amber-500" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-foreground">High Impact Variances</h3>
              <p className="text-xs text-muted-foreground">
                {highImpactVariances.length} variance(s) require immediate attention and action
              </p>
            </div>
            <Button variant="outline" size="sm">
              Review Actions
            </Button>
          </div>
        </div>
      )}

      {/* Analysis Controls */}
      <div className="sphere-card p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[14px] font-semibold text-foreground tracking-tight-ui">Variance Analysis</h2>
            <p className="text-[12px] text-muted-foreground mt-1">Budget deviation analysis and insights</p>
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
            <select
              value={selectedVarianceType}
              onChange={(e) => setSelectedVarianceType(e.target.value)}
              className="text-xs px-3 py-1.5 rounded border bg-background"
            >
              <option value="all">All Variances</option>
              <option value="favorable">Favorable Only</option>
              <option value="unfavorable">Unfavorable Only</option>
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
              placeholder="Search variances by budget name, department, or reason..."
              className="pl-10 text-xs"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter size={14} className="mr-1" />
            Advanced Filters
          </Button>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Total: {filteredVariances.length}
            </Badge>
            <Badge variant="outline" className="text-xs text-green-600">
              Favorable: {favorableVariances.length}
            </Badge>
            <Badge variant="outline" className="text-xs text-red-600">
              Unfavorable: {unfavorableVariances.length}
            </Badge>
          </div>
        </div>
      </div>

      {/* Variance Analysis Results */}
      <div className="sphere-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[14px] font-semibold text-foreground">Variance Analysis Results</h3>
            <p className="text-[12px] text-muted-foreground mt-1">
              Period: {selectedPeriod} | Type: {selectedVarianceType === 'all' ? 'All' : selectedVarianceType}
            </p>
          </div>
          <Button variant="outline" size="sm">
            <BarChart3 size={14} className="mr-1" />
            Generate Report
          </Button>
        </div>

        <div className="space-y-3">
          {filteredVariances.map((variance, index) => (
            <motion.div
              key={variance.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <VarianceCard variance={variance} />
            </motion.div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
