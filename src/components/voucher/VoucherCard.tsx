import { Ticket, Calendar, Users, DollarSign, TrendingUp, Clock, CheckCircle, XCircle, AlertCircle, MoreVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Voucher } from "@/types/voucher";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface VoucherCardProps {
  voucher: Voucher;
  onEdit?: (voucher: Voucher) => void;
  onDelete?: (voucher: Voucher) => void;
  onViewUsage?: (voucher: Voucher) => void;
  onToggleStatus?: (voucher: Voucher) => void;
}

export function VoucherCard({ voucher, onEdit, onDelete, onViewUsage, onToggleStatus }: VoucherCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status: Voucher["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700 border-green-200";
      case "inactive":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "expired":
        return "bg-red-100 text-red-700 border-red-200";
      case "used":
        return "bg-amber-100 text-amber-700 border-amber-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getTypeColor = (type: Voucher["type"]) => {
    switch (type) {
      case "discount":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "benefit":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "allowance":
        return "bg-green-100 text-green-700 border-green-200";
      case "reimbursement":
        return "bg-orange-100 text-orange-700 border-orange-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const formatValue = () => {
    if (voucher.valueType === "percentage") {
      return `${voucher.value}%`;
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(voucher.value);
  };

  const getStatusIcon = (status: Voucher["status"]) => {
    switch (status) {
      case "active":
        return <CheckCircle size={16} className="text-green-500" />;
      case "inactive":
        return <XCircle size={16} className="text-gray-500" />;
      case "expired":
        return <AlertCircle size={16} className="text-red-500" />;
      case "used":
        return <Clock size={16} className="text-amber-500" />;
      default:
        return null;
    }
  };

  const isExpired = voucher.expiryDate && new Date(voucher.expiryDate) < new Date();
  const usagePercentage = voucher.usageLimit ? (voucher.usageCount / voucher.usageLimit) * 100 : 0;

  return (
    <Card className="overflow-hidden">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Ticket size={20} className="text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-foreground truncate">{voucher.title}</h3>
                <Badge className={cn("text-xs", getStatusColor(voucher.status))}>
                  {voucher.status}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-mono bg-muted px-2 py-0.5 rounded">{voucher.code}</span>
                <Badge className={cn("text-xs", getTypeColor(voucher.type))}>
                  {voucher.type}
                </Badge>
              </div>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.(voucher)}>
                Edit Voucher
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onViewUsage?.(voucher)}>
                View Usage
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onToggleStatus?.(voucher)}>
                {voucher.status === "active" ? "Deactivate" : "Activate"}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete?.(voucher)}
                className="text-red-600"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {voucher.description}
        </p>

        {/* Value and Usage */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="flex items-center gap-2">
            <DollarSign size={16} className="text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Value</p>
              <p className="text-sm font-semibold text-foreground">{formatValue()}</p>
            </div>
          </div>
          
          {voucher.usageLimit && (
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Usage</p>
                <p className="text-sm font-semibold text-foreground">
                  {voucher.usageCount}/{voucher.usageLimit}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Progress Bar for Usage */}
        {voucher.usageLimit && (
          <div className="mb-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={cn(
                  "h-2 rounded-full transition-all",
                  usagePercentage >= 90 ? "bg-red-500" : 
                  usagePercentage >= 70 ? "bg-amber-500" : "bg-green-500"
                )}
                style={{ width: `${Math.min(usagePercentage, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Footer Info */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Calendar size={12} />
              <span>Issued: {new Date(voucher.issueDate).toLocaleDateString()}</span>
            </div>
            {voucher.expiryDate && (
              <div className={cn(
                "flex items-center gap-1",
                isExpired && "text-red-500"
              )}>
                <Clock size={12} />
                <span>
                  Expires: {new Date(voucher.expiryDate).toLocaleDateString()}
                  {isExpired && " (Expired)"}
                </span>
              </div>
            )}
          </div>
          
          {getStatusIcon(voucher.status)}
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t">
            <div className="space-y-3">
              {/* Conditions */}
              {voucher.conditions && voucher.conditions.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">Conditions</h4>
                  <ul className="space-y-1">
                    {voucher.conditions.map((condition, index) => (
                      <li key={index} className="text-xs text-muted-foreground flex items-start gap-2">
                        <span className="w-1 h-1 bg-muted-foreground rounded-full mt-1 flex-shrink-0" />
                        {condition}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Assignment Info */}
              {(voucher.department || voucher.employeeId) && (
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">Assignment</h4>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {voucher.department && (
                      <div className="flex items-center gap-1">
                        <Users size={12} />
                        <span>{voucher.department}</span>
                      </div>
                    )}
                    {voucher.employeeId && (
                      <div className="flex items-center gap-1">
                        <Users size={12} />
                        <span>Employee: {voucher.employeeId}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="text-xs text-muted-foreground pt-2 border-t">
                <div>Created by: {voucher.createdBy}</div>
                <div>Created: {new Date(voucher.createdAt).toLocaleString()}</div>
                <div>Updated: {new Date(voucher.updatedAt).toLocaleString()}</div>
              </div>
            </div>
          </div>
        )}

        {/* Expand/Collapse Button */}
        <div className="mt-3 pt-3 border-t">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full text-xs"
          >
            {isExpanded ? "Show Less" : "Show More"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
