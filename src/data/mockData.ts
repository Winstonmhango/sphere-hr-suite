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
