import { 
  User, 
  Calendar, 
  Clock, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Info,
  Eye,
  Download,
  ChevronDown,
  ChevronRight,
  Activity,
  MapPin,
  Monitor
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AuditLog, AuditStatus, AuditSeverity } from "@/types/audit";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface AuditLogCardProps {
  auditLog: AuditLog;
  onViewDetails?: (auditLog: AuditLog) => void;
  showExpanded?: boolean;
}

export function AuditLogCard({ auditLog, onViewDetails, showExpanded = false }: AuditLogCardProps) {
  const [isExpanded, setIsExpanded] = useState(showExpanded);

  const getStatusColor = (status: AuditStatus) => {
    switch (status) {
      case AuditStatus.SUCCESS:
        return "bg-green-100 text-green-700 border-green-200";
      case AuditStatus.FAILED:
        return "bg-red-100 text-red-700 border-red-200";
      case AuditStatus.PENDING:
        return "bg-amber-100 text-amber-700 border-amber-200";
      case AuditStatus.WARNING:
        return "bg-orange-100 text-orange-700 border-orange-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getSeverityColor = (severity: AuditSeverity) => {
    switch (severity) {
      case AuditSeverity.CRITICAL:
        return "bg-red-500 text-white";
      case AuditSeverity.HIGH:
        return "bg-red-100 text-red-700 border-red-200";
      case AuditSeverity.MEDIUM:
        return "bg-amber-100 text-amber-700 border-amber-200";
      case AuditSeverity.LOW:
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getSeverityIcon = (severity: AuditSeverity) => {
    switch (severity) {
      case AuditSeverity.CRITICAL:
        return <AlertTriangle size={16} className="text-red-500" />;
      case AuditSeverity.HIGH:
        return <AlertTriangle size={16} className="text-red-400" />;
      case AuditSeverity.MEDIUM:
        return <AlertTriangle size={16} className="text-amber-500" />;
      case AuditSeverity.LOW:
        return <Info size={16} className="text-blue-500" />;
      default:
        return <Info size={16} className="text-gray-500" />;
    }
  };

  const getStatusIcon = (status: AuditStatus) => {
    switch (status) {
      case AuditStatus.SUCCESS:
        return <CheckCircle size={16} className="text-green-500" />;
      case AuditStatus.FAILED:
        return <XCircle size={16} className="text-red-500" />;
      case AuditStatus.PENDING:
        return <Clock size={16} className="text-amber-500" />;
      case AuditStatus.WARNING:
        return <AlertTriangle size={16} className="text-orange-500" />;
      default:
        return <Info size={16} className="text-gray-500" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString(),
      relative: getRelativeTime(date)
    };
  };

  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const { date, time, relative } = formatTimestamp(auditLog.timestamp);

  return (
    <Card className="overflow-hidden">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              {getSeverityIcon(auditLog.severity)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-foreground truncate">{auditLog.description}</h3>
                <Badge className={cn("text-xs", getStatusColor(auditLog.status))}>
                  {auditLog.status}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Badge className={cn("text-xs", getSeverityColor(auditLog.severity))}>
                  {auditLog.severity}
                </Badge>
                <span className="font-mono bg-muted px-2 py-0.5 rounded">{auditLog.action}</span>
                <span>{auditLog.entityType}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {getStatusIcon(auditLog.status)}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </Button>
          </div>
        </div>

        {/* User and Time Info */}
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <User size={14} />
              <span>{auditLog.userName}</span>
              <span className="text-xs bg-muted px-1.5 py-0.5 rounded">{auditLog.userRole}</span>
            </div>
            {auditLog.department && (
              <div className="flex items-center gap-1">
                <MapPin size={14} />
                <span>{auditLog.department}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>{date}</span>
            <Clock size={14} />
            <span>{time}</span>
            <span className="text-xs text-muted-foreground">({relative})</span>
          </div>
        </div>

        {/* Entity Info */}
        {auditLog.entityName && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3 p-2 bg-muted/30 rounded">
            <Activity size={14} />
            <span>Entity: {auditLog.entityName}</span>
            {auditLog.entityId && (
              <span className="font-mono bg-background px-2 py-0.5 rounded">
                ID: {auditLog.entityId}
              </span>
            )}
          </div>
        )}

        {/* Technical Info */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <Monitor size={14} />
            <span className="font-mono">{auditLog.ipAddress}</span>
          </div>
          <div className="flex items-center gap-1">
            <Shield size={14} />
            <span className="font-mono">{auditLog.sessionId.substring(0, 12)}...</span>
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t space-y-4">
            {/* User Agent */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">Technical Details</h4>
              <div className="text-xs text-muted-foreground space-y-1">
                <div><strong>User Agent:</strong> {auditLog.userAgent}</div>
                <div><strong>Session ID:</strong> {auditLog.sessionId}</div>
                <div><strong>IP Address:</strong> {auditLog.ipAddress}</div>
                {auditLog.location && (
                  <div><strong>Location:</strong> {auditLog.location}</div>
                )}
              </div>
            </div>

            {/* Changes */}
            {(auditLog.oldValues || auditLog.newValues) && (
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">Changes</h4>
                <div className="space-y-2">
                  {auditLog.oldValues && Object.keys(auditLog.oldValues).length > 0 && (
                    <div>
                      <div className="text-xs font-medium text-red-600 mb-1">Old Values:</div>
                      <pre className="text-xs text-muted-foreground bg-red-50 p-2 rounded overflow-x-auto">
                        {JSON.stringify(auditLog.oldValues, null, 2)}
                      </pre>
                    </div>
                  )}
                  {auditLog.newValues && Object.keys(auditLog.newValues).length > 0 && (
                    <div>
                      <div className="text-xs font-medium text-green-600 mb-1">New Values:</div>
                      <pre className="text-xs text-muted-foreground bg-green-50 p-2 rounded overflow-x-auto">
                        {JSON.stringify(auditLog.newValues, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Metadata */}
            {auditLog.metadata && Object.keys(auditLog.metadata).length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">Additional Metadata</h4>
                <pre className="text-xs text-muted-foreground bg-muted p-2 rounded overflow-x-auto">
                  {JSON.stringify(auditLog.metadata, null, 2)}
                </pre>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => onViewDetails?.(auditLog)}>
                <Eye size={14} className="mr-1" />
                View Details
              </Button>
              <Button variant="outline" size="sm">
                <Download size={14} className="mr-1" />
                Export
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
