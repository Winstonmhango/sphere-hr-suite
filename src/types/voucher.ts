export interface Voucher {
  id: string;
  code: string;
  title: string;
  description: string;
  type: "discount" | "benefit" | "allowance" | "reimbursement";
  value: number;
  valueType: "percentage" | "fixed";
  department?: string;
  employeeId?: string;
  status: "active" | "inactive" | "expired" | "used";
  issueDate: string;
  expiryDate?: string;
  usageLimit?: number;
  usageCount: number;
  conditions?: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface VoucherUsage {
  id: string;
  voucherId: string;
  employeeId: string;
  employeeName: string;
  usageDate: string;
  amountUsed: number;
  transactionId?: string;
  notes?: string;
}

export interface VoucherFormData {
  code: string;
  title: string;
  description: string;
  type: "discount" | "benefit" | "allowance" | "reimbursement";
  value: number;
  valueType: "percentage" | "fixed";
  department?: string;
  employeeId?: string;
  expiryDate?: string;
  usageLimit?: number;
  conditions?: string[];
}
