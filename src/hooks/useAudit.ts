import { useEffect } from "react";
import { AuditService } from "@/services/auditService";
import { AuditAction, EntityType, AuditStatus } from "@/types/audit";

export function useAudit() {
  const logAction = (
    action: AuditAction,
    entityType: EntityType,
    entityId?: string,
    entityName?: string,
    oldValues?: Record<string, any>,
    newValues?: Record<string, any>,
    status: AuditStatus = AuditStatus.SUCCESS,
    metadata?: Record<string, any>
  ) => {
    AuditService.log(
      action,
      entityType,
      entityId,
      entityName,
      oldValues,
      newValues,
      status,
      metadata
    );
  };

  const logCreate = (entityType: EntityType, entityId: string, entityName: string, newValues: Record<string, any>) => {
    logAction(AuditAction.CREATE, entityType, entityId, entityName, undefined, newValues);
  };

  const logUpdate = (entityType: EntityType, entityId: string, entityName: string, oldValues: Record<string, any>, newValues: Record<string, any>) => {
    logAction(AuditAction.UPDATE, entityType, entityId, entityName, oldValues, newValues);
  };

  const logDelete = (entityType: EntityType, entityId: string, entityName: string, oldValues?: Record<string, any>) => {
    logAction(AuditAction.DELETE, entityType, entityId, entityName, oldValues);
  };

  const logView = (entityType: EntityType, entityId?: string, entityName?: string) => {
    logAction(AuditAction.VIEW, entityType, entityId, entityName);
  };

  const logLogin = () => {
    logAction(AuditAction.LOGIN, EntityType.SYSTEM);
  };

  const logLogout = () => {
    logAction(AuditAction.LOGOUT, EntityType.SYSTEM);
  };

  const logExport = (entityType: EntityType, entityName?: string, metadata?: Record<string, any>) => {
    logAction(AuditAction.EXPORT, entityType, undefined, entityName, undefined, undefined, AuditStatus.SUCCESS, metadata);
  };

  const logImport = (entityType: EntityType, entityName?: string, metadata?: Record<string, any>) => {
    logAction(AuditAction.IMPORT, entityType, undefined, entityName, undefined, undefined, AuditStatus.SUCCESS, metadata);
  };

  const logApprove = (entityType: EntityType, entityId: string, entityName: string) => {
    logAction(AuditAction.APPROVE, entityType, entityId, entityName);
  };

  const logReject = (entityType: EntityType, entityId: string, entityName: string, reason?: string) => {
    logAction(AuditAction.REJECT, entityType, entityId, entityName, undefined, undefined, AuditStatus.SUCCESS, { reason });
  };

  const logAssign = (entityType: EntityType, entityId: string, entityName: string, assignedTo?: string) => {
    logAction(AuditAction.ASSIGN, entityType, entityId, entityName, undefined, undefined, AuditStatus.SUCCESS, { assignedTo });
  };

  const logUnassign = (entityType: EntityType, entityId: string, entityName: string, unassignedFrom?: string) => {
    logAction(AuditAction.UNASSIGN, entityType, entityId, entityName, undefined, undefined, AuditStatus.SUCCESS, { unassignedFrom });
  };

  const logActivate = (entityType: EntityType, entityId: string, entityName: string) => {
    logAction(AuditAction.ACTIVATE, entityType, entityId, entityName);
  };

  const logDeactivate = (entityType: EntityType, entityId: string, entityName: string) => {
    logAction(AuditAction.DEACTIVATE, entityType, entityId, entityName);
  };

  const logFailedLogin = (username?: string, reason?: string) => {
    logAction(AuditAction.FAILED_LOGIN, EntityType.SYSTEM, undefined, undefined, undefined, undefined, AuditStatus.FAILED, { username, reason });
  };

  const logBulkOperation = (entityType: EntityType, operation: string, count: number, metadata?: Record<string, any>) => {
    logAction(AuditAction.BULK_OPERATION, entityType, undefined, `${operation} (${count} items)`, undefined, undefined, AuditStatus.SUCCESS, { operation, count, ...metadata });
  };

  return {
    logAction,
    logCreate,
    logUpdate,
    logDelete,
    logView,
    logLogin,
    logLogout,
    logExport,
    logImport,
    logApprove,
    logReject,
    logAssign,
    logUnassign,
    logActivate,
    logDeactivate,
    logFailedLogin,
    logBulkOperation
  };
}

// Hook for automatic page view logging
export function usePageAudit(pageName: string, entityType: EntityType) {
  const { logView } = useAudit();

  useEffect(() => {
    logView(entityType, undefined, pageName);
  }, [pageName, entityType, logView]);
}

// Hook for component lifecycle audit logging
export function useComponentAudit(componentName: string, entityType: EntityType) {
  const { logView } = useAudit();

  useEffect(() => {
    logView(entityType, undefined, componentName);
  }, [componentName, entityType, logView]);
}
