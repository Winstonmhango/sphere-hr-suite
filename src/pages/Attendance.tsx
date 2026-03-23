import { useState } from "react";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/layout/AppLayout";
import { attendanceRecords as initialRecords, AttendanceRecord, AttendanceStatus } from "@/data/mockData";
import { Clock, UserCheck, UserX, Timer, Laptop, AlertCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogAttendanceModal } from "@/components/attendance/LogAttendanceModal";

const statusConfig: Record<AttendanceStatus, { label: string; color: string; icon: typeof Clock }> = {
  present: { label: "Present", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20", icon: UserCheck },
  absent: { label: "Absent", color: "bg-red-500/10 text-red-600 border-red-500/20", icon: UserX },
  late: { label: "Late", color: "bg-amber-500/10 text-amber-600 border-amber-500/20", icon: AlertCircle },
  "half-day": { label: "Half Day", color: "bg-blue-500/10 text-blue-600 border-blue-500/20", icon: Timer },
  remote: { label: "Remote", color: "bg-violet-500/10 text-violet-600 border-violet-500/20", icon: Laptop },
};

export default function Attendance() {
  const [records, setRecords] = useState<AttendanceRecord[]>(initialRecords);
  const [selectedDate, setSelectedDate] = useState("2026-03-22");
  const [modalOpen, setModalOpen] = useState(false);

  const dayRecords = records.filter((r) => r.date === selectedDate);

  const summary = {
    present: dayRecords.filter((r) => r.status === "present").length,
    absent: dayRecords.filter((r) => r.status === "absent").length,
    late: dayRecords.filter((r) => r.status === "late").length,
    remote: dayRecords.filter((r) => r.status === "remote").length,
  };

  return (
    <AppLayout title="Attendance" subtitle={new Date(selectedDate).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}>
      {/* Date Picker & Summary */}
      <div className="flex items-center gap-4 mb-6">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="sphere-card px-4 py-2 text-[13px] text-foreground bg-card border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <Button size="sm" className="h-8 text-[13px] gap-1.5" onClick={() => setModalOpen(true)}>
          <Plus size={14} /> Log Attendance
        </Button>
        <div className="flex gap-3 ml-auto">
          {(["present", "absent", "late", "remote"] as const).map((s) => {
            const cfg = statusConfig[s];
            return (
              <div key={s} className="sphere-card px-4 py-2.5 flex items-center gap-2">
                <cfg.icon size={14} />
                <span className="text-[12px] font-medium text-muted-foreground capitalize">{s}</span>
                <span className="text-[16px] font-semibold text-foreground tabular-nums">{summary[s]}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Attendance Table */}
      <div className="sphere-card overflow-hidden">
        <div className="px-5 py-3.5 border-b bg-accent/50">
          <h2 className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Daily Attendance Log</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Employee</th>
              <th className="text-left py-3 px-5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="text-left py-3 px-5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Check In</th>
              <th className="text-left py-3 px-5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Check Out</th>
              <th className="text-right py-3 px-5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Hours</th>
              <th className="text-left py-3 px-5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Note</th>
            </tr>
          </thead>
          <tbody>
            {dayRecords.length === 0 ? (
              <tr><td colSpan={6} className="py-12 text-center text-muted-foreground text-[13px]">No attendance records for this date.</td></tr>
            ) : (
              dayRecords.map((rec, i) => {
                const cfg = statusConfig[rec.status];
                return (
                  <motion.tr
                    key={rec.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b last:border-b-0 hover:bg-accent/30 transition-colors"
                  >
                    <td className="py-3 px-5 text-[13px] font-medium text-foreground">{rec.employeeName}</td>
                    <td className="py-3 px-5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${cfg.color}`}>
                        <cfg.icon size={12} />
                        {cfg.label}
                      </span>
                    </td>
                    <td className="py-3 px-5 text-[13px] font-mono text-foreground tabular-nums">{rec.checkIn || "—"}</td>
                    <td className="py-3 px-5 text-[13px] font-mono text-foreground tabular-nums">{rec.checkOut || "—"}</td>
                    <td className="py-3 px-5 text-right text-[13px] font-mono text-foreground tabular-nums">{rec.hoursWorked?.toFixed(1) || "—"}</td>
                    <td className="py-3 px-5 text-[12px] text-muted-foreground">{rec.note || "—"}</td>
                  </motion.tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <LogAttendanceModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        defaultDate={selectedDate}
        onSave={(rec) => {
          const newRec: AttendanceRecord = { ...rec, id: `ATT-${Date.now()}` };
          setRecords((prev) => [...prev, newRec]);
        }}
      />
    </AppLayout>
  );
}
