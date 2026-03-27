import { X, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Voucher, VoucherFormData } from "@/types/voucher";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface VoucherFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: VoucherFormData) => void;
  voucher?: Voucher | null;
  isLoading?: boolean;
}

export function VoucherFormModal({ isOpen, onClose, onSubmit, voucher, isLoading }: VoucherFormModalProps) {
  const [formData, setFormData] = useState<VoucherFormData>({
    code: voucher?.code || "",
    title: voucher?.title || "",
    description: voucher?.description || "",
    type: voucher?.type || "discount",
    value: voucher?.value || 0,
    valueType: voucher?.valueType || "fixed",
    department: voucher?.department || "",
    employeeId: voucher?.employeeId || "",
    expiryDate: voucher?.expiryDate || "",
    usageLimit: voucher?.usageLimit || undefined,
    conditions: voucher?.conditions || []
  });

  const [newCondition, setNewCondition] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field: keyof VoucherFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addCondition = () => {
    if (newCondition.trim()) {
      setFormData(prev => ({
        ...prev,
        conditions: [...(prev.conditions || []), newCondition.trim()]
      }));
      setNewCondition("");
    }
  };

  const removeCondition = (index: number) => {
    setFormData(prev => ({
      ...prev,
      conditions: prev.conditions?.filter((_, i) => i !== index) || []
    }));
  };

  const generateCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setFormData(prev => ({ ...prev, code }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {voucher ? "Edit Voucher" : "Create New Voucher"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="p-4">
            <h3 className="text-sm font-semibold text-foreground mb-4">Basic Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Voucher Code</Label>
                <div className="flex gap-2">
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => handleInputChange("code", e.target.value)}
                    placeholder="e.g., WELCOME2024"
                    required
                  />
                  <Button type="button" variant="outline" size="sm" onClick={generateCode}>
                    Generate
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="e.g., Welcome Discount"
                  required
                />
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Describe the voucher and its purpose..."
                rows={3}
                required
              />
            </div>
          </Card>

          {/* Voucher Type and Value */}
          <Card className="p-4">
            <h3 className="text-sm font-semibold text-foreground mb-4">Voucher Type & Value</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Voucher Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: VoucherFormData["type"]) => handleInputChange("type", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="discount">Discount</SelectItem>
                    <SelectItem value="benefit">Benefit</SelectItem>
                    <SelectItem value="allowance">Allowance</SelectItem>
                    <SelectItem value="reimbursement">Reimbursement</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="valueType">Value Type</Label>
                <Select
                  value={formData.valueType}
                  onValueChange={(value: VoucherFormData["valueType"]) => handleInputChange("valueType", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                    <SelectItem value="percentage">Percentage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <Label htmlFor="value">
                Value ({formData.valueType === "percentage" ? "%" : "USD"})
              </Label>
              <Input
                id="value"
                type="number"
                min="0"
                max={formData.valueType === "percentage" ? 100 : undefined}
                step={formData.valueType === "percentage" ? 1 : 0.01}
                value={formData.value}
                onChange={(e) => handleInputChange("value", parseFloat(e.target.value) || 0)}
                placeholder={formData.valueType === "percentage" ? "e.g., 15" : "e.g., 50.00"}
                required
              />
            </div>
          </Card>

          {/* Assignment */}
          <Card className="p-4">
            <h3 className="text-sm font-semibold text-foreground mb-4">Assignment</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department (Optional)</Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) => handleInputChange("department", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Departments</SelectItem>
                    <SelectItem value="HR">Human Resources</SelectItem>
                    <SelectItem value="IT">Information Technology</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Operations">Operations</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="employeeId">Employee ID (Optional)</Label>
                <Input
                  id="employeeId"
                  value={formData.employeeId}
                  onChange={(e) => handleInputChange("employeeId", e.target.value)}
                  placeholder="e.g., EMP-001"
                />
              </div>
            </div>
          </Card>

          {/* Usage Limits */}
          <Card className="p-4">
            <h3 className="text-sm font-semibold text-foreground mb-4">Usage Limits</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="usageLimit">Usage Limit (Optional)</Label>
                <Input
                  id="usageLimit"
                  type="number"
                  min="1"
                  value={formData.usageLimit || ""}
                  onChange={(e) => handleInputChange("usageLimit", e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="e.g., 100"
                />
                <p className="text-xs text-muted-foreground">
                  Leave empty for unlimited usage
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Leave empty for no expiry
                </p>
              </div>
            </div>
          </Card>

          {/* Conditions */}
          <Card className="p-4">
            <h3 className="text-sm font-semibold text-foreground mb-4">Conditions & Restrictions</h3>
            
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value)}
                  placeholder="Add a condition or restriction..."
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCondition())}
                />
                <Button type="button" variant="outline" size="sm" onClick={addCondition}>
                  <Plus size={14} />
                </Button>
              </div>

              {formData.conditions && formData.conditions.length > 0 && (
                <div className="space-y-2">
                  {formData.conditions.map((condition, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                      <span className="text-sm flex-1">{condition}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCondition(index)}
                      >
                        <Trash2 size={14} className="text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : voucher ? "Update Voucher" : "Create Voucher"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
