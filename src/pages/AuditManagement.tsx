import { AppLayout } from "@/components/layout/AppLayout";
import { motion } from "framer-motion";
import {
  Shield,
  Search,
  Filter,
  Download,
  TrendingUp,
  Users,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  RefreshCw,
  BarChart3,
  FileText,
  Eye,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { AuditLogCard } from "@/components/audit/AuditLogCard";
import { AuditService } from "@/services/auditService";
import { AuditLog, AuditFilter, AuditStats, AuditAction, EntityType, AuditStatus, AuditSeverity } from "@/types/audit";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AuditManagement() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState<AuditStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAction, setSelectedAction] = useState<AuditAction | "all">("all");
  const [selectedEntity, setSelectedEntity] = useState<EntityType | "all">("all");
  const [selectedStatus, setSelectedStatus] = useState<AuditStatus | "all">("all");
  const [selectedSeverity, setSelectedSeverity] = useState<AuditSeverity | "all">("all");
  const [selectedDateRange, setSelectedDateRange] = useState("24h");
  const [showFilters, setShowFilters] = useState(false);

  // Load audit logs and stats
  useEffect(() => {
    loadAuditData();
  }, [searchTerm, selectedAction, selectedEntity, selectedStatus, selectedSeverity, selectedDateRange]);

  const loadAuditData = () => {
    setIsLoading(true);
    
    // Build filter
    const filter: AuditFilter = {
      search: searchTerm || undefined,
      action: selectedAction !== "all" ? selectedAction : undefined,
      entityType: selectedEntity !== "all" ? selectedEntity : undefined,
      status: selectedStatus !== "all" ? selectedStatus : undefined,
      severity: selectedSeverity !== "all" ? selectedSeverity : undefined,
    };

    // Add date range filter
    const now = new Date();
    switch (selectedDateRange) {
      case "1h":
        filter.dateFrom = new Date(now.getTime() - 60 * 60 * 1000).toISOString();
        break;
      case "24h":
        filter.dateFrom = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
        break;
      case "7d":
        filter.dateFrom = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
        break;
      case "30d":
        filter.dateFrom = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
        break;
    }

    const logs = AuditService.getLogs(filter);
    const auditStats = AuditService.getStats(filter);

    setAuditLogs(logs);
    setStats(auditStats);
    setIsLoading(false);
  };

  const handleExport = (format: "CSV" | "JSON" | "PDF" | "EXCEL") => {
    const filter: AuditFilter = {
      search: searchTerm || undefined,
      action: selectedAction !== "all" ? selectedAction : undefined,
      entityType: selectedEntity !== "all" ? selectedEntity : undefined,
      status: selectedStatus !== "all" ? selectedStatus : undefined,
      severity: selectedSeverity !== "all" ? selectedSeverity : undefined,
    };

    const exportData = AuditService.exportLogs(filter, format);
    
    // Create and download file
    const blob = new Blob([exportData], { 
      type: format === "JSON" ? "application/json" : "text/csv" 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit_logs_${new Date().toISOString().split('T')[0]}.${format.toLowerCase()}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClearLogs = () => {
    if (confirm("Are you sure you want to clear all audit logs? This action cannot be undone.")) {
      AuditService.clearLogs();
      loadAuditData();
    }
  };

  const handleViewDetails = (auditLog: AuditLog) => {
    // In a real application, this would open a detailed view modal
    console.log("View details for:", auditLog);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  return (
    <AppLayout title="Audit Management" subtitle="Monitor and track all system activities">
      {/* Statistics Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <Activity size={16} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Logs</p>
            </div>
          </div>
          <div className="text-xl font-bold text-blue-600 tabular-nums">
            {formatNumber(stats?.totalLogs || 0)}
          </div>
          <p className="text-xs text-blue-600 mt-1">All activities</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle size={16} className="text-green-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Success Rate</p>
            </div>
          </div>
          <div className="text-xl font-bold text-green-600 tabular-nums">
            {stats ? Math.round((stats.successCount / stats.totalLogs) * 100) : 0}%
          </div>
          <p className="text-xs text-green-600 mt-1">{formatNumber(stats?.successCount || 0)} successful</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
              <AlertTriangle size={16} className="text-red-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Critical/High</p>
            </div>
          </div>
          <div className="text-xl font-bold text-red-600 tabular-nums">
            {formatNumber((stats?.criticalCount || 0) + (stats?.highCount || 0))}
          </div>
          <p className="text-xs text-red-600 mt-1">Requires attention</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
              <Users size={16} className="text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Today's Activity</p>
            </div>
          </div>
          <div className="text-xl font-bold text-purple-600 tabular-nums">
            {formatNumber(stats?.todayCount || 0)}
          </div>
          <p className="text-xs text-purple-600 mt-1">Last 24 hours</p>
        </Card>
      </div>

      {/* Controls */}
      <Card className="p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[14px] font-semibold text-foreground tracking-tight-ui">Audit Trail</h2>
            <p className="text-[12px] text-muted-foreground mt-1">Monitor all system activities and user actions</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
              <Filter size={14} className="mr-1" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
            <Button variant="outline" size="sm" onClick={loadAuditData}>
              <RefreshCw size={14} className="mr-1" />
              Refresh
            </Button>
            <Select onValueChange={(value) => handleExport(value as any)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Export" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CSV">CSV</SelectItem>
                <SelectItem value="JSON">JSON</SelectItem>
                <SelectItem value="EXCEL">Excel</SelectItem>
                <SelectItem value="PDF">PDF</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={handleClearLogs} className="text-red-600">
              <Trash2 size={14} className="mr-1" />
              Clear
            </Button>
          </div>
        </div>
      </Card>

      {/* Search and Filters */}
      {showFilters && (
        <Card className="p-4 mb-6">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-muted-foreground" />
              <Input
                placeholder="Search audit logs by description, user, or entity..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-xs"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-5 gap-4">
              <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">Last Hour</SelectItem>
                  <SelectItem value="24h">Last 24 Hours</SelectItem>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedAction} onValueChange={(value: any) => setSelectedAction(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  {Object.values(AuditAction).map(action => (
                    <SelectItem key={action} value={action}>{action}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedEntity} onValueChange={(value: any) => setSelectedEntity(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Entity Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Entities</SelectItem>
                  {Object.values(EntityType).map(entity => (
                    <SelectItem key={entity} value={entity}>{entity}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={(value: any) => setSelectedStatus(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {Object.values(AuditStatus).map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedSeverity} onValueChange={(value: any) => setSelectedSeverity(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  {Object.values(AuditSeverity).map(severity => (
                    <SelectItem key={severity} value={severity}>{severity}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>
      )}

      {/* Quick Stats */}
      {stats && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card className="p-3">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-green-500" />
              <div>
                <p className="text-xs text-muted-foreground">Top User</p>
                <p className="text-sm font-medium">{stats.topUsers[0]?.userName || "N/A"}</p>
                <p className="text-xs text-muted-foreground">{stats.topUsers[0]?.actionCount || 0} actions</p>
              </div>
            </div>
          </Card>

          <Card className="p-3">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-blue-500" />
              <div>
                <p className="text-xs text-muted-foreground">Top Action</p>
                <p className="text-sm font-medium">{stats.topActions[0]?.action || "N/A"}</p>
                <p className="text-xs text-muted-foreground">{stats.topActions[0]?.count || 0} times</p>
              </div>
            </div>
          </Card>

          <Card className="p-3">
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-purple-500" />
              <div>
                <p className="text-xs text-muted-foreground">Top Entity</p>
                <p className="text-sm font-medium">{stats.topEntities[0]?.entityType || "N/A"}</p>
                <p className="text-xs text-muted-foreground">{stats.topEntities[0]?.count || 0} operations</p>
              </div>
            </div>
          </Card>

          <Card className="p-3">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-amber-500" />
              <div>
                <p className="text-xs text-muted-foreground">This Week</p>
                <p className="text-sm font-medium">{formatNumber(stats.weekCount || 0)}</p>
                <p className="text-xs text-muted-foreground">activities</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Audit Logs List */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[14px] font-semibold text-foreground">Audit Logs</h3>
            <p className="text-[12px] text-muted-foreground mt-1">
              Showing {auditLogs.length} of {stats?.totalLogs || 0} logs
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Total: {auditLogs.length}
            </Badge>
            <Badge variant="outline" className="text-xs text-green-600">
              Success: {stats?.successCount || 0}
            </Badge>
            <Badge variant="outline" className="text-xs text-red-600">
              Failed: {stats?.failedCount || 0}
            </Badge>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <RefreshCw size={24} className="mx-auto animate-spin text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Loading audit logs...</p>
          </div>
        ) : auditLogs.length === 0 ? (
          <div className="text-center py-8">
            <Shield size={48} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No audit logs found</p>
            <p className="text-sm text-muted-foreground mt-2">
              Try adjusting your filters or search terms
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {auditLogs.map((auditLog, index) => (
              <motion.div
                key={auditLog.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <AuditLogCard
                  auditLog={auditLog}
                  onViewDetails={handleViewDetails}
                />
              </motion.div>
            ))}
          </div>
        )}
      </Card>
    </AppLayout>
  );
}
