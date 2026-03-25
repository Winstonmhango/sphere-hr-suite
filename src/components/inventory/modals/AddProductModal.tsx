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
import { Badge } from "@/components/ui/badge";
import { X, Package, AlertCircle } from "lucide-react";

const productSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  sku: z.string().min(3, "SKU must be at least 3 characters"),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional(),
  unitPrice: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: "Unit price must be a valid positive number",
  }),
  currentStock: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) >= 0, {
    message: "Current stock must be a valid non-negative number",
  }),
  minStock: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) >= 0, {
    message: "Min stock must be a valid non-negative number",
  }),
  maxStock: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0, {
    message: "Max stock must be a valid positive number",
  }),
  reorderPoint: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) >= 0, {
    message: "Reorder point must be a valid non-negative number",
  }),
  location: z.string().min(1, "Location is required"),
  supplier: z.string().optional(),
  barcode: z.string().optional(),
  notes: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface AddProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ProductFormData) => void;
  isLoading?: boolean;
}

const categories = [
  "Electronics",
  "Furniture",
  "Office Supplies",
  "Equipment",
  "Raw Materials",
  "Consumables",
  "Tools",
  "Safety Equipment",
];

const locations = [
  "Warehouse A - Zone 1",
  "Warehouse A - Zone 2",
  "Warehouse A - Zone 3",
  "Warehouse B - Zone 1",
  "Warehouse B - Zone 2",
  "Warehouse B - Zone 3",
  "Main Office",
  "Storage Room",
];

export function AddProductModal({ open, onOpenChange, onSubmit, isLoading }: AddProductModalProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      sku: "",
      category: "",
      description: "",
      unitPrice: "",
      currentStock: "0",
      minStock: "0",
      maxStock: "100",
      reorderPoint: "0",
      location: "",
      supplier: "",
      barcode: "",
      notes: "",
    },
  });

  const watchedValues = watch();

  const handleFormSubmit = (data: ProductFormData) => {
    onSubmit(data);
    reset();
    setSelectedTags([]);
  };

  const handleClose = () => {
    reset();
    setSelectedTags([]);
    onOpenChange(false);
  };

  const validateStockLevels = () => {
    const current = parseInt(watchedValues.currentStock) || 0;
    const min = parseInt(watchedValues.minStock) || 0;
    const max = parseInt(watchedValues.maxStock) || 0;
    const reorder = parseInt(watchedValues.reorderPoint) || 0;

    if (min >= max) {
      return "Minimum stock must be less than maximum stock";
    }
    if (reorder < min) {
      return "Reorder point should be greater than or equal to minimum stock";
    }
    if (current > max) {
      return "Current stock cannot exceed maximum stock";
    }
    return null;
  };

  const stockValidationError = validateStockLevels();

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            <DialogTitle>Add New Product</DialogTitle>
          </div>
          <DialogDescription>
            Add a new product to your inventory management system
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="Enter product name"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="sku">SKU *</Label>
                <Input
                  id="sku"
                  {...register("sku")}
                  placeholder="Enter SKU"
                  className={errors.sku ? "border-red-500" : ""}
                />
                {errors.sku && (
                  <p className="text-xs text-red-500 mt-1">{errors.sku.message}</p>
                )}
              </div>

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

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="Enter product description"
                  rows={3}
                />
              </div>
            </div>

            {/* Stock Information */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="unitPrice">Unit Price ($) *</Label>
                <Input
                  id="unitPrice"
                  type="number"
                  step="0.01"
                  {...register("unitPrice")}
                  placeholder="0.00"
                  className={errors.unitPrice ? "border-red-500" : ""}
                />
                {errors.unitPrice && (
                  <p className="text-xs text-red-500 mt-1">{errors.unitPrice.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="currentStock">Current Stock *</Label>
                  <Input
                    id="currentStock"
                    type="number"
                    {...register("currentStock")}
                    placeholder="0"
                    className={errors.currentStock ? "border-red-500" : ""}
                  />
                  {errors.currentStock && (
                    <p className="text-xs text-red-500 mt-1">{errors.currentStock.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="minStock">Min Stock *</Label>
                  <Input
                    id="minStock"
                    type="number"
                    {...register("minStock")}
                    placeholder="0"
                    className={errors.minStock ? "border-red-500" : ""}
                  />
                  {errors.minStock && (
                    <p className="text-xs text-red-500 mt-1">{errors.minStock.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="maxStock">Max Stock *</Label>
                  <Input
                    id="maxStock"
                    type="number"
                    {...register("maxStock")}
                    placeholder="100"
                    className={errors.maxStock ? "border-red-500" : ""}
                  />
                  {errors.maxStock && (
                    <p className="text-xs text-red-500 mt-1">{errors.maxStock.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="reorderPoint">Reorder Point</Label>
                  <Input
                    id="reorderPoint"
                    type="number"
                    {...register("reorderPoint")}
                    placeholder="0"
                    className={errors.reorderPoint ? "border-red-500" : ""}
                  />
                  {errors.reorderPoint && (
                    <p className="text-xs text-red-500 mt-1">{errors.reorderPoint.message}</p>
                  )}
                </div>
              </div>

              {stockValidationError && (
                <div className="flex items-center gap-2 p-2 bg-amber-50 border border-amber-200 rounded">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <p className="text-xs text-amber-700">{stockValidationError}</p>
                </div>
              )}
            </div>
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location">Location *</Label>
              <Select onValueChange={(value) => setValue("location", value)}>
                <SelectTrigger className={errors.location ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.location && (
                <p className="text-xs text-red-500 mt-1">{errors.location.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="supplier">Supplier</Label>
              <Input
                id="supplier"
                {...register("supplier")}
                placeholder="Enter supplier name"
              />
            </div>

            <div>
              <Label htmlFor="barcode">Barcode</Label>
              <Input
                id="barcode"
                {...register("barcode")}
                placeholder="Enter barcode"
              />
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                {...register("notes")}
                placeholder="Additional notes"
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !!stockValidationError}>
              {isLoading ? "Adding Product..." : "Add Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
