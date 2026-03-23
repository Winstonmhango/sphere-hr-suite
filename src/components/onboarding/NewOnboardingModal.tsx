import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { defaultOnboardingTasks, OnboardingChecklist, OnboardingTaskStatus, candidates } from "@/data/mockData";
import { ClipboardList, Calendar, User } from "lucide-react";
import { toast } from "sonner";

interface NewOnboardingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingCandidateIds: string[];
  onSave: (checklist: OnboardingChecklist) => void;
}

export function NewOnboardingModal({ open, onOpenChange, existingCandidateIds, onSave }: NewOnboardingModalProps) {
  const today = new Date().toISOString().slice(0, 10);
  const [mode, setMode] = useState<"hired" | "manual">("hired");
  const [candidateId, setCandidateId] = useState("");
  const [manualName, setManualName] = useState("");
  const [manualRole, setManualRole] = useState("");
  const [startDate, setStartDate] = useState(today);

  const reset = () => {
    setMode("hired"); setCandidateId(""); setManualName(""); setManualRole(""); setStartDate(today);
  };

  const hiredCandidates = candidates.filter(
    (c) => c.stage === "hired" && !existingCandidateIds.includes(c.id)
  );

  const selectedCandidate = candidates.find((c) => c.id === candidateId);

  const displayName = mode === "hired" ? selectedCandidate?.name ?? "" : manualName;
  const displayRole = mode === "hired" ? selectedCandidate?.role ?? "" : manualRole;

  const handleSave = () => {
    if (mode === "hired" && !candidateId) { toast.error("Please select a hired candidate"); return; }
    if (mode === "manual" && !manualName.trim()) { toast.error("Employee name is required"); return; }
    if (mode === "manual" && !manualRole.trim()) { toast.error("Role is required"); return; }
    if (!startDate) { toast.error("Start date is required"); return; }

    const dueDate = new Date(new Date(startDate).getTime() + 7 * 24 * 60 * 60 * 1000)
      .toISOString().slice(0, 10);

    const checklist: OnboardingChecklist = {
      id: `OB-${Date.now()}`,
      candidateId: mode === "hired" ? candidateId : `MANUAL-${Date.now()}`,
      candidateName: displayName.trim(),
      role: displayRole.trim(),
      startDate,
      createdDate: today,
      status: "active",
      tasks: defaultOnboardingTasks.map((t, i) => ({
        ...t,
        id: `OBT-NEW-${i}`,
        dueDate,
        status: "pending" as OnboardingTaskStatus,
      })),
    };

    onSave(checklist);
    toast.success(`Onboarding checklist created for ${displayName.trim()}`);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) reset(); onOpenChange(v); }}>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle className="text-[15px] font-semibold flex items-center gap-2">
            <ClipboardList size={16} className="text-primary" />
            New Onboarding Checklist
          </DialogTitle>
          <DialogDescription className="text-[12px]">
            Create an onboarding checklist for a new hire. All default tasks will be included automatically.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          {/* Mode Switch */}
          <div className="flex items-center rounded-lg border bg-card p-0.5 w-fit">
            {[
              { value: "hired", label: "From Pipeline" },
              { value: "manual", label: "Manual Entry" },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setMode(opt.value as "hired" | "manual")}
                className={`px-3 py-1.5 rounded-md text-[12px] transition-colors ${
                  mode === opt.value
                    ? "bg-accent text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {mode === "hired" ? (
            <div className="grid gap-1.5">
              <Label className="text-[12px] font-medium">Hired Candidate *</Label>
              {hiredCandidates.length === 0 ? (
                <p className="text-[12px] text-muted-foreground py-3 text-center border rounded-md bg-accent/20">
                  No hired candidates without a checklist
                </p>
              ) : (
                <Select value={candidateId} onValueChange={setCandidateId}>
                  <SelectTrigger className="text-[13px]">
                    <SelectValue placeholder="Select a hired candidate" />
                  </SelectTrigger>
                  <SelectContent>
                    {hiredCandidates.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name} — {c.role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label className="text-[12px] font-medium">Employee Name *</Label>
                <div className="relative">
                  <User size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="e.g. Jane Smith" value={manualName} onChange={(e) => setManualName(e.target.value)} className="text-[13px] pl-8" />
                </div>
              </div>
              <div className="grid gap-1.5">
                <Label className="text-[12px] font-medium">Role *</Label>
                <Input placeholder="e.g. Software Engineer" value={manualRole} onChange={(e) => setManualRole(e.target.value)} className="text-[13px]" />
              </div>
            </div>
          )}

          <div className="grid gap-1.5">
            <Label className="text-[12px] font-medium flex items-center gap-1">
              <Calendar size={11} /> Start Date *
            </Label>
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="text-[13px]" />
          </div>

          <div className="p-3 rounded-md border bg-accent/20 text-[12px] text-muted-foreground">
            <span className="font-semibold text-foreground">{defaultOnboardingTasks.length} tasks</span> will be created automatically covering documents, equipment, access, orientation, and training.
          </div>
        </div>

        <DialogFooter className="pt-2">
          <Button variant="outline" onClick={() => { reset(); onOpenChange(false); }} className="text-[13px]">Cancel</Button>
          <Button
            onClick={handleSave}
            className="text-[13px]"
            disabled={
              !startDate ||
              (mode === "hired" && !candidateId) ||
              (mode === "manual" && (!manualName.trim() || !manualRole.trim()))
            }
          >
            Create Checklist
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
