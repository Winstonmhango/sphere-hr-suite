import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { jobPostings, Candidate } from "@/data/mockData";
import { User, Mail, Phone, Star } from "lucide-react";
import { toast } from "sonner";

interface AddCandidateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (candidate: Candidate) => void;
}

const sources: Candidate["source"][] = ["linkedin", "referral", "careers-page", "indeed", "other"];
const sourceLabels: Record<Candidate["source"], string> = {
  linkedin: "LinkedIn", referral: "Referral", "careers-page": "Careers Page", indeed: "Indeed", other: "Other",
};

export function AddCandidateModal({ open, onOpenChange, onSave }: AddCandidateModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [jobId, setJobId] = useState("");
  const [source, setSource] = useState<Candidate["source"]>("linkedin");
  const [rating, setRating] = useState(3);
  const [notes, setNotes] = useState("");

  const reset = () => {
    setName(""); setEmail(""); setPhone(""); setJobId("");
    setSource("linkedin"); setRating(3); setNotes("");
  };

  const selectedJob = jobPostings.find((j) => j.id === jobId);

  const handleSave = () => {
    if (!name.trim()) { toast.error("Candidate name is required"); return; }
    if (!email.trim()) { toast.error("Email is required"); return; }
    if (!jobId) { toast.error("Please select a job posting"); return; }

    const candidate: Candidate = {
      id: `CAN-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      role: selectedJob!.title,
      stage: "applied",
      appliedDate: new Date().toISOString().slice(0, 10),
      rating,
      source,
      jobId,
      notes: notes.trim(),
      interviewNotes: [],
      scheduledInterviews: [],
    };
    onSave(candidate);
    toast.success(`${name.trim()} added to pipeline`);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) reset(); onOpenChange(v); }}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-[15px] font-semibold flex items-center gap-2">
            <User size={16} className="text-primary" />
            Add Candidate
          </DialogTitle>
          <DialogDescription className="text-[12px]">Add a new candidate to the recruitment pipeline.</DialogDescription>
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
                <Input type="email" placeholder="jane@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="text-[13px] pl-8" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label className="text-[12px] font-medium">Phone</Label>
              <div className="relative">
                <Phone size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="+1-555-0100" value={phone} onChange={(e) => setPhone(e.target.value)} className="text-[13px] pl-8" />
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label className="text-[12px] font-medium">Source</Label>
              <Select value={source} onValueChange={(v) => setSource(v as Candidate["source"])}>
                <SelectTrigger className="text-[13px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sources.map((s) => (
                    <SelectItem key={s} value={s}>{sourceLabels[s]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label className="text-[12px] font-medium">Job Posting *</Label>
            <Select value={jobId} onValueChange={setJobId}>
              <SelectTrigger className="text-[13px]">
                <SelectValue placeholder="Select a job posting" />
              </SelectTrigger>
              <SelectContent>
                {jobPostings.filter((j) => j.status === "open").map((j) => (
                  <SelectItem key={j.id} value={j.id}>{j.title} — {j.department}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-1.5">
            <Label className="text-[12px] font-medium flex items-center gap-1">
              <Star size={11} /> Initial Rating ({rating}/5)
            </Label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  className={`w-8 h-8 rounded-md text-sm font-medium transition-colors border ${
                    n <= rating
                      ? "bg-amber-400/20 text-amber-600 border-amber-400/40"
                      : "bg-card text-muted-foreground border-border hover:bg-accent"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label className="text-[12px] font-medium">Notes</Label>
            <Textarea
              placeholder="Initial notes about this candidate..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="text-[13px] resize-none"
              rows={2}
            />
          </div>
        </div>

        <DialogFooter className="pt-2">
          <Button variant="outline" onClick={() => { reset(); onOpenChange(false); }} className="text-[13px]">Cancel</Button>
          <Button onClick={handleSave} className="text-[13px]" disabled={!name || !email || !jobId}>Add Candidate</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
