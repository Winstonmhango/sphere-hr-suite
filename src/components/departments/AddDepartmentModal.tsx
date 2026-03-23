import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DepartmentStat } from "@/data/mockData";
import { Building2, Users, DollarSign } from "lucide-react";
import { toast } from "sonner";

interface AddDepartmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (department: DepartmentStat) => void;
}

export function AddDepartmentModal({ open, onOpenChange, onSave }: AddDepartmentModalProps) {
  const [name, setName] = useState("");
  const [headcount, setHeadcount] = useState("");
  const [budget, setBudget] = useState("");
  const [utilization, setUtilization] = useState("80");

  const reset = () => { setName(""); setHeadcount(""); setBudget(""); setUtilization("80"); };

  const handleSave = () => {
    if (!name.trim()) { toast.error("Department name is required"); return; }
    const hc = parseInt(headcount);
    if (isNaN(hc) || hc < 0) { toast.error("Enter a valid headcount"); return; }
    const bgt = parseFloat(budget);
    if (isNaN(bgt) || bgt <= 0) { toast.error("Enter a valid budget"); return; }
    const util = parseFloat(utilization);
    if (isNaN(util) || util < 0 || util > 100) { toast.error("Utilization must be between 0 and 100"); return; }

    onSave({ name: name.trim(), headcount: hc, budget: bgt, utilization: util });
    toast.success(`Department "${name.trim()}" created`);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) reset(); onOpenChange(v); }}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-[15px] font-semibold flex items-center gap-2">
            <Building2 size={16} className="text-primary" />
            Add Department
          </DialogTitle>
          <DialogDescription className="text-[12px]">Create a new department and set its initial parameters.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-1.5">
            <Label className="text-[12px] font-medium">Department Name *</Label>
            <div className="relative">
              <Building2 size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="e.g. Legal" value={name} onChange={(e) => setName(e.target.value)} className="text-[13px] pl-8" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label className="text-[12px] font-medium flex items-center gap-1">
                <Users size={11} /> Headcount
              </Label>
              <Input
                type="number"
                placeholder="e.g. 10"
                value={headcount}
                onChange={(e) => setHeadcount(e.target.value)}
                className="text-[13px] font-mono"
                min="0"
              />
            </div>
            <div className="grid gap-1.5">
              <Label className="text-[12px] font-medium">Utilization (%)</Label>
              <Input
                type="number"
                placeholder="e.g. 85"
                value={utilization}
                onChange={(e) => setUtilization(e.target.value)}
                className="text-[13px] font-mono"
                min="0"
                max="100"
              />
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label className="text-[12px] font-medium flex items-center gap-1">
              <DollarSign size={11} /> Annual Budget *
            </Label>
            <div className="relative">
              <DollarSign size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="number"
                placeholder="e.g. 1000000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="text-[13px] pl-7 font-mono"
                min="0"
              />
            </div>
            {budget && !isNaN(parseFloat(budget)) && (
              <p className="text-[11px] text-muted-foreground">
                ${(parseFloat(budget) / 1_000_000).toFixed(2)}M
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="pt-2">
          <Button variant="outline" onClick={() => { reset(); onOpenChange(false); }} className="text-[13px]">Cancel</Button>
          <Button onClick={handleSave} className="text-[13px]" disabled={!name || !budget}>Create Department</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
