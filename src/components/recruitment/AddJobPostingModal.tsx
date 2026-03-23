import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { departmentStats, JobPosting } from "@/data/mockData";
import { Briefcase, MapPin } from "lucide-react";
import { toast } from "sonner";

interface AddJobPostingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (posting: JobPosting) => void;
}

const jobTypes: JobPosting["type"][] = ["full-time", "part-time", "contract"];
const jobStatuses: JobPosting["status"][] = ["open", "draft", "closed"];

export function AddJobPostingModal({ open, onOpenChange, onSave }: AddJobPostingModalProps) {
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState<JobPosting["type"]>("full-time");
  const [status, setStatus] = useState<JobPosting["status"]>("open");

  const reset = () => { setTitle(""); setDepartment(""); setLocation(""); setType("full-time"); setStatus("open"); };

  const handleSave = () => {
    if (!title.trim()) { toast.error("Job title is required"); return; }
    if (!department) { toast.error("Department is required"); return; }
    if (!location.trim()) { toast.error("Location is required"); return; }

    const posting: JobPosting = {
      id: `JOB-${Date.now()}`,
      title: title.trim(),
      department,
      location: location.trim(),
      type,
      status,
      postedDate: new Date().toISOString().slice(0, 10),
      applicants: 0,
    };
    onSave(posting);
    toast.success(`Job posting "${title.trim()}" created`);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) reset(); onOpenChange(v); }}>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle className="text-[15px] font-semibold flex items-center gap-2">
            <Briefcase size={16} className="text-primary" />
            Post New Job
          </DialogTitle>
          <DialogDescription className="text-[12px]">Create a new job posting to start receiving applications.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-1.5">
            <Label className="text-[12px] font-medium">Job Title *</Label>
            <div className="relative">
              <Briefcase size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="e.g. Senior Backend Engineer" value={title} onChange={(e) => setTitle(e.target.value)} className="text-[13px] pl-8" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
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
            <div className="grid gap-1.5">
              <Label className="text-[12px] font-medium">Location *</Label>
              <div className="relative">
                <MapPin size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="e.g. Remote" value={location} onChange={(e) => setLocation(e.target.value)} className="text-[13px] pl-8" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label className="text-[12px] font-medium">Employment Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as JobPosting["type"])}>
                <SelectTrigger className="text-[13px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {jobTypes.map((t) => (
                    <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label className="text-[12px] font-medium">Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as JobPosting["status"])}>
                <SelectTrigger className="text-[13px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {jobStatuses.map((s) => (
                    <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter className="pt-2">
          <Button variant="outline" onClick={() => { reset(); onOpenChange(false); }} className="text-[13px]">Cancel</Button>
          <Button onClick={handleSave} className="text-[13px]" disabled={!title || !department || !location}>Post Job</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
