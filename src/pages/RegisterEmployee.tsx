import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, UserCheck, Briefcase, Building2, DollarSign, Calendar } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { departmentStats } from "@/data/mockData";

interface EmployeeForm {
  // Personal
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  // Employment
  employeeId: string;
  jobTitle: string;
  department: string;
  employmentType: string;
  startDate: string;
  manager: string;
  salary: string;
  // Emergency
  emergencyName: string;
  emergencyPhone: string;
  emergencyRelation: string;
  notes: string;
}

const INITIAL: EmployeeForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  address: "",
  employeeId: "",
  jobTitle: "",
  department: "",
  employmentType: "",
  startDate: "",
  manager: "",
  salary: "",
  emergencyName: "",
  emergencyPhone: "",
  emergencyRelation: "",
  notes: "",
};

function SectionHeading({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) {
  return (
    <div className="flex items-center gap-3 pb-1">
      <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

export default function RegisterEmployee() {
  const navigate = useNavigate();
  const [form, setForm] = useState<EmployeeForm>(INITIAL);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof EmployeeForm, string>>>({});

  const set = (field: keyof EmployeeForm) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = (): boolean => {
    const errs: typeof errors = {};
    if (!form.firstName.trim()) errs.firstName = "Required";
    if (!form.lastName.trim()) errs.lastName = "Required";
    if (!form.email.trim()) errs.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Invalid email";
    if (!form.jobTitle.trim()) errs.jobTitle = "Required";
    if (!form.department) errs.department = "Required";
    if (!form.employmentType) errs.employmentType = "Required";
    if (!form.startDate) errs.startDate = "Required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));

    toast.success("Employee registered successfully", {
      description: `${form.firstName} ${form.lastName} has been added as ${form.jobTitle}.`,
    });
    setForm(INITIAL);
    setErrors({});
    setIsSubmitting(false);
  };

  const Field = ({
    label,
    field,
    type = "text",
    placeholder,
    required,
    half,
  }: {
    label: string;
    field: keyof EmployeeForm;
    type?: string;
    placeholder?: string;
    required?: boolean;
    half?: boolean;
  }) => (
    <div className={`space-y-1.5 ${half ? "" : "col-span-2"}`}>
      <label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </label>
      <Input
        type={type}
        value={form[field]}
        onChange={set(field)}
        placeholder={placeholder}
        className="h-11"
      />
      {errors[field] && <p className="text-xs text-destructive">{errors[field]}</p>}
    </div>
  );

  return (
    <AppLayout title="Register Employee" subtitle="Add a new employee to the organization">
      <div className="max-w-3xl mx-auto space-y-6">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="text-muted-foreground">
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Back
        </Button>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <Card className="sphere-card">
            <CardHeader className="pb-3">
              <SectionHeading icon={UserCheck} title="Personal Information" description="Employee's basic personal details" />
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Field label="First name" field="firstName" placeholder="Jane" required half />
              <Field label="Last name" field="lastName" placeholder="Doe" required half />
              <Field label="Email address" field="email" type="email" placeholder="jane.doe@company.com" required />
              <Field label="Phone number" field="phone" type="tel" placeholder="+1 (555) 000-0000" half />
              <Field label="Date of birth" field="dateOfBirth" type="date" half />
              <div className="col-span-2 space-y-1.5">
                <label className="text-sm font-medium text-foreground">Address</label>
                <Textarea
                  value={form.address}
                  onChange={set("address")}
                  placeholder="Street address, city, state, zip"
                  className="resize-none"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Employment Details */}
          <Card className="sphere-card">
            <CardHeader className="pb-3">
              <SectionHeading icon={Briefcase} title="Employment Details" description="Position, department, and compensation" />
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Field label="Employee ID" field="employeeId" placeholder="EMP-013" half />
              <Field label="Job title" field="jobTitle" placeholder="Software Engineer" required half />

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  Department<span className="text-destructive ml-0.5">*</span>
                </label>
                <Select
                  value={form.department}
                  onValueChange={(v) => setForm((f) => ({ ...f, department: v }))}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select department…" />
                  </SelectTrigger>
                  <SelectContent>
                    {departmentStats.map((d) => (
                      <SelectItem key={d.name} value={d.name}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.department && <p className="text-xs text-destructive">{errors.department}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  Employment type<span className="text-destructive ml-0.5">*</span>
                </label>
                <Select
                  value={form.employmentType}
                  onValueChange={(v) => setForm((f) => ({ ...f, employmentType: v }))}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select type…" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="intern">Intern</SelectItem>
                  </SelectContent>
                </Select>
                {errors.employmentType && <p className="text-xs text-destructive">{errors.employmentType}</p>}
              </div>

              <Field label="Start date" field="startDate" type="date" required half />
              <Field label="Reporting manager" field="manager" placeholder="Lisa Park" half />

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  <span className="flex items-center gap-1.5">
                    <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                    Annual salary
                  </span>
                </label>
                <Input
                  type="number"
                  value={form.salary}
                  onChange={set("salary")}
                  placeholder="95000"
                  className="h-11"
                  min={0}
                />
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card className="sphere-card">
            <CardHeader className="pb-3">
              <SectionHeading icon={Calendar} title="Emergency Contact" description="Contact person in case of emergencies" />
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Field label="Contact name" field="emergencyName" placeholder="John Doe" half />
              <Field label="Phone number" field="emergencyPhone" type="tel" placeholder="+1 (555) 000-0000" half />
              <Field label="Relationship" field="emergencyRelation" placeholder="Spouse" half />
            </CardContent>
          </Card>

          {/* Notes */}
          <Card className="sphere-card">
            <CardHeader className="pb-3">
              <SectionHeading icon={Building2} title="Additional Notes" description="Any other relevant information" />
            </CardHeader>
            <CardContent>
              <Textarea
                value={form.notes}
                onChange={set("notes")}
                placeholder="Add any additional notes about this employee…"
                className="resize-none"
                rows={3}
              />
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-3 pb-8">
            <Button type="button" variant="outline" onClick={() => setForm(INITIAL)}>
              Reset
            </Button>
            <Button type="submit" disabled={isSubmitting} className="min-w-[160px]">
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Registering…
                </span>
              ) : (
                <>
                  <UserCheck className="mr-1.5 h-4 w-4" />
                  Register Employee
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
