export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: string;
  action: AuditAction;
  entityType: EntityType;
  entityId?: string;
  entityName?: string;
  description: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  sessionId: string;
  status: AuditStatus;
  severity: AuditSeverity;
  department?: string;
  location?: string;
  metadata?: Record<string, any>;
}

export enum AuditAction {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
  VIEW = "VIEW",
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
  EXPORT = "EXPORT",
  IMPORT = "IMPORT",
  APPROVE = "APPROVE",
  REJECT = "REJECT",
  ASSIGN = "ASSIGN",
  UNASSIGN = "UNASSIGN",
  ACTIVATE = "ACTIVATE",
  DEACTIVATE = "DEACTIVATE",
  RESET_PASSWORD = "RESET_PASSWORD",
  CHANGE_ROLE = "CHANGE_ROLE",
  BULK_OPERATION = "BULK_OPERATION",
  SYSTEM_CHANGE = "SYSTEM_CHANGE",
  FAILED_LOGIN = "FAILED_LOGIN",
  PERMISSION_CHANGE = "PERMISSION_CHANGE"
}

export enum EntityType {
  USER = "USER",
  EMPLOYEE = "EMPLOYEE",
  DEPARTMENT = "DEPARTMENT",
  ROLE = "ROLE",
  PAYROLL = "PAYROLL",
  LEAVE = "LEAVE",
  ATTENDANCE = "ATTENDANCE",
  TASK = "TASK",
  REPORT = "REPORT",
  VOUCHER = "VOUCHER",
  INVOICE = "INVOICE",
  CUSTOMER = "CUSTOMER",
  SUPPLIER = "SUPPLIER",
  PRODUCT = "PRODUCT",
  WAREHOUSE = "WAREHOUSE",
  BUDGET = "BUDGET",
  INVENTORY = "INVENTORY",
  SYSTEM = "SYSTEM",
  SETTINGS = "SETTINGS"
}

export enum AuditStatus {
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
  PENDING = "PENDING",
  WARNING = "WARNING"
}

export enum AuditSeverity {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL"
}

export interface AuditFilter {
  userId?: string;
  action?: AuditAction;
  entityType?: EntityType;
  status?: AuditStatus;
  severity?: AuditSeverity;
  department?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface AuditStats {
  totalLogs: number;
  successCount: number;
  failedCount: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  todayCount: number;
  weekCount: number;
  monthCount: number;
  topUsers: Array<{
    userId: string;
    userName: string;
    actionCount: number;
  }>;
  topActions: Array<{
    action: AuditAction;
    count: number;
  }>;
  topEntities: Array<{
    entityType: EntityType;
    count: number;
  }>;
}

export interface AuditExportOptions {
  format: "CSV" | "JSON" | "PDF" | "EXCEL";
  filters: AuditFilter;
  includeMetadata: boolean;
  dateRange: {
    from: string;
    to: string;
  };
}
