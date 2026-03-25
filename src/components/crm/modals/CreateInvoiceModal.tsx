import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Plus, Trash2, Calendar, DollarSign, AlertCircle } from "lucide-react";

const invoiceItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  quantity: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0, {
    message: "Quantity must be a valid positive number",
  }),
  unitPrice: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: "Unit price must be a valid positive number",
  }),
});

const invoiceSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  issueDate: z.string().min(1, "Issue date is required"),
  dueDate: z.string().min(1, "Due date is required"),
  paymentTerms: z.string().min(1, "Payment terms are required"),
  notes: z.string().optional(),
  items: z.array(invoiceItemSchema).min(1, "At least one item is required"),
});

type InvoiceFormData = z.infer<typeof invoiceSchema>;

interface CreateInvoiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: InvoiceFormData) => void;
  isLoading?: boolean;
}

// Mock data
const customers = [
  { id: "1", name: "Acme Corporation", email: "billing@acme.com" },
  { id: "2", name: "Global Industries", email: "accounts@global.com" },
  { id: "3", name: "Tech Solutions Ltd", email: "finance@techsolutions.com" },
];

const paymentTerms = [
  "Net 15",
  "Net 30",
  "Net 60",
  "Due on Receipt",
  "2/10 Net 30",
];

export function CreateInvoiceModal({ open, onOpenChange, onSubmit, isLoading }: CreateInvoiceModalProps) {
  const [items, setItems] = useState([
    { description: "", quantity: "", unitPrice: "" }
  ]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      customerId: "",
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: "",
      paymentTerms: "Net 30",
      notes: "",
      items: items,
    },
  });

  const watchedItems = watch("items");

  const addItem = () => {
    const newItems = [...items, { description: "", quantity: "", unitPrice: "" }];
    setItems(newItems);
    setValue("items", newItems);
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    setValue("items", newItems);
  };

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
    setValue("items", newItems);
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const quantity = parseInt(item.quantity) || 0;
      const unitPrice = parseFloat(item.unitPrice) || 0;
      return total + (quantity * unitPrice);
    }, 0);
  };

  const calculateSubtotal = (index: number) => {
    const item = items[index];
    const quantity = parseInt(item.quantity) || 0;
    const unitPrice = parseFloat(item.unitPrice) || 0;
    return quantity * unitPrice;
  };

  const handleFormSubmit = (data: InvoiceFormData) => {
    const submissionData = {
      ...data,
      items: items.filter(item => item.description && item.quantity && item.unitPrice),
    };
    onSubmit(submissionData);
    reset();
    setItems([{ description: "", quantity: "", unitPrice: "" }]);
  };

  const handleClose = () => {
    reset();
    setItems([{ description: "", quantity: "", unitPrice: "" }]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <DialogTitle>Create New Invoice</DialogTitle>
          </div>
          <DialogDescription>
            Create a new invoice for your customer
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Customer Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customerId">Customer *</Label>
              <Select onValueChange={(value) => setValue("customerId", value)}>
                <SelectTrigger className={errors.customerId ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      <div className="flex flex-col">
                        <span>{customer.name}</span>
                        <span className="text-xs text-muted-foreground">{customer.email}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.customerId && (
                <p className="text-xs text-red-500 mt-1">{errors.customerId.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="paymentTerms">Payment Terms *</Label>
              <Select onValueChange={(value) => setValue("paymentTerms", value)}>
                <SelectTrigger className={errors.paymentTerms ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select payment terms" />
                </SelectTrigger>
                <SelectContent>
                  {paymentTerms.map((terms) => (
                    <SelectItem key={terms} value={terms}>
                      {terms}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.paymentTerms && (
                <p className="text-xs text-red-500 mt-1">{errors.paymentTerms.message}</p>
              )}
            </div>
          </div>

          {/* Invoice Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="issueDate">Issue Date *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                <Input
                  id="issueDate"
                  type="date"
                  {...register("issueDate")}
                  className={`pl-10 ${errors.issueDate ? "border-red-500" : ""}`}
                />
              </div>
              {errors.issueDate && (
                <p className="text-xs text-red-500 mt-1">{errors.issueDate.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="dueDate">Due Date *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                <Input
                  id="dueDate"
                  type="date"
                  {...register("dueDate")}
                  className={`pl-10 ${errors.dueDate ? "border-red-500" : ""}`}
                />
              </div>
              {errors.dueDate && (
                <p className="text-xs text-red-500 mt-1">{errors.dueDate.message}</p>
              )}
            </div>
          </div>

          {/* Invoice Items */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <Label className="text-base font-semibold">Invoice Items *</Label>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus size={14} className="mr-1" />
                Add Item
              </Button>
            </div>

            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="sphere-card p-4">
                  <div className="grid grid-cols-12 gap-3 items-end">
                    <div className="col-span-6">
                      <Label htmlFor={`item-${index}-description`}>Description</Label>
                      <Input
                        id={`item-${index}-description`}
                        value={item.description}
                        onChange={(e) => updateItem(index, "description", e.target.value)}
                        placeholder="Item description"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor={`item-${index}-quantity`}>Quantity</Label>
                      <Input
                        id={`item-${index}-quantity`}
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, "quantity", e.target.value)}
                        placeholder="0"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor={`item-${index}-unitPrice`}>Unit Price</Label>
                      <Input
                        id={`item-${index}-unitPrice`}
                        type="number"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(index, "unitPrice", e.target.value)}
                        placeholder="0.00"
                      />
                    </div>
                    <div className="col-span-2 flex items-center gap-2">
                      <div className="text-right">
                        <p className="text-sm font-medium tabular-nums">
                          ${calculateSubtotal(index).toFixed(2)}
                        </p>
                      </div>
                      {items.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(index)}
                        >
                          <Trash2 size={14} className="text-red-500" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {errors.items && (
              <div className="flex items-center gap-2 p-2 bg-amber-50 border border-amber-200 rounded">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <p className="text-xs text-amber-700">{errors.items.message}</p>
              </div>
            )}
          </div>

          {/* Invoice Summary */}
          <div className="sphere-card p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Subtotal:</span>
              <span className="text-sm tabular-nums">${calculateTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Tax (10%):</span>
              <span className="text-sm tabular-nums">${(calculateTotal() * 0.1).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-base font-semibold">Total:</span>
              <span className="text-base font-bold tabular-nums">
                ${(calculateTotal() * 1.1).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              {...register("notes")}
              placeholder="Additional notes or payment instructions..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating Invoice..." : "Create Invoice"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
