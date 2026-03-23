import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { SalaryComponent, SalaryComponentType } from "@/data/mockData";
import { DollarSign, Percent, TrendingUp, TrendingDown, Gift } from "lucide-react";
import { toast } from "sonner";

interface SalaryComponentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employeeName: string;
  existingComponent?: SalaryComponent;
  onSave: (component: Omit<SalaryComponent, "id">) => void;
}

const typeConfig: Record<SalaryComponentType, { label: string; icon: React.ReactNode; color: string }> = {
  earning: { label: "Earning / Allowance", icon: <TrendingUp size={14} />, color: "text-emerald-600" },
  deduction: { label: "Deduction", icon: <TrendingDown size={14} />, color: "text-red-600" },
  bonus: { label: "Bonus", icon: <Gift size={14} />, color: "text-amber-600" },
};

export function SalaryComponentModal({ open, onOpenChange, employeeName, existingComponent, onSave }: SalaryComponentModalProps) {
  const [name, setName] = useState(existingComponent?.name ?? "");
  const [type, setType] = useState<SalaryComponentType>(existingComponent?.type ?? "earning");
  const [amount, setAmount] = useState(existingComponent?.amount?.toString() ?? "");
  const [isPercentage, setIsPercentage] = useState(existingComponent?.isPercentage ?? false);
  const [recurring, setRecurring] = useState(existingComponent?.recurring ?? true);

  const isEdit = !!existingComponent;

  const handleSave = () => {
    if (!name.trim()) { toast.error("Component name is required"); return; }
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) { toast.error("Enter a valid amount"); return; }
    onSave({ name: name.trim(), type, amount: parsed, isPercentage, recurring });
    toast.success(`${isEdit ? "Updated" : "Added"} salary component: ${name.trim()}`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-[15px] font-semibold">
            {isEdit ? "Edit" : "Add"} Salary Component
          </DialogTitle>
          <DialogDescription className="text-[12px]">
            For <span className="font-medium text-foreground">{employeeName}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          {/* Component Name */}
          <div className="grid gap-1.5">
            <Label className="text-[12px] font-medium">Component Name</Label>
            <Input
              placeholder="e.g. Housing Allowance, Tax, Performance Bonus"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-[13px]"
            />
          </div>

          {/* Type */}
          <div className="grid gap-1.5">
            <Label className="text-[12px] font-medium">Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as SalaryComponentType)}>
              <SelectTrigger className="text-[13px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.entries(typeConfig) as [SalaryComponentType, typeof typeConfig["earning"]][]).map(([key, cfg]) => (
                  <SelectItem key={key} value={key}>
                    <span className="flex items-center gap-2">
                      <span className={cfg.color}>{cfg.icon}</span>
                      {cfg.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Amount + Percentage toggle */}
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label className="text-[12px] font-medium">Amount</Label>
              <div className="relative">
                <Input
                  type="number"
                  placeholder={isPercentage ? "e.g. 15" : "e.g. 500"}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-[13px] pl-8 font-mono"
                  min="0"
                  step="0.01"
                />
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {isPercentage ? <Percent size={14} /> : <DollarSign size={14} />}
                </span>
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label className="text-[12px] font-medium">Calculation Basis</Label>
              <div className="flex items-center gap-3 h-10 px-3 rounded-md border bg-background">
                <span className={`text-[12px] ${!isPercentage ? "font-medium text-foreground" : "text-muted-foreground"}`}>Fixed</span>
                <Switch checked={isPercentage} onCheckedChange={setIsPercentage} />
                <span className={`text-[12px] ${isPercentage ? "font-medium text-foreground" : "text-muted-foreground"}`}>% of Base</span>
              </div>
            </div>
          </div>

          {/* Recurring */}
          <div className="flex items-center justify-between px-3 py-2.5 rounded-md border bg-accent/30">
            <div>
              <p className="text-[13px] font-medium text-foreground">Recurring</p>
              <p className="text-[11px] text-muted-foreground">Applied every pay cycle</p>
            </div>
            <Switch checked={recurring} onCheckedChange={setRecurring} />
          </div>

          {/* Preview */}
          {amount && !isNaN(parseFloat(amount)) && (
            <div className="p-3 rounded-md border bg-accent/20">
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Preview</p>
              <p className="text-[13px] font-mono text-foreground">
                <span className={typeConfig[type].color}>
                  {type === "deduction" ? "−" : "+"}
                </span>{" "}
                {isPercentage ? `${amount}% of base salary` : `$${parseFloat(amount).toLocaleString()}`}
                <span className="text-muted-foreground text-[11px] ml-2">
                  {recurring ? "· monthly" : "· one-time"}
                </span>
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="text-[13px]">
            Cancel
          </Button>
          <Button onClick={handleSave} className="text-[13px]">
            {isEdit ? "Update" : "Add"} Component
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
