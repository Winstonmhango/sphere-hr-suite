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
import { Building2, MapPin, Thermometer, Shield, AlertCircle } from "lucide-react";

const warehouseSchema = z.object({
  name: z.string().min(2, "Warehouse name must be at least 2 characters"),
  code: z.string().min(2, "Warehouse code must be at least 2 characters"),
  location: z.string().min(5, "Location must be at least 5 characters"),
  capacity: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0, {
    message: "Capacity must be a valid positive number",
  }),
  temperature: z.string().optional(),
  securityLevel: z.enum(["low", "medium", "high"]),
  manager: z.string().min(2, "Manager name is required"),
  contact: z.string().optional(),
  operatingHours: z.string().optional(),
  notes: z.string().optional(),
});

type WarehouseFormData = z.infer<typeof warehouseSchema>;

interface AddWarehouseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: WarehouseFormData) => void;
  isLoading?: boolean;
}

const securityLevels = [
  { value: "low", label: "Low", description: "Basic security measures" },
  { value: "medium", label: "Medium", description: "Enhanced security protocols" },
  { value: "high", label: "High", description: "Maximum security with surveillance" },
];

const temperatureRanges = [
  "Ambient (15-25°C)",
  "Cold (2-8°C)",
  "Frozen (-18°C or below)",
  "Climate Controlled (18-22°C)",
  "Refrigerated (0-4°C)",
];

export function AddWarehouseModal({ open, onOpenChange, onSubmit, isLoading }: AddWarehouseModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<WarehouseFormData>({
    resolver: zodResolver(warehouseSchema),
    defaultValues: {
      name: "",
      code: "",
      location: "",
      capacity: "",
      temperature: "",
      securityLevel: "medium",
      manager: "",
      contact: "",
      operatingHours: "08:00 - 18:00",
      notes: "",
    },
  });

  const handleFormSubmit = (data: WarehouseFormData) => {
    onSubmit(data);
    reset();
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  const watchedSecurityLevel = watch("securityLevel");

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            <DialogTitle>Add New Warehouse</DialogTitle>
          </div>
          <DialogDescription>
            Add a new warehouse or storage facility to your inventory system
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Warehouse Name *</Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="e.g., Main Distribution Center"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="code">Warehouse Code *</Label>
                <Input
                  id="code"
                  {...register("code")}
                  placeholder="e.g., WH-001"
                  className={errors.code ? "border-red-500" : ""}
                />
                {errors.code && (
                  <p className="text-xs text-red-500 mt-1">{errors.code.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="location">Location *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="location"
                    {...register("location")}
                    placeholder="123 Industrial Ave, City, State 12345"
                    className={`pl-10 ${errors.location ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.location && (
                  <p className="text-xs text-red-500 mt-1">{errors.location.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="capacity">Storage Capacity *</Label>
                <Input
                  id="capacity"
                  type="number"
                  {...register("capacity")}
                  placeholder="e.g., 10000"
                  className={errors.capacity ? "border-red-500" : ""}
                />
                {errors.capacity && (
                  <p className="text-xs text-red-500 mt-1">{errors.capacity.message}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1">Maximum number of items the warehouse can hold</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="manager">Manager Name *</Label>
                <Input
                  id="manager"
                  {...register("manager")}
                  placeholder="e.g., John Smith"
                  className={errors.manager ? "border-red-500" : ""}
                />
                {errors.manager && (
                  <p className="text-xs text-red-500 mt-1">{errors.manager.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="contact">Contact Information</Label>
                <Input
                  id="contact"
                  {...register("contact")}
                  placeholder="Phone number or email"
                />
              </div>

              <div>
                <Label htmlFor="operatingHours">Operating Hours</Label>
                <Input
                  id="operatingHours"
                  {...register("operatingHours")}
                  placeholder="e.g., 08:00 - 18:00"
                />
              </div>

              <div>
                <Label htmlFor="temperature">Temperature Range</Label>
                <Select onValueChange={(value) => setValue("temperature", value)}>
                  <SelectTrigger>
                    <div className="flex items-center gap-2">
                      <Thermometer className="w-4 h-4 text-muted-foreground" />
                      <SelectValue placeholder="Select temperature range" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {temperatureRanges.map((range) => (
                      <SelectItem key={range} value={range}>
                        {range}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Security Level */}
          <div>
            <Label>Security Level *</Label>
            <div className="grid grid-cols-3 gap-3 mt-2">
              {securityLevels.map((level) => (
                <div
                  key={level.value}
                  className={`relative cursor-pointer rounded-lg border-2 p-3 transition-colors ${
                    watchedSecurityLevel === level.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => setValue("securityLevel", level.value as any)}
                >
                  <div className="flex items-center gap-2">
                    <Shield className={`w-4 h-4 ${
                      level.value === "high" ? "text-red-500" :
                      level.value === "medium" ? "text-amber-500" :
                      "text-green-500"
                    }`} />
                    <span className="font-medium">{level.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{level.description}</p>
                  {watchedSecurityLevel === level.value && (
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              {...register("notes")}
              placeholder="Any additional information about the warehouse..."
              rows={3}
            />
          </div>

          {/* Security Warning */}
          {watchedSecurityLevel === "high" && (
            <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded">
              <Shield className="w-4 h-4 text-blue-600" />
              <div className="text-xs text-blue-700">
                <p className="font-medium">High Security Level</p>
                <p>This warehouse will require enhanced security measures including surveillance systems, access control, and regular security audits.</p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding Warehouse..." : "Add Warehouse"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
