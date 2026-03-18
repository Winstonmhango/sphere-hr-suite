// Mock data for the HR system
export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: "active" | "on-leave" | "inactive" | "probation";
  salary: number;
  hireDate: string;
  avatar?: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: "annual" | "sick" | "personal" | "maternity";
  startDate: string;
  endDate: string;
  status: "pending" | "approved" | "rejected";
  reason: string;
  days: number;
}

export interface DepartmentStat {
  name: string;
  headcount: number;
  budget: number;
  utilization: number;
}

export const employees: Employee[] = [
  { id: "EMP-001", name: "Sarah Chen", email: "sarah.chen@sphere.io", role: "Engineering Manager", department: "Engineering", status: "active", salary: 145000, hireDate: "2022-03-15" },
  { id: "EMP-002", name: "Marcus Johnson", email: "marcus.j@sphere.io", role: "Senior Designer", department: "Design", status: "active", salary: 120000, hireDate: "2021-08-01" },
  { id: "EMP-003", name: "Priya Sharma", email: "priya.s@sphere.io", role: "Product Manager", department: "Product", status: "on-leave", salary: 135000, hireDate: "2023-01-10" },
  { id: "EMP-004", name: "James Wilson", email: "james.w@sphere.io", role: "DevOps Engineer", department: "Engineering", status: "active", salary: 125000, hireDate: "2022-06-20" },
  { id: "EMP-005", name: "Lisa Park", email: "lisa.p@sphere.io", role: "HR Business Partner", department: "People Ops", status: "active", salary: 110000, hireDate: "2021-11-05" },
  { id: "EMP-006", name: "David Kim", email: "david.k@sphere.io", role: "Frontend Developer", department: "Engineering", status: "probation", salary: 95000, hireDate: "2025-12-01" },
  { id: "EMP-007", name: "Emma Thompson", email: "emma.t@sphere.io", role: "Content Strategist", department: "Marketing", status: "active", salary: 90000, hireDate: "2023-04-18" },
  { id: "EMP-008", name: "Carlos Rivera", email: "carlos.r@sphere.io", role: "Data Analyst", department: "Analytics", status: "active", salary: 105000, hireDate: "2022-09-12" },
  { id: "EMP-009", name: "Aisha Okafor", email: "aisha.o@sphere.io", role: "Recruiter", department: "People Ops", status: "active", salary: 85000, hireDate: "2024-02-28" },
  { id: "EMP-010", name: "Ryan Mitchell", email: "ryan.m@sphere.io", role: "Backend Developer", department: "Engineering", status: "inactive", salary: 115000, hireDate: "2021-05-15" },
  { id: "EMP-011", name: "Mei Lin", email: "mei.l@sphere.io", role: "UX Researcher", department: "Design", status: "active", salary: 100000, hireDate: "2023-07-22" },
  { id: "EMP-012", name: "Thomas Brown", email: "thomas.b@sphere.io", role: "Finance Lead", department: "Finance", status: "active", salary: 140000, hireDate: "2020-11-01" },
];

export const leaveRequests: LeaveRequest[] = [
  { id: "LR-001", employeeId: "EMP-003", employeeName: "Priya Sharma", type: "annual", startDate: "2026-03-20", endDate: "2026-03-27", status: "pending", reason: "Family vacation", days: 5 },
  { id: "LR-002", employeeId: "EMP-001", employeeName: "Sarah Chen", type: "sick", startDate: "2026-03-18", endDate: "2026-03-19", status: "pending", reason: "Medical appointment", days: 2 },
  { id: "LR-003", employeeId: "EMP-007", employeeName: "Emma Thompson", type: "personal", startDate: "2026-03-25", endDate: "2026-03-25", status: "pending", reason: "Moving day", days: 1 },
  { id: "LR-004", employeeId: "EMP-002", employeeName: "Marcus Johnson", type: "annual", startDate: "2026-03-10", endDate: "2026-03-14", status: "approved", reason: "Spring break trip", days: 5 },
  { id: "LR-005", employeeId: "EMP-008", employeeName: "Carlos Rivera", type: "sick", startDate: "2026-03-05", endDate: "2026-03-06", status: "approved", reason: "Flu recovery", days: 2 },
  { id: "LR-006", employeeId: "EMP-009", employeeName: "Aisha Okafor", type: "personal", startDate: "2026-03-15", endDate: "2026-03-15", status: "rejected", reason: "Personal errands", days: 1 },
];

export const departmentStats: DepartmentStat[] = [
  { name: "Engineering", headcount: 42, budget: 5200000, utilization: 94 },
  { name: "Design", headcount: 12, budget: 1440000, utilization: 88 },
  { name: "Product", headcount: 8, budget: 1080000, utilization: 91 },
  { name: "People Ops", headcount: 6, budget: 570000, utilization: 85 },
  { name: "Marketing", headcount: 10, budget: 900000, utilization: 78 },
  { name: "Analytics", headcount: 7, budget: 735000, utilization: 92 },
  { name: "Finance", headcount: 5, budget: 700000, utilization: 87 },
];

// Recruitment types
export type PipelineStage = "applied" | "screening" | "interview" | "offer" | "hired" | "rejected";

export interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  type: "full-time" | "part-time" | "contract";
  status: "open" | "closed" | "draft";
  postedDate: string;
  applicants: number;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  stage: PipelineStage;
  appliedDate: string;
  rating: number; // 1-5
  source: "linkedin" | "referral" | "careers-page" | "indeed" | "other";
  jobId: string;
  notes: string;
  interviewDate?: string;
  avatar?: string;
}

export const jobPostings: JobPosting[] = [
  { id: "JOB-001", title: "Senior Frontend Developer", department: "Engineering", location: "Remote", type: "full-time", status: "open", postedDate: "2026-02-15", applicants: 34 },
  { id: "JOB-002", title: "Product Designer", department: "Design", location: "New York", type: "full-time", status: "open", postedDate: "2026-02-20", applicants: 22 },
  { id: "JOB-003", title: "Data Engineer", department: "Analytics", location: "Remote", type: "full-time", status: "open", postedDate: "2026-03-01", applicants: 18 },
  { id: "JOB-004", title: "Marketing Coordinator", department: "Marketing", location: "San Francisco", type: "full-time", status: "closed", postedDate: "2026-01-10", applicants: 45 },
  { id: "JOB-005", title: "DevOps Contractor", department: "Engineering", location: "Remote", type: "contract", status: "open", postedDate: "2026-03-05", applicants: 12 },
];

export const candidates: Candidate[] = [
  { id: "CAN-001", name: "Alex Rivera", email: "alex.r@email.com", phone: "+1-555-0101", role: "Senior Frontend Developer", stage: "interview", appliedDate: "2026-02-18", rating: 4, source: "linkedin", jobId: "JOB-001", notes: "Strong React/TS portfolio. 6 yrs exp.", interviewDate: "2026-03-20" },
  { id: "CAN-002", name: "Jordan Lee", email: "jordan.l@email.com", phone: "+1-555-0102", role: "Senior Frontend Developer", stage: "screening", appliedDate: "2026-02-22", rating: 3, source: "careers-page", jobId: "JOB-001", notes: "Good fundamentals, needs further screening." },
  { id: "CAN-003", name: "Sam Patel", email: "sam.p@email.com", phone: "+1-555-0103", role: "Senior Frontend Developer", stage: "offer", appliedDate: "2026-02-16", rating: 5, source: "referral", jobId: "JOB-001", notes: "Excellent candidate. Referred by Sarah Chen." },
  { id: "CAN-004", name: "Nina Kowalski", email: "nina.k@email.com", phone: "+1-555-0104", role: "Product Designer", stage: "interview", appliedDate: "2026-02-25", rating: 4, source: "linkedin", jobId: "JOB-002", notes: "Beautiful portfolio, strong Figma skills.", interviewDate: "2026-03-22" },
  { id: "CAN-005", name: "Chris Tanaka", email: "chris.t@email.com", phone: "+1-555-0105", role: "Product Designer", stage: "applied", appliedDate: "2026-03-10", rating: 3, source: "indeed", jobId: "JOB-002", notes: "Junior but shows promise." },
  { id: "CAN-006", name: "Maya Santos", email: "maya.s@email.com", phone: "+1-555-0106", role: "Data Engineer", stage: "screening", appliedDate: "2026-03-05", rating: 4, source: "linkedin", jobId: "JOB-003", notes: "Strong SQL and Python. Spark experience." },
  { id: "CAN-007", name: "Ethan Wright", email: "ethan.w@email.com", phone: "+1-555-0107", role: "Senior Frontend Developer", stage: "rejected", appliedDate: "2026-02-19", rating: 2, source: "indeed", jobId: "JOB-001", notes: "Insufficient experience with TypeScript." },
  { id: "CAN-008", name: "Olivia Chen", email: "olivia.c@email.com", phone: "+1-555-0108", role: "Senior Frontend Developer", stage: "hired", appliedDate: "2026-02-17", rating: 5, source: "referral", jobId: "JOB-001", notes: "Accepted offer. Start date: April 1." },
  { id: "CAN-009", name: "Liam Okafor", email: "liam.o@email.com", phone: "+1-555-0109", role: "Data Engineer", stage: "applied", appliedDate: "2026-03-12", rating: 3, source: "careers-page", jobId: "JOB-003", notes: "Background in data science, pivoting to eng." },
  { id: "CAN-010", name: "Ava Mitchell", email: "ava.m@email.com", phone: "+1-555-0110", role: "DevOps Contractor", stage: "interview", appliedDate: "2026-03-08", rating: 4, source: "linkedin", jobId: "JOB-005", notes: "AWS certified. 4 yrs DevOps.", interviewDate: "2026-03-19" },
];
