import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { employees, Task, TaskPriority, TaskStatus } from "@/data/mockData";
import { CheckCircle2, Calendar } from "lucide-react";
import { toast } from "sonner";

interface AddTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (task: Omit<Task, "id" | "createdDate" | "completedDate">) => void;
}

const priorities: { value: TaskPriority; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

const statuses: { value: TaskStatus; label: string }[] = [
  { value: "todo", label: "To Do" },
  { value: "in-progress", label: "In Progress" },
  { value: "review", label: "In Review" },
  { value: "done", label: "Done" },
];

const categories = ["HR", "Design", "Engineering", "People Ops", "Marketing", "Analytics", "Finance", "Other"];

export function AddTaskModal({ open, onOpenChange, onSave }: AddTaskModalProps) {
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [dueDate, setDueDate] = useState(tomorrow);
  const [category, setCategory] = useState("HR");

  const reset = () => {
    setTitle(""); setDescription(""); setAssigneeId(""); setPriority("medium");
    setStatus("todo"); setDueDate(tomorrow); setCategory("HR");
  };

  const selectedEmployee = employees.find((e) => e.id === assigneeId);

  const handleSave = () => {
    if (!title.trim()) { toast.error("Task title is required"); return; }
    if (!assigneeId) { toast.error("Please select an assignee"); return; }
    if (!dueDate) { toast.error("Due date is required"); return; }

    onSave({
      title: title.trim(),
      description: description.trim(),
      assigneeId,
      assigneeName: selectedEmployee!.name,
      priority,
      status,
      dueDate,
      category,
    });
    toast.success(`Task "${title.trim()}" created`);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) reset(); onOpenChange(v); }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-[15px] font-semibold flex items-center gap-2">
            <CheckCircle2 size={16} className="text-primary" />
            Create New Task
          </DialogTitle>
          <DialogDescription className="text-[12px]">Add a task and assign it to a team member.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-1.5">
            <Label className="text-[12px] font-medium">Title *</Label>
            <Input placeholder="e.g. Complete Q1 performance reviews" value={title} onChange={(e) => setTitle(e.target.value)} className="text-[13px]" />
          </div>

          <div className="grid gap-1.5">
            <Label className="text-[12px] font-medium">Description</Label>
            <Textarea
              placeholder="Optional details about this task..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="text-[13px] resize-none"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label className="text-[12px] font-medium">Assignee *</Label>
              <Select value={assigneeId} onValueChange={setAssigneeId}>
                <SelectTrigger className="text-[13px]">
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.filter((e) => e.status !== "inactive").map((e) => (
                    <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label className="text-[12px] font-medium">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="text-[13px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="grid gap-1.5">
              <Label className="text-[12px] font-medium">Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as TaskPriority)}>
                <SelectTrigger className="text-[13px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((p) => (
                    <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label className="text-[12px] font-medium">Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as TaskStatus)}>
                <SelectTrigger className="text-[13px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((s) => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label className="text-[12px] font-medium flex items-center gap-1">
                <Calendar size={11} /> Due Date *
              </Label>
              <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="text-[13px]" />
            </div>
          </div>
        </div>

        <DialogFooter className="pt-2">
          <Button variant="outline" onClick={() => { reset(); onOpenChange(false); }} className="text-[13px]">Cancel</Button>
          <Button onClick={handleSave} className="text-[13px]" disabled={!title || !assigneeId || !dueDate}>Create Task</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
