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
import { ArrowRightIcon, Package, AlertCircle, Search } from "lucide-react";

const stockTransferSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  quantity: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0, {
    message: "Quantity must be a valid positive number",
  }),
  fromLocation: z.string().min(1, "Source location is required"),
  toLocation: z.string().min(1, "Destination location is required"),
  reason: z.string().min(1, "Reason is required"),
  priority: z.enum(["low", "medium", "high"]),
  reference: z.string().optional(),
  notes: z.string().optional(),
  requestedBy: z.string().min(1, "Requested by is required"),
  approvedBy: z.string().optional(),
});

type StockTransferFormData = z.infer<typeof stockTransferSchema>;

interface StockTransferModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: StockTransferFormData) => void;
  isLoading?: boolean;
}

// Mock product data with location-specific stock
const products = [
  { 
    id: "1", 
    name: "Wireless Mouse Model X", 
    sku: "WMX-001", 
    stock: {
      "Warehouse A - Zone 1": 45,
      "Warehouse A - Zone 2": 23,
      "Warehouse B - Zone 1": 67,
      "Warehouse B - Zone 2": 12,
    }
  },
  { 
    id: "2", 
    name: "Office Chair Deluxe", 
    sku: "OCD-002", 
    stock: {
      "Warehouse A - Zone 1": 8,
      "Warehouse A - Zone 2": 15,
      "Warehouse B - Zone 1": 3,
      "Warehouse B - Zone 2": 22,
    }
  },
  { 
    id: "3", 
    name: "USB-C Cable 2m", 
    sku: "UCC-003", 
    stock: {
      "Warehouse A - Zone 1": 156,
      "Warehouse A - Zone 2": 89,
      "Warehouse B - Zone 1": 234,
      "Warehouse B - Zone 2": 67,
    }
  },
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

const transferReasons = [
  "Stock Rebalancing",
  "Location Change Request",
  "Emergency Transfer",
  "Seasonal Demand",
  "New Location Setup",
  "Consolidation",
  "Other",
];

const priorities = [
  { value: "low", label: "Low", color: "text-green-600" },
  { value: "medium", label: "Medium", color: "text-amber-600" },
  { value: "high", label: "High", color: "text-red-600" },
];

export function StockTransferModal({ open, onOpenChange, onSubmit, isLoading }: StockTransferModalProps) {
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<StockTransferFormData>({
    resolver: zodResolver(stockTransferSchema),
    defaultValues: {
      productId: "",
      quantity: "",
      fromLocation: "",
      toLocation: "",
      reason: "",
      priority: "medium",
      reference: "",
      notes: "",
      requestedBy: "",
      approvedBy: "",
    },
  });

  const watchedProductId = watch("productId");
  const watchedFromLocation = watch("fromLocation");
  const watchedToLocation = watch("toLocation");
  const watchedQuantity = watch("quantity");

  const selectedProductData = products.find(p => p.id === watchedProductId);
  const availableStock = selectedProductData?.stock[watchedFromLocation as keyof typeof selectedProductData.stock] || 0;

  const handleFormSubmit = (data: StockTransferFormData) => {
    onSubmit(data);
    reset();
    setSelectedProduct("");
  };

  const handleClose = () => {
    reset();
    setSelectedProduct("");
    onOpenChange(false);
  };

  const validateTransfer = () => {
    if (!selectedProductData || !watchedFromLocation || !watchedQuantity) return null;
    
    const quantity = parseInt(watchedQuantity);
    const stock = availableStock;

    if (quantity > stock) {
      return `Insufficient stock. Available: ${stock} in ${watchedFromLocation}`;
    }
    if (watchedFromLocation === watchedToLocation) {
      return "Source and destination locations cannot be the same";
    }
    return null;
  };

  const transferError = validateTransfer();

  const getPriorityBadge = (priority: string) => {
    const priorityData = priorities.find(p => p.value === priority);
    return priorityData ? (
      <Badge variant="outline" className={priorityData.color}>
        {priorityData.label}
      </Badge>
    ) : null;
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <ArrowRightIcon className="w-5 h-5 text-primary" />
            <DialogTitle>Stock Transfer</DialogTitle>
          </div>
          <DialogDescription>
            Transfer stock between locations
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Product Selection */}
          <div className="space-y-4">
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
                  <SelectValue placeholder="Select product to transfer" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      <div className="flex flex-col">
                        <span>{product.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {product.sku}
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

            {/* Stock Overview */}
            {selectedProductData && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Available Stock</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(selectedProductData.stock).map(([location, stock]) => (
                    <div key={location} className="flex justify-between">
                      <span className="text-muted-foreground">{location}:</span>
                      <span className="font-medium tabular-nums">{stock}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Transfer Details */}
          <div className="grid grid-cols-2 gap-4">
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
              {selectedProductData && watchedFromLocation && (
                <p className="text-xs text-muted-foreground mt-1">
                  Available in {watchedFromLocation}: {availableStock}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select 
                defaultValue="medium"
                onValueChange={(value: any) => setValue("priority", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value}>
                      <div className="flex items-center gap-2">
                        <span>{priority.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Locations */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fromLocation">From Location *</Label>
              <Select 
                value={watchedFromLocation}
                onValueChange={(value) => setValue("fromLocation", value)}
              >
                <SelectTrigger className={errors.fromLocation ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select source location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.fromLocation && (
                <p className="text-xs text-red-500 mt-1">{errors.fromLocation.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="toLocation">To Location *</Label>
              <Select 
                value={watchedToLocation}
                onValueChange={(value) => setValue("toLocation", value)}
              >
                <SelectTrigger className={errors.toLocation ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select destination location" />
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

          {/* Transfer Validation */}
          {transferError && (
            <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <p className="text-xs text-amber-700">{transferError}</p>
            </div>
          )}

          {/* Reason and Request Details */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="reason">Reason *</Label>
              <Select onValueChange={(value) => setValue("reason", value)}>
                <SelectTrigger className={errors.reason ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select transfer reason" />
                </SelectTrigger>
                <SelectContent>
                  {transferReasons.map((reason) => (
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="requestedBy">Requested By *</Label>
                <Input
                  id="requestedBy"
                  {...register("requestedBy")}
                  placeholder="Enter name"
                  className={errors.requestedBy ? "border-red-500" : ""}
                />
                {errors.requestedBy && (
                  <p className="text-xs text-red-500 mt-1">{errors.requestedBy.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="reference">Reference (Optional)</Label>
                <Input
                  id="reference"
                  {...register("reference")}
                  placeholder="e.g., TRANSFER-2024-001"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                {...register("notes")}
                placeholder="Any additional information about the transfer..."
                rows={3}
              />
            </div>
          </div>

          {/* Transfer Summary */}
          {selectedProductData && watchedFromLocation && watchedToLocation && watchedQuantity && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded">
              <div className="flex items-center gap-2 mb-2">
                <Search className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Transfer Summary</span>
              </div>
              <div className="text-xs text-blue-800 space-y-1">
                <p><strong>Product:</strong> {selectedProductData.name} ({selectedProductData.sku})</p>
                <p><strong>Quantity:</strong> {watchedQuantity} units</p>
                <p><strong>From:</strong> {watchedFromLocation}</p>
                <p><strong>To:</strong> {watchedToLocation}</p>
                <p><strong>Priority:</strong> {watch("priority")}</p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !!transferError}>
              {isLoading ? "Processing Transfer..." : "Complete Transfer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
