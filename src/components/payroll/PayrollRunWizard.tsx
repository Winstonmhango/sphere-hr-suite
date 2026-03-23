import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { employees, employeeSalaries } from "@/data/mockData";
import { Calendar, Users, FileCheck, Rocket, CheckCircle2, ChevronRight, ChevronLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface PayrollRunWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const YEARS = ["2024","2025","2026"];

type Step = "period" | "employees" | "review" | "processing" | "complete";
const STEPS: { key: Step; label: string; icon: React.ReactNode }[] = [
  { key: "period", label: "Pay Period", icon: <Calendar size={14} /> },
  { key: "employees", label: "Employees", icon: <Users size={14} /> },
  { key: "review", label: "Review", icon: <FileCheck size={14} /> },
  { key: "processing", label: "Processing", icon: <Rocket size={14} /> },
  { key: "complete", label: "Complete", icon: <CheckCircle2 size={14} /> },
];

function calcMonthly(employeeId: string) {
  const es = employeeSalaries.find((s) => s.employeeId === employeeId);
  if (!es) return { gross: 0, deductions: 0, net: 0 };
  const monthly = es.baseSalary / 12;
  let earnings = 0, deductions = 0, bonuses = 0;
  es.components.forEach((c) => {
    const amt = c.isPercentage ? (monthly * c.amount) / 100 : c.amount;
    if (c.type === "earning") earnings += amt;
    else if (c.type === "deduction") deductions += amt;
    else bonuses += amt;
  });
  const gross = monthly + earnings + bonuses;
  return { gross, deductions, net: gross - deductions };
}

export function PayrollRunWizard({ open, onOpenChange }: PayrollRunWizardProps) {
  const [step, setStep] = useState<Step>("period");
  const [year, setYear] = useState("2026");
  const [month, setMonth] = useState("2"); // March (0-indexed display, value is index)
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [processingProgress, setProcessingProgress] = useState(0);

  const activeEmployees = employees.filter((e) => e.status !== "inactive");
  const stepIndex = STEPS.findIndex((s) => s.key === step);
  const progressPercent = ((stepIndex + 1) / STEPS.length) * 100;

  // Initialize all employees selected
  const initEmployees = () => {
    if (selectedEmployees.length === 0) {
      setSelectedEmployees(activeEmployees.map((e) => e.id));
    }
  };

  const toggleEmployee = (id: string) => {
    setSelectedEmployees((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    if (selectedEmployees.length === activeEmployees.length) setSelectedEmployees([]);
    else setSelectedEmployees(activeEmployees.map((e) => e.id));
  };

  const totals = useMemo(() => {
    let gross = 0, deductions = 0, net = 0;
    selectedEmployees.forEach((id) => {
      const bd = calcMonthly(id);
      gross += bd.gross;
      deductions += bd.deductions;
      net += bd.net;
    });
    return { gross, deductions, net };
  }, [selectedEmployees]);

  const startProcessing = () => {
    setStep("processing");
    setProcessingProgress(0);
    const steps = [10, 25, 45, 60, 75, 88, 95, 100];
    steps.forEach((val, i) => {
      setTimeout(() => {
        setProcessingProgress(val);
        if (val === 100) {
          setTimeout(() => setStep("complete"), 600);
        }
      }, (i + 1) * 500);
    });
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStep("period");
      setProcessingProgress(0);
      setSelectedEmployees([]);
    }, 300);
  };

  const next = () => {
    if (step === "period") { initEmployees(); setStep("employees"); }
    else if (step === "employees") {
      if (selectedEmployees.length === 0) { toast.error("Select at least one employee"); return; }
      setStep("review");
    }
    else if (step === "review") startProcessing();
  };

  const back = () => {
    if (step === "employees") setStep("period");
    else if (step === "review") setStep("employees");
  };

  const processingSteps = [
    { label: "Validating salary data", threshold: 10 },
    { label: "Calculating gross pay", threshold: 25 },
    { label: "Applying deductions", threshold: 45 },
    { label: "Computing bonuses", threshold: 60 },
    { label: "Tax withholding calculations", threshold: 75 },
    { label: "Generating pay stubs", threshold: 88 },
    { label: "Finalizing payroll", threshold: 95 },
    { label: "Complete", threshold: 100 },
  ];

  return (
    <Dialog open={open} onOpenChange={step === "processing" ? undefined : handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-[15px] font-semibold">Create Payroll Run</DialogTitle>
          <DialogDescription className="text-[12px]">
            {step === "complete" ? "Payroll run completed successfully" : `Step ${stepIndex + 1} of ${STEPS.length}`}
          </DialogDescription>
        </DialogHeader>

        {/* Step Indicator */}
        <div className="flex items-center gap-1 mb-1">
          {STEPS.map((s, i) => (
            <div key={s.key} className="flex items-center flex-1">
              <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium transition-colors w-full justify-center
                ${i < stepIndex ? "bg-primary/10 text-primary" : i === stepIndex ? "bg-primary text-primary-foreground" : "bg-accent text-muted-foreground"}`}>
                {s.icon}
                <span className="hidden sm:inline">{s.label}</span>
              </div>
              {i < STEPS.length - 1 && <ChevronRight size={12} className="text-muted-foreground mx-0.5 shrink-0" />}
            </div>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto min-h-0 py-2">
          {/* Step 1: Pay Period */}
          {step === "period" && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg border bg-accent/20">
                <p className="text-[12px] font-semibold text-foreground mb-3">Select Pay Period</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-1.5">
                    <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Year</label>
                    <Select value={year} onValueChange={setYear}>
                      <SelectTrigger className="text-[13px]"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {YEARS.map((y) => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-1.5">
                    <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Month</label>
                    <Select value={month} onValueChange={setMonth}>
                      <SelectTrigger className="text-[13px]"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {MONTHS.map((m, i) => <SelectItem key={i} value={String(i)}>{m}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg border">
                  <p className="text-[11px] text-muted-foreground">Pay Date</p>
                  <p className="text-[13px] font-medium text-foreground mt-0.5">Last business day of {MONTHS[parseInt(month)]} {year}</p>
                </div>
                <div className="p-3 rounded-lg border">
                  <p className="text-[11px] text-muted-foreground">Eligible Employees</p>
                  <p className="text-[13px] font-medium text-foreground mt-0.5">{activeEmployees.length} active</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Employee Selection */}
          {step === "employees" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <p className="text-[12px] text-muted-foreground">
                  {selectedEmployees.length} of {activeEmployees.length} selected
                </p>
                <Button variant="ghost" size="sm" onClick={toggleAll} className="text-[12px] h-7">
                  {selectedEmployees.length === activeEmployees.length ? "Deselect All" : "Select All"}
                </Button>
              </div>
              <div className="border rounded-lg divide-y max-h-[320px] overflow-y-auto">
                {activeEmployees.map((emp) => {
                  const bd = calcMonthly(emp.id);
                  const checked = selectedEmployees.includes(emp.id);
                  return (
                    <label
                      key={emp.id}
                      className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors hover:bg-accent/30 ${checked ? "bg-accent/20" : ""}`}
                    >
                      <Checkbox checked={checked} onCheckedChange={() => toggleEmployee(emp.id)} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium text-foreground truncate">{emp.name}</p>
                        <p className="text-[11px] text-muted-foreground">{emp.department} · {emp.role}</p>
                      </div>
                      <p className="text-[12px] font-mono text-muted-foreground tabular-nums">${Math.round(bd.net).toLocaleString()}</p>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === "review" && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg border bg-accent/20">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Payroll Summary</p>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <p className="text-[11px] text-muted-foreground">Gross</p>
                    <p className="text-[18px] font-semibold font-mono text-foreground tabular-nums">${Math.round(totals.gross).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground">Deductions</p>
                    <p className="text-[18px] font-semibold font-mono text-red-500 tabular-nums">−${Math.round(totals.deductions).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground">Net Payroll</p>
                    <p className="text-[18px] font-semibold font-mono text-foreground tabular-nums">${Math.round(totals.net).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg border">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Details</p>
                <div className="grid grid-cols-2 gap-y-2 text-[13px]">
                  <span className="text-muted-foreground">Period</span>
                  <span className="font-medium text-foreground">{MONTHS[parseInt(month)]} {year}</span>
                  <span className="text-muted-foreground">Employees</span>
                  <span className="font-medium text-foreground">{selectedEmployees.length}</span>
                  <span className="text-muted-foreground">Frequency</span>
                  <span className="font-medium text-foreground">Monthly</span>
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-medium text-amber-600">Pending Approval</span>
                </div>
              </div>

              {/* Employee list preview */}
              <div className="border rounded-lg">
                <div className="px-4 py-2 border-b bg-accent/30">
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Included Employees</p>
                </div>
                <div className="max-h-[160px] overflow-y-auto divide-y">
                  {selectedEmployees.map((id) => {
                    const emp = employees.find((e) => e.id === id);
                    const bd = calcMonthly(id);
                    if (!emp) return null;
                    return (
                      <div key={id} className="flex items-center justify-between px-4 py-2">
                        <div>
                          <p className="text-[12px] font-medium text-foreground">{emp.name}</p>
                          <p className="text-[11px] text-muted-foreground">{emp.department}</p>
                        </div>
                        <p className="text-[12px] font-mono font-medium text-foreground tabular-nums">${Math.round(bd.net).toLocaleString()}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Processing */}
          {step === "processing" && (
            <div className="space-y-4 py-4">
              <div className="text-center mb-4">
                <Loader2 size={32} className="animate-spin text-primary mx-auto mb-3" />
                <p className="text-[14px] font-medium text-foreground">Processing Payroll</p>
                <p className="text-[12px] text-muted-foreground">{MONTHS[parseInt(month)]} {year} · {selectedEmployees.length} employees</p>
              </div>
              <Progress value={processingProgress} className="h-2" />
              <div className="space-y-1.5">
                {processingSteps.map((ps) => {
                  const done = processingProgress >= ps.threshold;
                  const active = !done && processingProgress >= (ps.threshold - 15);
                  return (
                    <div key={ps.label} className={`flex items-center gap-2 px-3 py-1.5 rounded text-[12px] transition-all
                      ${done ? "text-primary" : active ? "text-foreground font-medium" : "text-muted-foreground/50"}`}>
                      {done ? <CheckCircle2 size={14} className="text-primary" /> : active ? <Loader2 size={14} className="animate-spin" /> : <div className="w-3.5 h-3.5 rounded-full border" />}
                      {ps.label}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 5: Complete */}
          {step === "complete" && (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <CheckCircle2 size={32} className="text-primary" />
              </div>
              <div>
                <p className="text-[16px] font-semibold text-foreground">Payroll Run Complete</p>
                <p className="text-[13px] text-muted-foreground mt-1">{MONTHS[parseInt(month)]} {year} · {selectedEmployees.length} employees processed</p>
              </div>
              <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
                <div className="p-2 rounded border text-center">
                  <p className="text-[10px] text-muted-foreground">Gross</p>
                  <p className="text-[13px] font-mono font-semibold text-foreground">${Math.round(totals.gross).toLocaleString()}</p>
                </div>
                <div className="p-2 rounded border text-center">
                  <p className="text-[10px] text-muted-foreground">Deductions</p>
                  <p className="text-[13px] font-mono font-semibold text-red-500">−${Math.round(totals.deductions).toLocaleString()}</p>
                </div>
                <div className="p-2 rounded border text-center">
                  <p className="text-[10px] text-muted-foreground">Net</p>
                  <p className="text-[13px] font-mono font-semibold text-foreground">${Math.round(totals.net).toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          {(step === "employees" || step === "review") && (
            <Button variant="outline" onClick={back} className="text-[13px] mr-auto">
              <ChevronLeft size={14} className="mr-1" /> Back
            </Button>
          )}
          {step === "complete" ? (
            <Button onClick={handleClose} className="text-[13px]">Done</Button>
          ) : step !== "processing" ? (
            <Button onClick={next} className="text-[13px]">
              {step === "review" ? "Run Payroll" : "Continue"} <ChevronRight size={14} className="ml-1" />
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
