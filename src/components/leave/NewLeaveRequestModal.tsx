import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { employees, LeaveRequest } from "@/data/mockData";
import { Calendar, FileText } from "lucide-react";
import { toast } from "sonner";

interface NewLeaveRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (request: Omit<LeaveRequest, "id" | "status">) => void;
}

const leaveTypes: LeaveRequest["type"][] = ["annual", "sick", "personal", "maternity"];

function calcDays(start: string, end: string): number {
  if (!start || !end) return 0;
  const ms = new Date(end).getTime() - new Date(start).getTime();
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)) + 1);
}

export function NewLeaveRequestModal({ open, onOpenChange, onSave }: NewLeaveRequestModalProps) {
  const [employeeId, setEmployeeId] = useState("");
  const [type, setType] = useState<LeaveRequest["type"]>("annual");
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 10));
  const [reason, setReason] = useState("");

  const reset = () => {
    setEmployeeId(""); setType("annual");
    setStartDate(new Date().toISOString().slice(0, 10));
    setEndDate(new Date().toISOString().slice(0, 10));
    setReason("");
  };

  const days = calcDays(startDate, endDate);
  const selectedEmployee = employees.find((e) => e.id === employeeId);

  const handleSave = () => {
    if (!employeeId) { toast.error("Please select an employee"); return; }
    if (!reason.trim()) { toast.error("Please provide a reason"); return; }
    if (new Date(endDate) < new Date(startDate)) { toast.error("End date must be after start date"); return; }

    onSave({
      employeeId,
      employeeName: selectedEmployee!.name,
      type,
      startDate,
      endDate,
      reason: reason.trim(),
      days,
    });
    toast.success(`Leave request submitted for ${selectedEmployee!.name}`);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) reset(); onOpenChange(v); }}>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle className="text-[15px] font-semibold flex items-center gap-2">
            <Calendar size={16} className="text-primary" />
            New Leave Request
          </DialogTitle>
          <DialogDescription className="text-[12px]">Submit a leave request on behalf of an employee.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-1.5">
            <Label className="text-[12px] font-medium">Employee *</Label>
            <Select value={employeeId} onValueChange={setEmployeeId}>
              <SelectTrigger className="text-[13px]">
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>
              <SelectContent>
                {employees.filter((e) => e.status !== "inactive").map((e) => (
                  <SelectItem key={e.id} value={e.id}>{e.name} — {e.department}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-1.5">
            <Label className="text-[12px] font-medium">Leave Type *</Label>
            <Select value={type} onValueChange={(v) => setType(v as LeaveRequest["type"])}>
              <SelectTrigger className="text-[13px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {leaveTypes.map((t) => (
                  <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label className="text-[12px] font-medium">Start Date *</Label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="text-[13px]" />
            </div>
            <div className="grid gap-1.5">
              <Label className="text-[12px] font-medium">End Date *</Label>
              <Input type="date" value={endDate} min={startDate} onChange={(e) => setEndDate(e.target.value)} className="text-[13px]" />
            </div>
          </div>

          {startDate && endDate && (
            <p className="text-[12px] text-muted-foreground -mt-1">
              Duration: <span className="font-semibold text-foreground">{days} day{days !== 1 ? "s" : ""}</span>
            </p>
          )}

          <div className="grid gap-1.5">
            <Label className="text-[12px] font-medium flex items-center gap-1">
              <FileText size={12} /> Reason *
            </Label>
            <Textarea
              placeholder="Brief description of the leave reason..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="text-[13px] resize-none"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="pt-2">
          <Button variant="outline" onClick={() => { reset(); onOpenChange(false); }} className="text-[13px]">Cancel</Button>
          <Button onClick={handleSave} className="text-[13px]" disabled={!employeeId || !reason.trim()}>Submit Request</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
