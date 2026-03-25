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
import { User, Mail, Phone, MapPin, Building2, AlertCircle } from "lucide-react";

const customerSchema = z.object({
  name: z.string().min(2, "Customer name must be at least 2 characters"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  company: z.string().min(2, "Company name is required"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  status: z.enum(["active", "inactive", "prospect"]),
  category: z.string().min(1, "Category is required"),
  taxId: z.string().optional(),
  website: z.string().url("Valid URL is required").optional().or(z.literal("")),
  notes: z.string().optional(),
  contactPerson: z.string().optional(),
  contactTitle: z.string().optional(),
});

type CustomerFormData = z.infer<typeof customerSchema>;

interface AddCustomerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CustomerFormData) => void;
  isLoading?: boolean;
}

const categories = [
  "Retail",
  "Wholesale",
  "Corporate",
  "Government",
  "Education",
  "Healthcare",
  "Non-profit",
  "Other",
];

export function AddCustomerModal({ open, onOpenChange, onSubmit, isLoading }: AddCustomerModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      address: "",
      status: "prospect",
      category: "",
      taxId: "",
      website: "",
      notes: "",
      contactPerson: "",
      contactTitle: "",
    },
  });

  const handleFormSubmit = (data: CustomerFormData) => {
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
            <User className="w-5 h-5 text-primary" />
            <DialogTitle>Add New Customer</DialogTitle>
          </div>
          <DialogDescription>
            Add a new customer to your CRM system
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Customer Name *</Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="Enter customer name"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="company">Company *</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="company"
                    {...register("company")}
                    placeholder="Enter company name"
                    className={`pl-10 ${errors.company ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.company && (
                  <p className="text-xs text-red-500 mt-1">{errors.company.message}</p>
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
                    placeholder="customer@example.com"
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
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="address">Address *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="address"
                    {...register("address")}
                    placeholder="123 Business St, City, State 12345"
                    className={`pl-10 ${errors.address ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.address && (
                  <p className="text-xs text-red-500 mt-1">{errors.address.message}</p>
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
                      <SelectItem value="prospect">Prospect</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select onValueChange={(value) => setValue("category", value)}>
                    <SelectTrigger>
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
                </div>
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

              <div>
                <Label htmlFor="taxId">Tax ID</Label>
                <Input
                  id="taxId"
                  {...register("taxId")}
                  placeholder="Enter tax ID"
                />
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

          {/* Additional Information */}
          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              {...register("notes")}
              placeholder="Additional notes about the customer..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding Customer..." : "Add Customer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
