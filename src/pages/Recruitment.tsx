import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Search, Briefcase, Users, UserCheck, Star, MapPin, ArrowRight,
} from "lucide-react";
import {
  candidates as initialCandidates, jobPostings,
  type Candidate, type PipelineStage, type InterviewNote, type ScheduledInterview,
} from "@/data/mockData";
import { CandidateCard } from "@/components/recruitment/CandidateCard";
import { CandidateSlideOver } from "@/components/recruitment/CandidateSlideOver";

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

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={12} className={i < rating ? "fill-amber-400 text-amber-400" : "text-border"} />
      ))}
    </div>
  );
}

export default function Recruitment() {
  const [candidateList, setCandidateList] = useState<Candidate[]>(initialCandidates);
  const [search, setSearch] = useState("");
  const [selectedJob, setSelectedJob] = useState<string>("all");
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [slideOverOpen, setSlideOverOpen] = useState(false);

  const openCandidate = (candidate: Candidate) => {
    // Get latest version from state
    const latest = candidateList.find(c => c.id === candidate.id) || candidate;
    setSelectedCandidate(latest);
    setSlideOverOpen(true);
  };

  const moveCandidate = (id: string, newStage: PipelineStage) => {
    setCandidateList(prev => {
      const updated = prev.map(c => (c.id === id ? { ...c, stage: newStage } : c));
      const moved = updated.find(c => c.id === id);
      if (moved && selectedCandidate?.id === id) setSelectedCandidate(moved);
      return updated;
    });
  };

  const addNote = (id: string, note: InterviewNote) => {
    setCandidateList(prev => {
      const updated = prev.map(c => c.id === id ? { ...c, interviewNotes: [...c.interviewNotes, note] } : c);
      const target = updated.find(c => c.id === id);
      if (target && selectedCandidate?.id === id) setSelectedCandidate(target);
      return updated;
    });
  };

  const addInterview = (id: string, interview: ScheduledInterview) => {
    setCandidateList(prev => {
      const updated = prev.map(c => c.id === id ? { ...c, scheduledInterviews: [...c.scheduledInterviews, interview] } : c);
      const target = updated.find(c => c.id === id);
      if (target && selectedCandidate?.id === id) setSelectedCandidate(target);
      return updated;
    });
  };

  const uploadResume = (id: string, fileName: string) => {
    setCandidateList(prev => {
      const updated = prev.map(c => c.id === id ? { ...c, resumeFileName: fileName } : c);
      const target = updated.find(c => c.id === id);
      if (target && selectedCandidate?.id === id) setSelectedCandidate(target);
      return updated;
    });
  };

  const filtered = candidateList.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.role.toLowerCase().includes(search.toLowerCase());
    const matchesJob = selectedJob === "all" || c.jobId === selectedJob;
    return matchesSearch && matchesJob;
  });

  const openJobs = jobPostings.filter(j => j.status === "open");
  const totalApplicants = jobPostings.reduce((s, j) => s + j.applicants, 0);
  const inPipeline = candidateList.filter(c => !["hired", "rejected"].includes(c.stage)).length;
  const hiredCount = candidateList.filter(c => c.stage === "hired").length;

  return (
    <AppLayout title="Recruitment" subtitle="Track candidates through hiring pipeline">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Open Positions", value: openJobs.length, icon: Briefcase },
            { label: "Total Applicants", value: totalApplicants, icon: Users },
            { label: "In Pipeline", value: inPipeline, icon: ArrowRight },
            { label: "Hired This Month", value: hiredCount, icon: UserCheck },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                    <p className="text-2xl font-semibold text-foreground mt-1 tabular-nums">{stat.value}</p>
                  </div>
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <stat.icon size={18} className="text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="pipeline" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="pipeline" className="text-[13px]">Pipeline</TabsTrigger>
              <TabsTrigger value="jobs" className="text-[13px]">Job Postings</TabsTrigger>
              <TabsTrigger value="all" className="text-[13px]">All Candidates</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search candidates..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 h-8 w-56 text-[13px]" />
              </div>
              <select value={selectedJob} onChange={(e) => setSelectedJob(e.target.value)} className="h-8 px-2 rounded-md border bg-background text-[13px] text-foreground">
                <option value="all">All Positions</option>
                {jobPostings.map(j => (<option key={j.id} value={j.id}>{j.title}</option>))}
              </select>
            </div>
          </div>

          {/* Pipeline View */}
          <TabsContent value="pipeline">
            <div className="grid grid-cols-5 gap-3">
              {pipelineStages.map((stage) => {
                const stageCandidates = filtered.filter(c => c.stage === stage);
                const config = stageConfig[stage];
                return (
                  <div key={stage} className="space-y-2">
                    <div className="flex items-center justify-between px-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[11px] font-bold uppercase tracking-wider ${config.color}`}>{config.label}</span>
                        <span className="text-[11px] text-muted-foreground tabular-nums">{stageCandidates.length}</span>
                      </div>
                    </div>
                    <div className={`rounded-lg p-2 min-h-[200px] space-y-2 ${config.bgColor} border border-transparent`}>
                      <AnimatePresence>
                        {stageCandidates.map(candidate => (
                          <CandidateCard key={candidate.id} candidate={candidate} onClick={openCandidate} />
                        ))}
                      </AnimatePresence>
                      {stageCandidates.length === 0 && (
                        <p className="text-[11px] text-muted-foreground text-center pt-8">No candidates</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          {/* Job Postings */}
          <TabsContent value="jobs">
            <Card>
              <CardHeader className="py-4 px-5">
                <CardTitle className="text-sm font-semibold">Open Positions</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[11px]">Position</TableHead>
                      <TableHead className="text-[11px]">Department</TableHead>
                      <TableHead className="text-[11px]">Location</TableHead>
                      <TableHead className="text-[11px]">Type</TableHead>
                      <TableHead className="text-[11px]">Posted</TableHead>
                      <TableHead className="text-[11px] text-right">Applicants</TableHead>
                      <TableHead className="text-[11px]">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {jobPostings.map((job) => (
                      <TableRow key={job.id}>
                        <TableCell className="text-[13px] font-medium">{job.title}</TableCell>
                        <TableCell className="text-[13px] text-muted-foreground">{job.department}</TableCell>
                        <TableCell className="text-[13px] text-muted-foreground">
                          <span className="flex items-center gap-1"><MapPin size={12} />{job.location}</span>
                        </TableCell>
                        <TableCell className="text-[13px] text-muted-foreground capitalize">{job.type}</TableCell>
                        <TableCell className="text-[13px] text-muted-foreground tabular-nums">{job.postedDate}</TableCell>
                        <TableCell className="text-[13px] text-right tabular-nums font-medium">{job.applicants}</TableCell>
                        <TableCell>
                          <StatusBadge status={job.status === "open" ? "active" : job.status === "closed" ? "inactive" : "pending"} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* All Candidates */}
          <TabsContent value="all">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[11px]">Candidate</TableHead>
                      <TableHead className="text-[11px]">Role</TableHead>
                      <TableHead className="text-[11px]">Stage</TableHead>
                      <TableHead className="text-[11px]">Rating</TableHead>
                      <TableHead className="text-[11px]">Source</TableHead>
                      <TableHead className="text-[11px]">Applied</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((c) => (
                      <TableRow key={c.id} className="cursor-pointer" onClick={() => openCandidate(c)}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-[10px] font-semibold text-primary">{c.name.split(" ").map(n => n[0]).join("")}</span>
                            </div>
                            <div>
                              <p className="text-[13px] font-medium">{c.name}</p>
                              <p className="text-[11px] text-muted-foreground">{c.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-[13px] text-muted-foreground">{c.role}</TableCell>
                        <TableCell>
                          <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${stageConfig[c.stage].bgColor} ${stageConfig[c.stage].color}`}>
                            {stageConfig[c.stage].label}
                          </span>
                        </TableCell>
                        <TableCell><RatingStars rating={c.rating} /></TableCell>
                        <TableCell className="text-[13px] text-muted-foreground">{sourceLabels[c.source]}</TableCell>
                        <TableCell className="text-[13px] text-muted-foreground tabular-nums">{c.appliedDate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <CandidateSlideOver
        candidate={selectedCandidate}
        open={slideOverOpen}
        onOpenChange={setSlideOverOpen}
        onMove={moveCandidate}
        onAddNote={addNote}
        onAddInterview={addInterview}
        onUploadResume={uploadResume}
      />
    </AppLayout>
  );
}