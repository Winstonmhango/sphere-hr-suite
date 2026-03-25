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
import { Building2, Mail, Phone, MapPin, Package, Clock, AlertCircle } from "lucide-react";

const supplierSchema = z.object({
  name: z.string().min(2, "Supplier name must be at least 2 characters"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  category: z.string().min(1, "Category is required"),
  status: z.enum(["active", "inactive", "pending"]),
  leadTime: z.string().min(1, "Lead time is required"),
  paymentTerms: z.string().min(1, "Payment terms are required"),
  taxId: z.string().optional(),
  website: z.string().url("Valid URL is required").optional().or(z.literal("")),
  notes: z.string().optional(),
  contactPerson: z.string().optional(),
  contactTitle: z.string().optional(),
  products: z.string().optional(),
});

type SupplierFormData = z.infer<typeof supplierSchema>;

interface AddSupplierModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: SupplierFormData) => void;
  isLoading?: boolean;
}

const categories = [
  "Electronics",
  "Furniture",
  "Office Supplies",
  "Raw Materials",
  "Equipment",
  "Software",
  "Services",
  "Other",
];

const paymentTerms = [
  "Net 15",
  "Net 30",
  "Net 60",
  "Net 90",
  "Immediate",
  "2/10 Net 30",
  "Other",
];

const leadTimes = [
  "1-3 days",
  "3-7 days",
  "1-2 weeks",
  "2-4 weeks",
  "1-2 months",
  "2+ months",
];

export function AddSupplierModal({ open, onOpenChange, onSubmit, isLoading }: AddSupplierModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<SupplierFormData>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      category: "",
      status: "pending",
      leadTime: "",
      paymentTerms: "",
      taxId: "",
      website: "",
      notes: "",
      contactPerson: "",
      contactTitle: "",
      products: "",
    },
  });

  const handleFormSubmit = (data: SupplierFormData) => {
    onSubmit(data);
    reset();
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            <DialogTitle>Add New Supplier</DialogTitle>
          </div>
          <DialogDescription>
            Add a new supplier to your procurement system
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Supplier Name *</Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="Enter supplier name"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="supplier@example.com"
                    className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="phone">Phone *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    {...register("phone")}
                    placeholder="+1 (555) 123-4567"
                    className={`pl-10 ${errors.phone ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="address">Address *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="address"
                    {...register("address")}
                    placeholder="123 Supplier Ave, City, State 12345"
                    className={`pl-10 ${errors.address ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.address && (
                  <p className="text-xs text-red-500 mt-1">{errors.address.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select onValueChange={(value) => setValue("category", value)}>
                  <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-xs text-red-500 mt-1">{errors.category.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="status">Status *</Label>
                  <Select onValueChange={(value) => setValue("status", value as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="leadTime">Lead Time *</Label>
                  <Select onValueChange={(value) => setValue("leadTime", value)}>
                    <SelectTrigger className={errors.leadTime ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select lead time" />
                    </SelectTrigger>
                    <SelectContent>
                      {leadTimes.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.leadTime && (
                    <p className="text-xs text-red-500 mt-1">{errors.leadTime.message}</p>
                  )}
                </div>
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

              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  {...register("website")}
                  placeholder="https://www.example.com"
                />
                {errors.website && (
                  <p className="text-xs text-red-500 mt-1">{errors.website.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Person */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Contact Person</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contactPerson">Name</Label>
                <Input
                  id="contactPerson"
                  {...register("contactPerson")}
                  placeholder="Contact person name"
                />
              </div>
              <div>
                <Label htmlFor="contactTitle">Title</Label>
                <Input
                  id="contactTitle"
                  {...register("contactTitle")}
                  placeholder="Job title"
                />
              </div>
            </div>
          </div>

          {/* Products */}
          <div>
            <Label htmlFor="products">Products/Services (Optional)</Label>
            <Textarea
              id="products"
              {...register("products")}
              placeholder="List of products or services provided by this supplier..."
              rows={3}
            />
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="taxId">Tax ID (Optional)</Label>
              <Input
                id="taxId"
                {...register("taxId")}
                placeholder="Enter tax ID"
              />
            </div>
            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                {...register("notes")}
                placeholder="Additional notes about the supplier..."
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding Supplier..." : "Add Supplier"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
