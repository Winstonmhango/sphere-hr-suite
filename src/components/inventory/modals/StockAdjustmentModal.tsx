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
import { Package, AlertCircle, TrendingUp, TrendingDown, RefreshCw } from "lucide-react";

const stockAdjustmentSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  adjustmentType: z.enum(["increase", "decrease"]),
  quantity: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0, {
    message: "Quantity must be a valid positive number",
  }),
  location: z.string().min(1, "Location is required"),
  reason: z.string().min(1, "Reason is required"),
  reference: z.string().optional(),
  notes: z.string().optional(),
  adjustedBy: z.string().min(1, "Adjusted by is required"),
  approvedBy: z.string().optional(),
  currentStock: z.string().optional(),
  newStock: z.string().optional(),
});

type StockAdjustmentFormData = z.infer<typeof stockAdjustmentSchema>;

interface StockAdjustmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: StockAdjustmentFormData) => void;
  isLoading?: boolean;
}

// Mock product data
const products = [
  { id: "1", name: "Wireless Mouse Model X", sku: "WMX-001", currentStock: 45 },
  { id: "2", name: "Office Chair Deluxe", sku: "OCD-002", currentStock: 8 },
  { id: "3", name: "USB-C Cable 2m", sku: "UCC-003", currentStock: 156 },
  { id: "4", name: "Laptop Stand Pro", sku: "LSP-004", currentStock: 23 },
  { id: "5", name: "Desk Lamp LED", sku: "DLL-005", currentStock: 89 },
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

const adjustmentReasons = [
  "Damage",
  "Count Correction",
  "Expiry",
  "Quality Control",
  "Theft/Loss",
  "Found Items",
  "System Error",
  "Return to Supplier",
  "Other",
];

export function StockAdjustmentModal({ open, onOpenChange, onSubmit, isLoading }: StockAdjustmentModalProps) {
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<StockAdjustmentFormData>({
    resolver: zodResolver(stockAdjustmentSchema),
    defaultValues: {
      productId: "",
      adjustmentType: "increase",
      quantity: "",
      location: "",
      reason: "",
      reference: "",
      notes: "",
      adjustedBy: "",
      approvedBy: "",
      currentStock: "",
      newStock: "",
    },
  });

  const watchedProductId = watch("productId");
  const watchedAdjustmentType = watch("adjustmentType");
  const watchedQuantity = watch("quantity");

  const selectedProductData = products.find(p => p.id === watchedProductId);

  // Calculate new stock
  const currentStock = selectedProductData?.currentStock || 0;
  const adjustmentQuantity = parseInt(watchedQuantity) || 0;
  const newStock = watchedAdjustmentType === "increase" 
    ? currentStock + adjustmentQuantity 
    : currentStock - adjustmentQuantity;

  // Update form values when selections change
  useState(() => {
    if (selectedProductData) {
      setValue("currentStock", currentStock.toString());
      setValue("newStock", newStock.toString());
    }
  });

  const handleFormSubmit = (data: StockAdjustmentFormData) => {
    const submissionData = {
      ...data,
      currentStock: currentStock.toString(),
      newStock: newStock.toString(),
    };
    onSubmit(submissionData);
    reset();
    setSelectedProduct("");
  };

  const handleClose = () => {
    reset();
    setSelectedProduct("");
    onOpenChange(false);
  };

  const validateAdjustment = () => {
    if (!selectedProductData || !watchedQuantity) return null;
    
    const quantity = parseInt(watchedQuantity);
    const stock = currentStock;

    if (watchedAdjustmentType === "decrease" && quantity > stock) {
      return `Cannot decrease more than current stock. Available: ${stock}`;
    }
    return null;
  };

  const adjustmentError = validateAdjustment();

  const getAdjustmentIcon = () => {
    switch (watchedAdjustmentType) {
      case "increase":
        return <TrendingUp className="w-4 h-4 text-emerald-600" />;
      case "decrease":
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <RefreshCw className="w-4 h-4 text-amber-600" />;
    }
  };

  const getAdjustmentBadge = () => {
    switch (watchedAdjustmentType) {
      case "increase":
        return <Badge className="bg-emerald-100 text-emerald-800">Increase</Badge>;
      case "decrease":
        return <Badge className="bg-red-100 text-red-800">Decrease</Badge>;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-primary" />
            <DialogTitle>Stock Adjustment</DialogTitle>
          </div>
          <DialogDescription>
            Adjust stock levels for inventory corrections
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Product Selection */}
          <div>
            <Label htmlFor="productId">Product *</Label>
            <Select 
              value={watchedProductId} 
              onValueChange={(value) => {
                setValue("productId", value);
                setSelectedProduct(value);
              }}
            >
              <SelectTrigger className={errors.productId ? "border-red-500" : ""}>
                <SelectValue placeholder="Select product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    <div className="flex flex-col">
                      <span>{product.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {product.sku} • Current Stock: {product.currentStock}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.productId && (
              <p className="text-xs text-red-500 mt-1">{errors.productId.message}</p>
            )}
          </div>

          {/* Adjustment Type and Quantity */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Adjustment Type</Label>
              <Select 
                value={watchedAdjustmentType}
                onValueChange={(value: any) => setValue("adjustmentType", value)}
              >
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    {getAdjustmentIcon()}
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="increase">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                      Increase Stock
                    </div>
                  </SelectItem>
                  <SelectItem value="decrease">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="w-4 h-4 text-red-500" />
                      Decrease Stock
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                {...register("quantity")}
                placeholder="Enter quantity"
                className={errors.quantity ? "border-red-500" : ""}
              />
              {errors.quantity && (
                <p className="text-xs text-red-500 mt-1">{errors.quantity.message}</p>
              )}
            </div>
          </div>

          {/* Location */}
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

          {/* Stock Comparison */}
          {selectedProductData && watchedQuantity && (
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Stock Comparison</span>
                {getAdjustmentBadge()}
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <p className="text-muted-foreground">Current</p>
                  <p className="font-semibold tabular-nums">{currentStock}</p>
                </div>
                <div className="text-center">
                  <p className="text-muted-foreground">Adjustment</p>
                  <p className={`font-semibold tabular-nums ${
                    watchedAdjustmentType === "increase" ? "text-emerald-600" : "text-red-500"
                  }`}>
                    {watchedAdjustmentType === "increase" ? "+" : "-"}{adjustmentQuantity}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-muted-foreground">New</p>
                  <p className="font-semibold tabular-nums">{newStock}</p>
                </div>
              </div>
            </div>
          )}

          {/* Validation Error */}
          {adjustmentError && (
            <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <p className="text-xs text-amber-700">{adjustmentError}</p>
            </div>
          )}

          {/* Reason */}
          <div>
            <Label htmlFor="reason">Reason *</Label>
            <Select onValueChange={(value) => setValue("reason", value)}>
              <SelectTrigger className={errors.reason ? "border-red-500" : ""}>
                <SelectValue placeholder="Select adjustment reason" />
              </SelectTrigger>
              <SelectContent>
                {adjustmentReasons.map((reason) => (
                  <SelectItem key={reason} value={reason}>
                    {reason}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.reason && (
              <p className="text-xs text-red-500 mt-1">{errors.reason.message}</p>
            )}
          </div>

          {/* Reference and Notes */}
          <div className="space-y-3">
            <div>
              <Label htmlFor="reference">Reference (Optional)</Label>
              <Input
                id="reference"
                {...register("reference")}
                placeholder="e.g., ADJ-2024-001"
              />
            </div>
            <div>
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                {...register("notes")}
                placeholder="Detailed explanation of the adjustment..."
                rows={3}
              />
            </div>
          </div>

          {/* Personnel */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="adjustedBy">Adjusted By *</Label>
              <Input
                id="adjustedBy"
                {...register("adjustedBy")}
                placeholder="Enter name"
                className={errors.adjustedBy ? "border-red-500" : ""}
              />
              {errors.adjustedBy && (
                <p className="text-xs text-red-500 mt-1">{errors.adjustedBy.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="approvedBy">Approved By (Optional)</Label>
              <Input
                id="approvedBy"
                {...register("approvedBy")}
                placeholder="Enter name"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !!adjustmentError}>
              {isLoading ? "Processing Adjustment..." : "Complete Adjustment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
