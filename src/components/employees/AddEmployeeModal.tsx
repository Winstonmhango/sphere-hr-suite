import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { departmentStats, Employee } from "@/data/mockData";
import { User, Mail, Briefcase, DollarSign, Calendar } from "lucide-react";
import { toast } from "sonner";

interface AddEmployeeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (employee: Omit<Employee, "id">) => void;
}

const statusOptions: Employee["status"][] = ["active", "probation", "on-leave", "inactive"];

export function AddEmployeeModal({ open, onOpenChange, onSave }: AddEmployeeModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState<Employee["status"]>("active");
  const [salary, setSalary] = useState("");
  const [hireDate, setHireDate] = useState(new Date().toISOString().slice(0, 10));

  const reset = () => {
    setName(""); setEmail(""); setRole(""); setDepartment("");
    setStatus("active"); setSalary(""); setHireDate(new Date().toISOString().slice(0, 10));
  };

  const handleSave = () => {
    if (!name.trim()) { toast.error("Name is required"); return; }
    if (!email.trim()) { toast.error("Email is required"); return; }
    if (!role.trim()) { toast.error("Role is required"); return; }
    if (!department) { toast.error("Department is required"); return; }
    const parsedSalary = parseFloat(salary);
    if (isNaN(parsedSalary) || parsedSalary <= 0) { toast.error("Enter a valid salary"); return; }

    onSave({ name: name.trim(), email: email.trim(), role: role.trim(), department, status, salary: parsedSalary, hireDate });
    toast.success(`${name.trim()} added to directory`);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) reset(); onOpenChange(v); }}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-[15px] font-semibold flex items-center gap-2">
            <User size={16} className="text-primary" />
            Add New Employee
          </DialogTitle>
          <DialogDescription className="text-[12px]">Fill in the employee's details to add them to the directory.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label className="text-[12px] font-medium">Full Name *</Label>
              <div className="relative">
                <User size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="e.g. Jane Smith" value={name} onChange={(e) => setName(e.target.value)} className="text-[13px] pl-8" />
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label className="text-[12px] font-medium">Email *</Label>
              <div className="relative">
                <Mail size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input type="email" placeholder="jane@sphere.io" value={email} onChange={(e) => setEmail(e.target.value)} className="text-[13px] pl-8" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label className="text-[12px] font-medium">Role / Title *</Label>
              <div className="relative">
                <Briefcase size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="e.g. Senior Engineer" value={role} onChange={(e) => setRole(e.target.value)} className="text-[13px] pl-8" />
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label className="text-[12px] font-medium">Department *</Label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger className="text-[13px]">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departmentStats.map((d) => (
                    <SelectItem key={d.name} value={d.name}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="grid gap-1.5">
              <Label className="text-[12px] font-medium">Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as Employee["status"])}>
                <SelectTrigger className="text-[13px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((s) => (
                    <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label className="text-[12px] font-medium">Salary (Annual) *</Label>
              <div className="relative">
                <DollarSign size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input type="number" placeholder="120000" value={salary} onChange={(e) => setSalary(e.target.value)} className="text-[13px] pl-7 font-mono" min="0" />
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label className="text-[12px] font-medium">Hire Date</Label>
              <div className="relative">
                <Calendar size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input type="date" value={hireDate} onChange={(e) => setHireDate(e.target.value)} className="text-[13px] pl-8" />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="pt-2">
          <Button variant="outline" onClick={() => { reset(); onOpenChange(false); }} className="text-[13px]">Cancel</Button>
          <Button onClick={handleSave} className="text-[13px]" disabled={!name || !email || !role || !department || !salary}>Add Employee</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
