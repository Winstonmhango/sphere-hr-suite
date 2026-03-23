import { useState } from "react";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/layout/AppLayout";
import { leaveRequests as initialRequests, LeaveRequest } from "@/data/mockData";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Check, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NewLeaveRequestModal } from "@/components/leave/NewLeaveRequestModal";

type TabType = "all" | "pending" | "approved" | "rejected";

export default function Leave() {
  const [requests, setRequests] = useState<LeaveRequest[]>(initialRequests);
  const [tab, setTab] = useState<TabType>("all");
  const [modalOpen, setModalOpen] = useState(false);

  const tabs: { value: TabType; label: string; count: number }[] = [
    { value: "all", label: "All", count: requests.length },
    { value: "pending", label: "Pending", count: requests.filter((r) => r.status === "pending").length },
    { value: "approved", label: "Approved", count: requests.filter((r) => r.status === "approved").length },
    { value: "rejected", label: "Rejected", count: requests.filter((r) => r.status === "rejected").length },
  ];

  const filtered = tab === "all" ? requests : requests.filter((r) => r.status === tab);

  const updateStatus = (id: string, status: "approved" | "rejected") => {
    setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
  };

  return (
    <AppLayout title="Leave Management" subtitle={`${requests.filter(r => r.status === 'pending').length} pending requests`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
      {/* Segmented Control */}
      <div className="flex items-center rounded-lg border bg-card p-0.5 w-fit">
        {tabs.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`px-3 py-1.5 rounded-md text-[12px] transition-colors flex items-center gap-1.5 ${
              tab === t.value
                ? "bg-accent text-foreground font-medium"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
              tab === t.value ? "bg-primary/10 text-primary" : "bg-accent text-muted-foreground"
            }`}>
              {t.count}
            </span>
          </button>
        ))}
      </div>
        <Button size="sm" className="h-8 text-[13px] gap-1.5" onClick={() => setModalOpen(true)}>
          <Plus size={14} /> New Request
        </Button>
      </div>

      {/* Table */}
      <div className="sphere-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-accent/50">
              <th className="text-left py-3 px-5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Employee</th>
              <th className="text-left py-3 px-5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Type</th>
              <th className="text-left py-3 px-5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Period</th>
              <th className="text-left py-3 px-5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Days</th>
              <th className="text-left py-3 px-5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Reason</th>
              <th className="text-left py-3 px-5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="text-right py-3 px-5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((req, i) => (
              <motion.tr
                key={req.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03, duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="border-b last:border-b-0 hover:bg-accent/30 transition-colors"
              >
                <td className="py-3.5 px-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-[11px] font-semibold text-primary">
                        {req.employeeName.split(" ").map((n) => n[0]).join("")}
                      </span>
                    </div>
                    <span className="text-[13px] font-medium text-foreground">{req.employeeName}</span>
                  </div>
                </td>
                <td className="py-3.5 px-5 text-[13px] text-muted-foreground capitalize">{req.type}</td>
                <td className="py-3.5 px-5 text-[12px] text-muted-foreground tabular-nums">
                  {new Date(req.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  {" – "}
                  {new Date(req.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </td>
                <td className="py-3.5 px-5 text-[13px] font-mono text-foreground tabular-nums">{req.days}</td>
                <td className="py-3.5 px-5 text-[13px] text-muted-foreground max-w-[200px] truncate">{req.reason}</td>
                <td className="py-3.5 px-5">
                  <StatusBadge status={req.status} />
                </td>
                <td className="py-3.5 px-5">
                  {req.status === "pending" && (
                    <div className="flex items-center justify-end gap-1.5">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => updateStatus(req.id, "approved")}
                        className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-emerald-50 text-emerald-600 transition-colors"
                      >
                        <Check size={14} />
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => updateStatus(req.id, "rejected")}
                        className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-red-50 text-red-500 transition-colors"
                      >
                        <X size={14} />
                      </motion.button>
                    </div>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <NewLeaveRequestModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSave={(req) => {
          const newReq: LeaveRequest = { ...req, id: `LR-${Date.now()}`, status: "pending" };
          setRequests((prev) => [...prev, newReq]);
        }}
      />
    </AppLayout>
  );
}
