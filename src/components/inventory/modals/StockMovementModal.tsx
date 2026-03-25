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
import { ArrowDownIcon, ArrowUpIcon, ArrowRightIcon, Package, AlertCircle } from "lucide-react";

const stockMovementSchema = z.object({
  type: z.enum(["in", "out", "transfer", "adjustment"]),
  productId: z.string().min(1, "Product is required"),
  quantity: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0, {
    message: "Quantity must be a valid positive number",
  }),
  fromLocation: z.string().optional(),
  toLocation: z.string().min(1, "Destination location is required"),
  reason: z.string().min(1, "Reason is required"),
  reference: z.string().optional(),
  notes: z.string().optional(),
  adjustmentType: z.enum(["increase", "decrease"]).optional(),
});

type StockMovementFormData = z.infer<typeof stockMovementSchema>;

interface StockMovementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: StockMovementFormData) => void;
  isLoading?: boolean;
  defaultType?: "in" | "out" | "transfer" | "adjustment";
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

const movementReasons = {
  in: ["New Stock", "Purchase Order", "Return", "Production", "Other"],
  out: ["Sale", "Office Use", "Damage", "Theft", "Other"],
  transfer: ["Stock Rebalancing", "Location Change", "Request", "Other"],
  adjustment: ["Damage", "Count Correction", "Expiry", "Quality Control", "Other"],
};

export function StockMovementModal({ 
  open, 
  onOpenChange, 
  onSubmit, 
  isLoading,
  defaultType = "in" 
}: StockMovementModalProps) {
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<StockMovementFormData>({
    resolver: zodResolver(stockMovementSchema),
    defaultValues: {
      type: defaultType,
      productId: "",
      quantity: "",
      fromLocation: "",
      toLocation: "",
      reason: "",
      reference: "",
      notes: "",
      adjustmentType: "increase",
    },
  });

  const watchedType = watch("type");
  const watchedProductId = watch("productId");
  const watchedQuantity = watch("quantity");

  const selectedProductData = products.find(p => p.id === watchedProductId);

  const handleFormSubmit = (data: StockMovementFormData) => {
    onSubmit(data);
    reset();
    setSelectedProduct("");
  };

  const handleClose = () => {
    reset();
    setSelectedProduct("");
    onOpenChange(false);
  };

  const getMovementIcon = (type: string) => {
    switch (type) {
      case "in":
        return <ArrowDownIcon className="w-4 h-4 text-emerald-600" />;
      case "out":
        return <ArrowUpIcon className="w-4 h-4 text-red-500" />;
      case "transfer":
        return <ArrowRightIcon className="w-4 h-4 text-blue-600" />;
      case "adjustment":
        return <Package className="w-4 h-4 text-amber-600" />;
      default:
        return null;
    }
  };

  const getMovementTitle = (type: string) => {
    switch (type) {
      case "in":
        return "Stock In";
      case "out":
        return "Stock Out";
      case "transfer":
        return "Stock Transfer";
      case "adjustment":
        return "Stock Adjustment";
      default:
        return "Stock Movement";
    }
  };

  const validateQuantity = () => {
    if (!selectedProductData || !watchedQuantity) return null;
    
    const quantity = parseInt(watchedQuantity);
    const currentStock = selectedProductData.currentStock;

    if (watchedType === "out" && quantity > currentStock) {
      return `Insufficient stock. Available: ${currentStock}`;
    }
    if (watchedType === "transfer" && quantity > currentStock) {
      return `Insufficient stock for transfer. Available: ${currentStock}`;
    }
    return null;
  };

  const quantityError = validateQuantity();

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {getMovementIcon(watchedType)}
            <DialogTitle>{getMovementTitle(watchedType)}</DialogTitle>
          </div>
          <DialogDescription>
            Record a stock {watchedType} transaction
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Movement Type */}
          <div>
            <Label htmlFor="type">Movement Type</Label>
            <Select 
              value={watchedType} 
              onValueChange={(value: any) => setValue("type", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in">
                  <div className="flex items-center gap-2">
                    <ArrowDownIcon className="w-4 h-4 text-emerald-600" />
                    Stock In
                  </div>
                </SelectItem>
                <SelectItem value="out">
                  <div className="flex items-center gap-2">
                    <ArrowUpIcon className="w-4 h-4 text-red-500" />
                    Stock Out
                  </div>
                </SelectItem>
                <SelectItem value="transfer">
                  <div className="flex items-center gap-2">
                    <ArrowRightIcon className="w-4 h-4 text-blue-600" />
                    Stock Transfer
                  </div>
                </SelectItem>
                <SelectItem value="adjustment">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-amber-600" />
                    Stock Adjustment
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

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
                        {product.sku} • Stock: {product.currentStock}
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

          {/* Quantity */}
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
            {selectedProductData && (
              <p className="text-xs text-muted-foreground mt-1">
                Available stock: {selectedProductData.currentStock}
              </p>
            )}
            {quantityError && (
              <div className="flex items-center gap-2 mt-1">
                <AlertCircle className="w-3 h-3 text-amber-600" />
                <p className="text-xs text-amber-600">{quantityError}</p>
              </div>
            )}
          </div>

          {/* Location Fields */}
          {watchedType === "transfer" && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="fromLocation">From Location</Label>
                <Select onValueChange={(value) => setValue("fromLocation", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="toLocation">To Location *</Label>
                <Select onValueChange={(value) => setValue("toLocation", value)}>
                  <SelectTrigger className={errors.toLocation ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select destination" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.toLocation && (
                  <p className="text-xs text-red-500 mt-1">{errors.toLocation.message}</p>
                )}
              </div>
            </div>
          )}

          {watchedType !== "transfer" && (
            <div>
              <Label htmlFor="toLocation">Location *</Label>
              <Select onValueChange={(value) => setValue("toLocation", value)}>
                <SelectTrigger className={errors.toLocation ? "border-red-500" : ""}>
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
              {errors.toLocation && (
                <p className="text-xs text-red-500 mt-1">{errors.toLocation.message}</p>
              )}
            </div>
          )}

          {/* Adjustment Type (only for adjustments) */}
          {watchedType === "adjustment" && (
            <div>
              <Label>Adjustment Type</Label>
              <Select 
                defaultValue="increase"
                onValueChange={(value: any) => setValue("adjustmentType", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="increase">Increase Stock</SelectItem>
                  <SelectItem value="decrease">Decrease Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Reason */}
          <div>
            <Label htmlFor="reason">Reason *</Label>
            <Select onValueChange={(value) => setValue("reason", value)}>
              <SelectTrigger className={errors.reason ? "border-red-500" : ""}>
                <SelectValue placeholder="Select reason" />
              </SelectTrigger>
              <SelectContent>
                {movementReasons[watchedType as keyof typeof movementReasons].map((reason) => (
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
                placeholder="PO-2024-089, REQ-2024-156, etc."
              />
            </div>
            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                {...register("notes")}
                placeholder="Additional notes or comments"
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !!quantityError}>
              {isLoading ? "Processing..." : `Record ${getMovementTitle(watchedType)}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
