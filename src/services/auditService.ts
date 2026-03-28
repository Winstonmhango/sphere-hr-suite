import { AuditLog, AuditAction, EntityType, AuditStatus, AuditSeverity, AuditFilter, AuditStats } from "@/types/audit";
import { useAuth } from "@/auth/AuthContext";

// Mock storage for audit logs (in production, this would be a database)
let auditLogs: AuditLog[] = [];
let currentSessionId = "";

// Initialize session ID
currentSessionId = generateSessionId();

function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

function generateAuditId(): string {
  return `audit_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

function getClientIP(): string {
  // In production, this would come from the request
  return "192.168.1.100";
}

function getUserAgent(): string {
  return navigator.userAgent;
}

function determineSeverity(action: AuditAction, status: AuditStatus): AuditSeverity {
  if (status === AuditStatus.FAILED) return AuditSeverity.HIGH;
  
  switch (action) {
    case AuditAction.DELETE:
    case AuditAction.RESET_PASSWORD:
    case AuditAction.CHANGE_ROLE:
    case AuditAction.PERMISSION_CHANGE:
      return AuditSeverity.HIGH;
    
    case AuditAction.CREATE:
    case AuditAction.UPDATE:
    case AuditAction.APPROVE:
    case AuditAction.REJECT:
    case AuditAction.EXPORT:
    case AuditAction.IMPORT:
      return AuditSeverity.MEDIUM;
    
    case AuditAction.VIEW:
    case AuditAction.LOGIN:
    case AuditAction.LOGOUT:
      return AuditSeverity.LOW;
    
    case AuditAction.FAILED_LOGIN:
      return AuditSeverity.CRITICAL;
    
    default:
      return AuditSeverity.LOW;
  }
}

function createActionDescription(action: AuditAction, entityType: EntityType, entityName?: string): string {
  const actionText = action.toLowerCase().replace(/_/g, " ");
  const entityText = entityName || entityType.toLowerCase();
  
  switch (action) {
    case AuditAction.CREATE:
      return `Created new ${entityText}`;
    case AuditAction.UPDATE:
      return `Updated ${entityText}`;
    case AuditAction.DELETE:
      return `Deleted ${entityText}`;
    case AuditAction.VIEW:
      return `Viewed ${entityText}`;
    case AuditAction.LOGIN:
      return "User logged in";
    case AuditAction.LOGOUT:
      return "User logged out";
    case AuditAction.EXPORT:
      return `Exported ${entityText} data`;
    case AuditAction.IMPORT:
      return `Imported ${entityText} data`;
    case AuditAction.APPROVE:
      return `Approved ${entityText}`;
    case AuditAction.REJECT:
      return `Rejected ${entityText}`;
    case AuditAction.ASSIGN:
      return `Assigned ${entityText}`;
    case AuditAction.UNASSIGN:
      return `Unassigned ${entityText}`;
    case AuditAction.ACTIVATE:
      return `Activated ${entityText}`;
    case AuditAction.DEACTIVATE:
      return `Deactivated ${entityText}`;
    case AuditAction.RESET_PASSWORD:
      return `Reset password for ${entityText}`;
    case AuditAction.CHANGE_ROLE:
      return `Changed role for ${entityText}`;
    case AuditAction.BULK_OPERATION:
      return `Performed bulk operation on ${entityText}`;
    case AuditAction.SYSTEM_CHANGE:
      return `System change: ${entityText}`;
    case AuditAction.FAILED_LOGIN:
      return "Failed login attempt";
    case AuditAction.PERMISSION_CHANGE:
      return `Changed permissions for ${entityText}`;
    default:
      return `${actionText} ${entityText}`;
  }
}

export class AuditService {
  static log(
    action: AuditAction,
    entityType: EntityType,
    entityId?: string,
    entityName?: string,
    oldValues?: Record<string, any>,
    newValues?: Record<string, any>,
    status: AuditStatus = AuditStatus.SUCCESS,
    metadata?: Record<string, any>
  ): void {
    const user = this.getCurrentUser();
    if (!user) {
      console.warn("No user found for audit logging");
      return;
    }

    const auditLog: AuditLog = {
      id: generateAuditId(),
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userRole: user.role,
      action,
      entityType,
      entityId,
      entityName,
      description: createActionDescription(action, entityType, entityName),
      oldValues,
      newValues,
      ipAddress: getClientIP(),
      userAgent: getUserAgent(),
      timestamp: new Date().toISOString(),
      sessionId: currentSessionId,
      status,
      severity: determineSeverity(action, status),
      department: user.department,
      location: user.location,
      metadata
    };

    // Add to storage (in production, this would be sent to backend)
    auditLogs.push(auditLog);

    // Keep only last 10000 logs in memory
    if (auditLogs.length > 10000) {
      auditLogs = auditLogs.slice(-10000);
    }

    // Log to console for development
    console.log("AUDIT:", auditLog);
  }

  static getCurrentUser() {
    // This would come from your auth context
    try {
      const authData = localStorage.getItem("auth");
      if (authData) {
        return JSON.parse(authData);
      }
    } catch (error) {
      console.error("Error getting current user for audit:", error);
    }
    return null;
  }

  static getLogs(filter?: AuditFilter): AuditLog[] {
    let filteredLogs = [...auditLogs];

    if (filter) {
      if (filter.userId) {
        filteredLogs = filteredLogs.filter(log => log.userId === filter.userId);
      }
      if (filter.action) {
        filteredLogs = filteredLogs.filter(log => log.action === filter.action);
      }
      if (filter.entityType) {
        filteredLogs = filteredLogs.filter(log => log.entityType === filter.entityType);
      }
      if (filter.status) {
        filteredLogs = filteredLogs.filter(log => log.status === filter.status);
      }
      if (filter.severity) {
        filteredLogs = filteredLogs.filter(log => log.severity === filter.severity);
      }
      if (filter.department) {
        filteredLogs = filteredLogs.filter(log => log.department === filter.department);
      }
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        filteredLogs = filteredLogs.filter(log => 
          log.description.toLowerCase().includes(searchLower) ||
          log.userName.toLowerCase().includes(searchLower) ||
          log.userEmail.toLowerCase().includes(searchLower) ||
          log.entityName?.toLowerCase().includes(searchLower)
        );
      }
      if (filter.dateFrom) {
        const fromDate = new Date(filter.dateFrom);
        filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) >= fromDate);
      }
      if (filter.dateTo) {
        const toDate = new Date(filter.dateTo);
        toDate.setHours(23, 59, 59, 999);
        filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) <= toDate);
      }
    }

    // Sort by timestamp (newest first)
    return filteredLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  static getStats(filter?: AuditFilter): AuditStats {
    const logs = this.getLogs(filter);
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const successCount = logs.filter(log => log.status === AuditStatus.SUCCESS).length;
    const failedCount = logs.filter(log => log.status === AuditStatus.FAILED).length;
    const criticalCount = logs.filter(log => log.severity === AuditSeverity.CRITICAL).length;
    const highCount = logs.filter(log => log.severity === AuditSeverity.HIGH).length;
    const mediumCount = logs.filter(log => log.severity === AuditSeverity.MEDIUM).length;
    const lowCount = logs.filter(log => log.severity === AuditSeverity.LOW).length;
    
    const todayCount = logs.filter(log => new Date(log.timestamp) >= today).length;
    const weekCount = logs.filter(log => new Date(log.timestamp) >= weekAgo).length;
    const monthCount = logs.filter(log => new Date(log.timestamp) >= monthAgo).length;

    // Calculate top users
    const userCounts = logs.reduce((acc, log) => {
      const key = log.userId;
      if (!acc[key]) {
        acc[key] = { userId: log.userId, userName: log.userName, actionCount: 0 };
      }
      acc[key].actionCount++;
      return acc;
    }, {} as Record<string, { userId: string; userName: string; actionCount: number }>);

    const topUsers = Object.values(userCounts)
      .sort((a, b) => b.actionCount - a.actionCount)
      .slice(0, 10);

    // Calculate top actions
    const actionCounts = logs.reduce((acc, log) => {
      const key = log.action;
      if (!acc[key]) {
        acc[key] = { action: log.action, count: 0 };
      }
      acc[key].count++;
      return acc;
    }, {} as Record<string, { action: AuditAction; count: number }>);

    const topActions = Object.values(actionCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Calculate top entities
    const entityCounts = logs.reduce((acc, log) => {
      const key = log.entityType;
      if (!acc[key]) {
        acc[key] = { entityType: log.entityType, count: 0 };
      }
      acc[key].count++;
      return acc;
    }, {} as Record<string, { entityType: EntityType; count: number }>);

    const topEntities = Object.values(entityCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalLogs: logs.length,
      successCount,
      failedCount,
      criticalCount,
      highCount,
      mediumCount,
      lowCount,
      todayCount,
      weekCount,
      monthCount,
      topUsers,
      topActions,
      topEntities
    };
  }

  static exportLogs(filter: AuditFilter, format: "CSV" | "JSON" | "PDF" | "EXCEL"): string {
    const logs = this.getLogs(filter);
    
    switch (format) {
      case "CSV":
        return this.exportToCSV(logs);
      case "JSON":
        return this.exportToJSON(logs);
      case "EXCEL":
        return this.exportToCSV(logs); // Simplified - would use a library in production
      case "PDF":
        return this.exportToJSON(logs); // Simplified - would use a library in production
      default:
        return this.exportToJSON(logs);
    }
  }

  private static exportToCSV(logs: AuditLog[]): string {
    const headers = [
      "ID", "User Name", "User Email", "Role", "Action", "Entity Type", "Entity Name",
      "Description", "Status", "Severity", "IP Address", "Timestamp", "Session ID", "Department"
    ];

    const rows = logs.map(log => [
      log.id,
      log.userName,
      log.userEmail,
      log.userRole,
      log.action,
      log.entityType,
      log.entityName || "",
      log.description,
      log.status,
      log.severity,
      log.ipAddress,
      log.timestamp,
      log.sessionId,
      log.department || ""
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(","))
      .join("\n");

    return csvContent;
  }

  private static exportToJSON(logs: AuditLog[]): string {
    return JSON.stringify(logs, null, 2);
  }

  static clearLogs(): void {
    auditLogs = [];
  }

  static initializeMockData(): void {
    const mockLogs: AuditLog[] = [
      {
        id: generateAuditId(),
        userId: "user1",
        userName: "John Doe",
        userEmail: "john.doe@company.com",
        userRole: "admin",
        action: AuditAction.LOGIN,
        entityType: EntityType.SYSTEM,
        description: "User logged in",
        ipAddress: "192.168.1.100",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        sessionId: currentSessionId,
        status: AuditStatus.SUCCESS,
        severity: AuditSeverity.LOW,
        department: "IT"
      },
      {
        id: generateAuditId(),
        userId: "user2",
        userName: "Jane Smith",
        userEmail: "jane.smith@company.com",
        userRole: "hr",
        action: AuditAction.CREATE,
        entityType: EntityType.EMPLOYEE,
        entityId: "emp123",
        entityName: "New Employee",
        description: "Created new employee",
        ipAddress: "192.168.1.101",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        sessionId: currentSessionId,
        status: AuditStatus.SUCCESS,
        severity: AuditSeverity.MEDIUM,
        department: "HR",
        newValues: { name: "New Employee", email: "new@company.com" }
      },
      {
        id: generateAuditId(),
        userId: "user3",
        userName: "Bob Wilson",
        userEmail: "bob.wilson@company.com",
        userRole: "manager",
        action: AuditAction.UPDATE,
        entityType: EntityType.PAYROLL,
        entityId: "payroll456",
        entityName: "Monthly Payroll",
        description: "Updated payroll records",
        ipAddress: "192.168.1.102",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        sessionId: currentSessionId,
        status: AuditStatus.SUCCESS,
        severity: AuditSeverity.MEDIUM,
        department: "Finance",
        oldValues: { amount: 50000 },
        newValues: { amount: 52000 }
      }
    ];

    auditLogs = [...mockLogs];
  }
}

// Initialize mock data on service load
AuditService.initializeMockData();
