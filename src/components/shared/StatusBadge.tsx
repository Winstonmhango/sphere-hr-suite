interface StatusBadgeProps {
  status: "active" | "on-leave" | "inactive" | "probation" | "pending" | "approved" | "rejected";
}

const statusConfig: Record<string, { className: string; label: string }> = {
  active: { className: "status-active", label: "Active" },
  "on-leave": { className: "status-pending", label: "On Leave" },
  inactive: { className: "status-inactive", label: "Inactive" },
  probation: { className: "bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-600/20", label: "Probation" },
  pending: { className: "status-pending", label: "Pending" },
  approved: { className: "status-active", label: "Approved" },
  rejected: { className: "status-rejected", label: "Rejected" },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.active;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider ${config.className}`}>
      {config.label}
    </span>
  );
}
