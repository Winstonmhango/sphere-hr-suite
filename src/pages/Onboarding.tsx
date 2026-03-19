import { useState } from "react";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import {
  CheckCircle2, Clock, FileText, Monitor, Compass, KeyRound,
  GraduationCap, User, Calendar, ChevronRight, ClipboardList,
  AlertCircle,
} from "lucide-react";
import {
  onboardingChecklists as initialChecklists,
  type OnboardingChecklist, type OnboardingTask, type OnboardingTaskCategory, type OnboardingTaskStatus,
} from "@/data/mockData";

const categoryConfig: Record<OnboardingTaskCategory, { label: string; icon: typeof FileText; color: string; bgColor: string }> = {
  documents: { label: "Documents", icon: FileText, color: "text-blue-700", bgColor: "bg-blue-50" },
  equipment: { label: "Equipment", icon: Monitor, color: "text-amber-700", bgColor: "bg-amber-50" },
  orientation: { label: "Orientation", icon: Compass, color: "text-violet-700", bgColor: "bg-violet-50" },
  access: { label: "Access & Tools", icon: KeyRound, color: "text-emerald-700", bgColor: "bg-emerald-50" },
  training: { label: "Training", icon: GraduationCap, color: "text-rose-700", bgColor: "bg-rose-50" },
};

const statusConfig: Record<OnboardingTaskStatus, { label: string; color: string }> = {
  pending: { label: "Pending", color: "text-muted-foreground" },
  "in-progress": { label: "In Progress", color: "text-amber-600" },
  completed: { label: "Completed", color: "text-emerald-600" },
};

function getProgress(tasks: OnboardingTask[]) {
  if (tasks.length === 0) return 0;
  return Math.round((tasks.filter(t => t.status === "completed").length / tasks.length) * 100);
}

export default function Onboarding() {
  const [checklists, setChecklists] = useState<OnboardingChecklist[]>(initialChecklists);
  const [selectedChecklist, setSelectedChecklist] = useState<OnboardingChecklist | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const openChecklist = (cl: OnboardingChecklist) => {
    setSelectedChecklist(cl);
    setDetailOpen(true);
  };

  const toggleTask = (checklistId: string, taskId: string) => {
    setChecklists(prev => {
      const updated = prev.map(cl => {
        if (cl.id !== checklistId) return cl;
        const updatedTasks = cl.tasks.map(t => {
          if (t.id !== taskId) return t;
          const newStatus: OnboardingTaskStatus = t.status === "completed" ? "pending" : "completed";
          return {
            ...t,
            status: newStatus,
            completedDate: newStatus === "completed" ? new Date().toISOString().split("T")[0] : undefined,
          };
        });
        const allDone = updatedTasks.every(t => t.status === "completed");
        return { ...cl, tasks: updatedTasks, status: allDone ? "completed" as const : "active" as const };
      });
      const target = updated.find(cl => cl.id === checklistId);
      if (target && selectedChecklist?.id === checklistId) setSelectedChecklist(target);
      return updated;
    });
  };

  const markInProgress = (checklistId: string, taskId: string) => {
    setChecklists(prev => {
      const updated = prev.map(cl => {
        if (cl.id !== checklistId) return cl;
        return {
          ...cl,
          tasks: cl.tasks.map(t => t.id === taskId ? { ...t, status: "in-progress" as OnboardingTaskStatus } : t),
        };
      });
      const target = updated.find(cl => cl.id === checklistId);
      if (target && selectedChecklist?.id === checklistId) setSelectedChecklist(target);
      return updated;
    });
  };

  const activeCount = checklists.filter(cl => cl.status === "active").length;
  const completedCount = checklists.filter(cl => cl.status === "completed").length;
  const totalTasks = checklists.reduce((s, cl) => s + cl.tasks.length, 0);
  const completedTasks = checklists.reduce((s, cl) => s + cl.tasks.filter(t => t.status === "completed").length, 0);

  return (
    <AppLayout title="Onboarding" subtitle="Track new hire onboarding progress">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Active Onboardings", value: activeCount, icon: ClipboardList },
            { label: "Completed", value: completedCount, icon: CheckCircle2 },
            { label: "Total Tasks", value: totalTasks, icon: AlertCircle },
            { label: "Tasks Done", value: completedTasks, icon: CheckCircle2 },
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

        {/* Checklist Cards */}
        {checklists.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <ClipboardList size={32} className="mx-auto text-muted-foreground mb-3" />
              <p className="text-[13px] text-muted-foreground">No onboarding checklists yet.</p>
              <p className="text-[11px] text-muted-foreground mt-1">When a candidate is moved to "Hired", an onboarding checklist will be created automatically.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {checklists.map((cl) => {
              const progress = getProgress(cl.tasks);
              const pendingCount = cl.tasks.filter(t => t.status === "pending").length;
              const inProgressCount = cl.tasks.filter(t => t.status === "in-progress").length;
              return (
                <motion.div key={cl.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                  <Card
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => openChecklist(cl)}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-semibold text-primary">
                              {cl.candidateName.split(" ").map(n => n[0]).join("")}
                            </span>
                          </div>
                          <div>
                            <p className="text-[14px] font-medium text-foreground">{cl.candidateName}</p>
                            <p className="text-[12px] text-muted-foreground">{cl.role}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                            cl.status === "completed" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                          }`}>
                            {cl.status === "completed" ? "Complete" : "Active"}
                          </span>
                          <ChevronRight size={14} className="text-muted-foreground" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium text-foreground tabular-nums">{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-1.5" />
                      </div>

                      <div className="flex items-center gap-4 mt-3 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1"><Calendar size={10} /> Start: {cl.startDate}</span>
                        <span className="flex items-center gap-1"><Clock size={10} /> {pendingCount} pending</span>
                        {inProgressCount > 0 && (
                          <span className="flex items-center gap-1 text-amber-600"><AlertCircle size={10} /> {inProgressCount} in progress</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail Slide-Over */}
      <Sheet open={detailOpen} onOpenChange={setDetailOpen}>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto p-0">
          {selectedChecklist && (
            <>
              <div className="p-5 pb-4 border-b bg-accent/30">
                <SheetHeader className="mb-3">
                  <SheetTitle className="text-base sr-only">Onboarding Details</SheetTitle>
                </SheetHeader>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">
                      {selectedChecklist.candidateName.split(" ").map(n => n[0]).join("")}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-[15px] font-semibold text-foreground">{selectedChecklist.candidateName}</h2>
                    <p className="text-[12px] text-muted-foreground">{selectedChecklist.role} · Start: {selectedChecklist.startDate}</p>
                  </div>
                </div>
                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">Overall Progress</span>
                    <span className="font-medium text-foreground tabular-nums">{getProgress(selectedChecklist.tasks)}%</span>
                  </div>
                  <Progress value={getProgress(selectedChecklist.tasks)} className="h-2" />
                </div>
              </div>

              <Tabs defaultValue="all" className="flex-1">
                <TabsList className="w-full justify-start rounded-none border-b bg-transparent px-5 h-9 overflow-x-auto">
                  <TabsTrigger value="all" className="text-[11px] data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                    All ({selectedChecklist.tasks.length})
                  </TabsTrigger>
                  {(Object.keys(categoryConfig) as OnboardingTaskCategory[]).map(cat => {
                    const count = selectedChecklist.tasks.filter(t => t.category === cat).length;
                    if (count === 0) return null;
                    const cfg = categoryConfig[cat];
                    return (
                      <TabsTrigger key={cat} value={cat} className="text-[11px] data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                        {cfg.label} ({count})
                      </TabsTrigger>
                    );
                  })}
                </TabsList>

                {["all", ...Object.keys(categoryConfig)].map(tabValue => (
                  <TabsContent key={tabValue} value={tabValue} className="p-5 pt-3 space-y-2 mt-0">
                    {selectedChecklist.tasks
                      .filter(t => tabValue === "all" || t.category === tabValue)
                      .map((task) => {
                        const catCfg = categoryConfig[task.category];
                        const CatIcon = catCfg.icon;
                        return (
                          <motion.div
                            key={task.id}
                            initial={{ opacity: 0, x: -4 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`p-3 rounded-lg border bg-card ${task.status === "completed" ? "opacity-60" : ""}`}
                          >
                            <div className="flex items-start gap-3">
                              <Checkbox
                                checked={task.status === "completed"}
                                onCheckedChange={() => toggleTask(selectedChecklist.id, task.id)}
                                className="mt-0.5"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <span className={`text-[13px] font-medium ${task.status === "completed" ? "line-through text-muted-foreground" : "text-foreground"}`}>
                                    {task.title}
                                  </span>
                                </div>
                                <p className="text-[11px] text-muted-foreground leading-relaxed">{task.description}</p>
                                <div className="flex items-center gap-3 mt-1.5 text-[10px]">
                                  <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded ${catCfg.bgColor} ${catCfg.color}`}>
                                    <CatIcon size={9} /> {catCfg.label}
                                  </span>
                                  <span className="flex items-center gap-1 text-muted-foreground">
                                    <User size={9} /> {task.assignee}
                                  </span>
                                  <span className={`font-medium ${statusConfig[task.status].color}`}>
                                    {statusConfig[task.status].label}
                                  </span>
                                  {task.completedDate && (
                                    <span className="text-muted-foreground">Done {task.completedDate}</span>
                                  )}
                                </div>
                              </div>
                              {task.status === "pending" && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-[10px] h-6 px-2 text-muted-foreground hover:text-foreground"
                                  onClick={(e) => { e.stopPropagation(); markInProgress(selectedChecklist.id, task.id); }}
                                >
                                  Start
                                </Button>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                  </TabsContent>
                ))}
              </Tabs>
            </>
          )}
        </SheetContent>
      </Sheet>
    </AppLayout>
  );
}