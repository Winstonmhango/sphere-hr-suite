import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Mail, Phone, Calendar, ExternalLink, Star, ArrowRight,
  FileText, Upload, Clock, Plus, MapPin, Users, MessageSquare,
  CheckCircle2, XCircle, AlertCircle,
} from "lucide-react";
import {
  type Candidate, type PipelineStage, type InterviewNote, type ScheduledInterview,
} from "@/data/mockData";

const stageConfig: Record<PipelineStage, { label: string; color: string; bgColor: string }> = {
  applied: { label: "Applied", color: "text-muted-foreground", bgColor: "bg-muted" },
  screening: { label: "Screening", color: "text-blue-700", bgColor: "bg-blue-50" },
  interview: { label: "Interview", color: "text-amber-700", bgColor: "bg-amber-50" },
  offer: { label: "Offer", color: "text-violet-700", bgColor: "bg-violet-50" },
  hired: { label: "Hired", color: "text-emerald-700", bgColor: "bg-emerald-50" },
  rejected: { label: "Rejected", color: "text-destructive", bgColor: "bg-red-50" },
};

const pipelineStages: PipelineStage[] = ["applied", "screening", "interview", "offer", "hired"];

const sourceLabels: Record<string, string> = {
  linkedin: "LinkedIn", referral: "Referral", "careers-page": "Careers Page", indeed: "Indeed", other: "Other",
};

const noteTypeConfig: Record<string, { label: string; icon: typeof MessageSquare; color: string }> = {
  "phone-screen": { label: "Phone Screen", icon: Phone, color: "text-blue-600" },
  technical: { label: "Technical", icon: AlertCircle, color: "text-amber-600" },
  behavioral: { label: "Behavioral", icon: Users, color: "text-violet-600" },
  "culture-fit": { label: "Culture Fit", icon: CheckCircle2, color: "text-emerald-600" },
  note: { label: "Note", icon: MessageSquare, color: "text-muted-foreground" },
};

const interviewStatusIcon = {
  scheduled: <Clock size={12} className="text-amber-500" />,
  completed: <CheckCircle2 size={12} className="text-emerald-500" />,
  cancelled: <XCircle size={12} className="text-destructive" />,
};

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={12} className={i < rating ? "fill-amber-400 text-amber-400" : "text-border"} />
      ))}
    </div>
  );
}

interface CandidateSlideOverProps {
  candidate: Candidate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMove: (id: string, stage: PipelineStage) => void;
  onAddNote: (id: string, note: InterviewNote) => void;
  onAddInterview: (id: string, interview: ScheduledInterview) => void;
  onUploadResume: (id: string, fileName: string) => void;
}

export function CandidateSlideOver({
  candidate, open, onOpenChange, onMove, onAddNote, onAddInterview, onUploadResume,
}: CandidateSlideOverProps) {
  const [newNoteContent, setNewNoteContent] = useState("");
  const [newNoteType, setNewNoteType] = useState<InterviewNote["type"]>("note");
  const [newNoteRating, setNewNoteRating] = useState<number>(0);

  const [newInterviewDate, setNewInterviewDate] = useState("");
  const [newInterviewTime, setNewInterviewTime] = useState("");
  const [newInterviewType, setNewInterviewType] = useState<ScheduledInterview["type"]>("phone-screen");
  const [newInterviewers, setNewInterviewers] = useState("");
  const [newInterviewLocation, setNewInterviewLocation] = useState("");

  const [showAddNote, setShowAddNote] = useState(false);
  const [showAddInterview, setShowAddInterview] = useState(false);

  if (!candidate) return null;

  const stageIdx = pipelineStages.indexOf(candidate.stage);
  const nextStage = stageIdx < pipelineStages.length - 1 ? pipelineStages[stageIdx + 1] : null;

  const handleAddNote = () => {
    if (!newNoteContent.trim()) return;
    const note: InterviewNote = {
      id: `IN-${Date.now()}`,
      author: "You",
      date: new Date().toISOString().split("T")[0],
      type: newNoteType,
      content: newNoteContent,
      ...(newNoteRating > 0 ? { rating: newNoteRating } : {}),
    };
    onAddNote(candidate.id, note);
    setNewNoteContent("");
    setNewNoteType("note");
    setNewNoteRating(0);
    setShowAddNote(false);
  };

  const handleAddInterview = () => {
    if (!newInterviewDate || !newInterviewTime) return;
    const interview: ScheduledInterview = {
      id: `SI-${Date.now()}`,
      date: newInterviewDate,
      time: newInterviewTime,
      type: newInterviewType,
      interviewers: newInterviewers.split(",").map(s => s.trim()).filter(Boolean),
      location: newInterviewLocation || "TBD",
      status: "scheduled",
    };
    onAddInterview(candidate.id, interview);
    setNewInterviewDate("");
    setNewInterviewTime("");
    setNewInterviewType("phone-screen");
    setNewInterviewers("");
    setNewInterviewLocation("");
    setShowAddInterview(false);
  };

  const handleResumeUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.doc,.docx";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) onUploadResume(candidate.id, file.name);
    };
    input.click();
  };

  const sortedNotes = [...candidate.interviewNotes].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto p-0">
        {/* Header */}
        <div className="p-5 pb-4 border-b bg-accent/30">
          <SheetHeader className="mb-3">
            <SheetTitle className="text-base sr-only">Candidate Details</SheetTitle>
          </SheetHeader>
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-sm font-semibold text-primary">
                {candidate.name.split(" ").map(n => n[0]).join("")}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-[15px] font-semibold text-foreground">{candidate.name}</h2>
              <p className="text-[13px] text-muted-foreground">{candidate.role}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${stageConfig[candidate.stage].bgColor} ${stageConfig[candidate.stage].color}`}>
                  {stageConfig[candidate.stage].label}
                </span>
                <RatingStars rating={candidate.rating} />
              </div>
            </div>
          </div>

          {/* Contact row */}
          <div className="grid grid-cols-2 gap-2 mt-3 text-[12px]">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Mail size={12} /> <span className="truncate">{candidate.email}</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Phone size={12} /> {candidate.phone}
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar size={12} /> Applied {candidate.appliedDate}
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <ExternalLink size={12} /> {sourceLabels[candidate.source]}
            </div>
          </div>

          {/* Actions */}
          {nextStage && candidate.stage !== "rejected" && (
            <div className="flex gap-2 mt-3">
              <Button size="sm" className="flex-1 text-[12px] h-7" onClick={() => onMove(candidate.id, nextStage)}>
                Move to {stageConfig[nextStage].label} <ArrowRight size={12} />
              </Button>
              <Button size="sm" variant="destructive" className="text-[12px] h-7" onClick={() => onMove(candidate.id, "rejected")}>
                Reject
              </Button>
            </div>
          )}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="notes" className="flex-1">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent px-5 h-9">
            <TabsTrigger value="notes" className="text-[12px] data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
              Notes ({candidate.interviewNotes.length})
            </TabsTrigger>
            <TabsTrigger value="schedule" className="text-[12px] data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
              Schedule ({candidate.scheduledInterviews.length})
            </TabsTrigger>
            <TabsTrigger value="resume" className="text-[12px] data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
              Resume
            </TabsTrigger>
          </TabsList>

          {/* Notes Timeline */}
          <TabsContent value="notes" className="p-5 pt-3 space-y-3 mt-0">
            <div className="flex items-center justify-between">
              <p className="text-[12px] font-medium text-foreground">Interview Notes</p>
              <Button size="sm" variant="outline" className="text-[11px] h-6 px-2" onClick={() => setShowAddNote(!showAddNote)}>
                <Plus size={10} /> Add Note
              </Button>
            </div>

            <AnimatePresence>
              {showAddNote && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 p-3 rounded-lg border bg-accent/20"
                >
                  <div className="flex gap-2">
                    <select
                      value={newNoteType}
                      onChange={(e) => setNewNoteType(e.target.value as InterviewNote["type"])}
                      className="h-7 px-2 rounded-md border bg-background text-[11px] text-foreground"
                    >
                      <option value="note">General Note</option>
                      <option value="phone-screen">Phone Screen</option>
                      <option value="technical">Technical</option>
                      <option value="behavioral">Behavioral</option>
                      <option value="culture-fit">Culture Fit</option>
                    </select>
                    <select
                      value={newNoteRating}
                      onChange={(e) => setNewNoteRating(Number(e.target.value))}
                      className="h-7 px-2 rounded-md border bg-background text-[11px] text-foreground"
                    >
                      <option value={0}>No rating</option>
                      <option value={1}>★ 1</option>
                      <option value={2}>★ 2</option>
                      <option value={3}>★ 3</option>
                      <option value={4}>★ 4</option>
                      <option value={5}>★ 5</option>
                    </select>
                  </div>
                  <Textarea
                    placeholder="Write your interview note..."
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                    className="text-[12px] min-h-[60px] resize-none"
                  />
                  <div className="flex gap-2 justify-end">
                    <Button size="sm" variant="ghost" className="text-[11px] h-6" onClick={() => setShowAddNote(false)}>Cancel</Button>
                    <Button size="sm" className="text-[11px] h-6" onClick={handleAddNote}>Save Note</Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Timeline */}
            <div className="relative">
              {sortedNotes.length > 0 && (
                <div className="absolute left-[15px] top-2 bottom-2 w-px bg-border" />
              )}
              <div className="space-y-3">
                {sortedNotes.map((note) => {
                  const config = noteTypeConfig[note.type];
                  const NoteIcon = config.icon;
                  return (
                    <motion.div
                      key={note.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="relative flex gap-3"
                    >
                      <div className={`w-[30px] h-[30px] rounded-full border-2 border-background bg-accent flex items-center justify-center shrink-0 z-10 ${config.color}`}>
                        <NoteIcon size={12} />
                      </div>
                      <div className="flex-1 p-2.5 rounded-lg border bg-card">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-medium text-foreground">{note.author}</span>
                            <span className={`text-[9px] font-bold uppercase tracking-wider px-1 py-0.5 rounded ${config.color} bg-accent`}>
                              {config.label}
                            </span>
                          </div>
                          <span className="text-[10px] text-muted-foreground tabular-nums">{note.date}</span>
                        </div>
                        <p className="text-[12px] text-muted-foreground leading-relaxed">{note.content}</p>
                        {note.rating && (
                          <div className="mt-1.5">
                            <RatingStars rating={note.rating} />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
                {sortedNotes.length === 0 && (
                  <p className="text-[12px] text-muted-foreground text-center py-6">No interview notes yet.</p>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Schedule */}
          <TabsContent value="schedule" className="p-5 pt-3 space-y-3 mt-0">
            <div className="flex items-center justify-between">
              <p className="text-[12px] font-medium text-foreground">Scheduled Interviews</p>
              <Button size="sm" variant="outline" className="text-[11px] h-6 px-2" onClick={() => setShowAddInterview(!showAddInterview)}>
                <Plus size={10} /> Schedule
              </Button>
            </div>

            <AnimatePresence>
              {showAddInterview && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 p-3 rounded-lg border bg-accent/20"
                >
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-[11px]">Date</Label>
                      <Input type="date" value={newInterviewDate} onChange={(e) => setNewInterviewDate(e.target.value)} className="h-7 text-[11px]" />
                    </div>
                    <div>
                      <Label className="text-[11px]">Time</Label>
                      <Input type="time" value={newInterviewTime} onChange={(e) => setNewInterviewTime(e.target.value)} className="h-7 text-[11px]" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-[11px]">Type</Label>
                      <select
                        value={newInterviewType}
                        onChange={(e) => setNewInterviewType(e.target.value as ScheduledInterview["type"])}
                        className="w-full h-7 px-2 rounded-md border bg-background text-[11px] text-foreground"
                      >
                        <option value="phone-screen">Phone Screen</option>
                        <option value="technical">Technical</option>
                        <option value="behavioral">Behavioral</option>
                        <option value="culture-fit">Culture Fit</option>
                        <option value="panel">Panel</option>
                      </select>
                    </div>
                    <div>
                      <Label className="text-[11px]">Location</Label>
                      <Input placeholder="Zoom, On-site..." value={newInterviewLocation} onChange={(e) => setNewInterviewLocation(e.target.value)} className="h-7 text-[11px]" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-[11px]">Interviewers (comma-separated)</Label>
                    <Input placeholder="Sarah Chen, James Wilson" value={newInterviewers} onChange={(e) => setNewInterviewers(e.target.value)} className="h-7 text-[11px]" />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button size="sm" variant="ghost" className="text-[11px] h-6" onClick={() => setShowAddInterview(false)}>Cancel</Button>
                    <Button size="sm" className="text-[11px] h-6" onClick={handleAddInterview}>Schedule</Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              {candidate.scheduledInterviews.map((interview) => (
                <div key={interview.id} className="p-3 rounded-lg border bg-card">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      {interviewStatusIcon[interview.status]}
                      <span className="text-[12px] font-medium text-foreground capitalize">{interview.type.replace("-", " ")}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground capitalize">{interview.status}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 text-[11px] text-muted-foreground">
                    <div className="flex items-center gap-1"><Calendar size={10} /> {interview.date} at {interview.time}</div>
                    <div className="flex items-center gap-1"><MapPin size={10} /> {interview.location}</div>
                    <div className="flex items-center gap-1 col-span-2"><Users size={10} /> {interview.interviewers.join(", ")}</div>
                  </div>
                </div>
              ))}
              {candidate.scheduledInterviews.length === 0 && (
                <p className="text-[12px] text-muted-foreground text-center py-6">No interviews scheduled.</p>
              )}
            </div>
          </TabsContent>

          {/* Resume */}
          <TabsContent value="resume" className="p-5 pt-3 space-y-3 mt-0">
            <p className="text-[12px] font-medium text-foreground">Resume / CV</p>
            {candidate.resumeFileName ? (
              <div className="p-4 rounded-lg border bg-card flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText size={18} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-foreground truncate">{candidate.resumeFileName}</p>
                  <p className="text-[11px] text-muted-foreground">Uploaded document</p>
                </div>
                <Button size="sm" variant="outline" className="text-[11px] h-7" onClick={handleResumeUpload}>
                  Replace
                </Button>
              </div>
            ) : (
              <button
                onClick={handleResumeUpload}
                className="w-full p-6 rounded-lg border-2 border-dashed border-border hover:border-primary/40 transition-colors flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <Upload size={20} />
                <span className="text-[12px] font-medium">Upload Resume</span>
                <span className="text-[10px]">PDF, DOC, or DOCX</span>
              </button>
            )}

            <Separator />

            <div>
              <p className="text-[12px] font-medium text-foreground mb-2">General Notes</p>
              <p className="text-[12px] text-muted-foreground leading-relaxed">{candidate.notes}</p>
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}