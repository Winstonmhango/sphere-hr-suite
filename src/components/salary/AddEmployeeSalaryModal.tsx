import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { employees, defaultSalaryComponents, EmployeeSalary, SalaryComponent } from "@/data/mockData";
import { User, DollarSign, Calendar, TrendingUp, TrendingDown, Gift, Search } from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AddEmployeeSalaryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingEmployeeIds: string[];
  onSave: (salary: EmployeeSalary) => void;
}

const currencies = ["USD", "EUR", "GBP", "CAD", "AUD"];

export function AddEmployeeSalaryModal({ open, onOpenChange, existingEmployeeIds, onSave }: AddEmployeeSalaryModalProps) {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [baseSalary, setBaseSalary] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().slice(0, 10));
  const [selectedComponents, setSelectedComponents] = useState<Set<number>>(
    new Set(defaultSalaryComponents.map((_, i) => i))
  );
  const [searchQuery, setSearchQuery] = useState("");

  const availableEmployees = useMemo(
    () => employees.filter((e) => !existingEmployeeIds.includes(e.id) && e.status !== "inactive"),
    [existingEmployeeIds]
  );

  const filteredEmployees = useMemo(
    () => availableEmployees.filter((e) =>
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.department.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [availableEmployees, searchQuery]
  );

  const selectedEmployee = employees.find((e) => e.id === selectedEmployeeId);

  const toggleComponent = (index: number) => {
    setSelectedComponents((prev) => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  };

  const typeIcon = (type: string) =>
    type === "earning" ? <TrendingUp size={12} className="text-emerald-500" /> :
    type === "deduction" ? <TrendingDown size={12} className="text-red-500" /> :
    <Gift size={12} className="text-amber-500" />;

  const handleSave = () => {
    if (!selectedEmployeeId) { toast.error("Please select an employee"); return; }
    const parsed = parseFloat(baseSalary);
    if (isNaN(parsed) || parsed <= 0) { toast.error("Enter a valid base salary"); return; }

    const components: SalaryComponent[] = defaultSalaryComponents
      .filter((_, i) => selectedComponents.has(i))
      .map((c, i) => ({ ...c, id: `SC-NEW-${i}` }));

    onSave({
      employeeId: selectedEmployeeId,
      baseSalary: parsed,
      components,
      effectiveDate,
      currency,
    });

    toast.success(`Salary structure added for ${selectedEmployee?.name}`);
    onOpenChange(false);
    // Reset
    setSelectedEmployeeId("");
    setBaseSalary("");
    setSearchQuery("");
    setSelectedComponents(new Set(defaultSalaryComponents.map((_, i) => i)));
  };

  // Preview calculation
  const parsedBase = parseFloat(baseSalary);
  const monthly = !isNaN(parsedBase) ? parsedBase / 12 : 0;
  const previewEarnings = defaultSalaryComponents
    .filter((c, i) => selectedComponents.has(i) && c.type === "earning")
    .reduce((s, c) => s + (c.isPercentage ? (monthly * c.amount) / 100 : c.amount), 0);
  const previewDeductions = defaultSalaryComponents
    .filter((c, i) => selectedComponents.has(i) && c.type === "deduction")
    .reduce((s, c) => s + (c.isPercentage ? (monthly * c.amount) / 100 : c.amount), 0);
  const previewNet = monthly + previewEarnings - previewDeductions;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-[15px] font-semibold flex items-center gap-2">
            <User size={16} className="text-primary" />
            Add Employee to Salary Register
          </DialogTitle>
          <DialogDescription className="text-[12px]">
            Set up compensation structure for a new employee
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="grid gap-5 py-2">
            {/* Employee Selection */}
            <div className="grid gap-1.5">
              <Label className="text-[12px] font-medium">Employee</Label>
              {availableEmployees.length === 0 ? (
                <p className="text-[12px] text-muted-foreground py-3 text-center border rounded-md bg-accent/20">
                  All active employees already have salary records
                </p>
              ) : (
                <div className="border rounded-md overflow-hidden">
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search employees..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="text-[13px] border-0 border-b rounded-none pl-9 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>
                  <div className="max-h-[140px] overflow-y-auto">
                    {filteredEmployees.map((emp) => (
                      <div
                        key={emp.id}
                        className={`flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors hover:bg-accent/40 ${
                          selectedEmployeeId === emp.id ? "bg-primary/10 border-l-2 border-l-primary" : ""
                        }`}
                        onClick={() => setSelectedEmployeeId(emp.id)}
                      >
                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-[11px] font-semibold text-primary">
                          {emp.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-medium text-foreground truncate">{emp.name}</p>
                          <p className="text-[11px] text-muted-foreground">{emp.department} · {emp.role}</p>
                        </div>
                      </div>
                    ))}
                    {filteredEmployees.length === 0 && (
                      <p className="text-[12px] text-muted-foreground py-4 text-center">No matching employees</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Base Salary + Currency + Date */}
            <div className="grid grid-cols-3 gap-3">
              <div className="grid gap-1.5 col-span-1">
                <Label className="text-[12px] font-medium">Base Salary (Annual)</Label>
                <div className="relative">
                  <DollarSign size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="number"
                    placeholder="e.g. 120000"
                    value={baseSalary}
                    onChange={(e) => setBaseSalary(e.target.value)}
                    className="text-[13px] pl-8 font-mono"
                    min="0"
                  />
                </div>
              </div>
              <div className="grid gap-1.5">
                <Label className="text-[12px] font-medium">Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger className="text-[13px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5">
                <Label className="text-[12px] font-medium">Effective Date</Label>
                <div className="relative">
                  <Calendar size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="date"
                    value={effectiveDate}
                    onChange={(e) => setEffectiveDate(e.target.value)}
                    className="text-[13px] pl-8"
                  />
                </div>
              </div>
            </div>

            {/* Default Components */}
            <div className="grid gap-1.5">
              <Label className="text-[12px] font-medium">Salary Components</Label>
              <p className="text-[11px] text-muted-foreground -mt-0.5">Select default components to include</p>
              <div className="border rounded-md divide-y">
                {defaultSalaryComponents.map((comp, i) => (
                  <label
                    key={i}
                    className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-accent/30 transition-colors"
                  >
                    <Checkbox
                      checked={selectedComponents.has(i)}
                      onCheckedChange={() => toggleComponent(i)}
                    />
                    <span className="flex items-center gap-1.5 flex-1">
                      {typeIcon(comp.type)}
                      <span className="text-[13px] text-foreground">{comp.name}</span>
                    </span>
                    <span className="text-[11px] text-muted-foreground capitalize px-1.5 py-0.5 rounded bg-accent/50">
                      {comp.type}
                    </span>
                    <span className="text-[12px] font-mono text-muted-foreground tabular-nums w-16 text-right">
                      {comp.isPercentage ? `${comp.amount}%` : `$${comp.amount}`}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Preview */}
            {monthly > 0 && (
              <div className="p-4 rounded-md border bg-accent/20 grid grid-cols-3 gap-3">
                <div>
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Monthly Gross</p>
                  <p className="text-[15px] font-mono font-semibold text-foreground mt-0.5 tabular-nums">
                    ${Math.round(monthly + previewEarnings).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Deductions</p>
                  <p className="text-[15px] font-mono font-semibold text-destructive mt-0.5 tabular-nums">
                    -${Math.round(previewDeductions).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Net Pay</p>
                  <p className="text-[15px] font-mono font-bold text-foreground mt-0.5 tabular-nums">
                    ${Math.round(previewNet).toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="text-[13px]">
            Cancel
          </Button>
          <Button onClick={handleSave} className="text-[13px]" disabled={!selectedEmployeeId || !baseSalary}>
            Add Employee
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
