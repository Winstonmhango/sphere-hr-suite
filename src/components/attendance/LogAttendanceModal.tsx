import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { employees, AttendanceRecord, AttendanceStatus } from "@/data/mockData";
import { Clock } from "lucide-react";
import { toast } from "sonner";

interface LogAttendanceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultDate?: string;
  onSave: (record: Omit<AttendanceRecord, "id">) => void;
}

const statusOptions: { value: AttendanceStatus; label: string }[] = [
  { value: "present", label: "Present" },
  { value: "absent", label: "Absent" },
  { value: "late", label: "Late" },
  { value: "half-day", label: "Half Day" },
  { value: "remote", label: "Remote" },
];

function calcHours(checkIn: string, checkOut: string): number | undefined {
  if (!checkIn || !checkOut) return undefined;
  const [ih, im] = checkIn.split(":").map(Number);
  const [oh, om] = checkOut.split(":").map(Number);
  const mins = (oh * 60 + om) - (ih * 60 + im);
  return mins > 0 ? Math.round((mins / 60) * 100) / 100 : undefined;
}

export function LogAttendanceModal({ open, onOpenChange, defaultDate, onSave }: LogAttendanceModalProps) {
  const today = new Date().toISOString().slice(0, 10);
  const [employeeId, setEmployeeId] = useState("");
  const [date, setDate] = useState(defaultDate ?? today);
  const [status, setStatus] = useState<AttendanceStatus>("present");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [note, setNote] = useState("");

  const reset = () => {
    setEmployeeId(""); setDate(defaultDate ?? today); setStatus("present");
    setCheckIn(""); setCheckOut(""); setNote("");
  };

  const showTimes = status !== "absent";
  const hoursWorked = calcHours(checkIn, checkOut);
  const selectedEmployee = employees.find((e) => e.id === employeeId);

  const handleSave = () => {
    if (!employeeId) { toast.error("Please select an employee"); return; }

    onSave({
      employeeId,
      employeeName: selectedEmployee!.name,
      date,
      status,
      checkIn: showTimes && checkIn ? checkIn : undefined,
      checkOut: showTimes && checkOut ? checkOut : undefined,
      hoursWorked,
      note: note.trim() || undefined,
    });
    toast.success(`Attendance logged for ${selectedEmployee!.name}`);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) reset(); onOpenChange(v); }}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle className="text-[15px] font-semibold flex items-center gap-2">
            <Clock size={16} className="text-primary" />
            Log Attendance
          </DialogTitle>
          <DialogDescription className="text-[12px]">Manually log an attendance record for an employee.</DialogDescription>
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

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label className="text-[12px] font-medium">Date *</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="text-[13px]" />
            </div>
            <div className="grid gap-1.5">
              <Label className="text-[12px] font-medium">Status *</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as AttendanceStatus)}>
                <SelectTrigger className="text-[13px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((s) => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {showTimes && (
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label className="text-[12px] font-medium">Check In</Label>
                <Input type="time" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="text-[13px] font-mono" />
              </div>
              <div className="grid gap-1.5">
                <Label className="text-[12px] font-medium">Check Out</Label>
                <Input type="time" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="text-[13px] font-mono" />
              </div>
            </div>
          )}

          {hoursWorked !== undefined && (
            <p className="text-[12px] text-muted-foreground -mt-1">
              Hours worked: <span className="font-semibold text-foreground">{hoursWorked.toFixed(1)}h</span>
            </p>
          )}

          <div className="grid gap-1.5">
            <Label className="text-[12px] font-medium">Note</Label>
            <Textarea
              placeholder="Optional note (e.g. working from home, traffic delay...)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="text-[13px] resize-none"
              rows={2}
            />
          </div>
        </div>

        <DialogFooter className="pt-2">
          <Button variant="outline" onClick={() => { reset(); onOpenChange(false); }} className="text-[13px]">Cancel</Button>
          <Button onClick={handleSave} className="text-[13px]" disabled={!employeeId}>Log Attendance</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
