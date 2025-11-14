import { Badge } from "@/components/ui/badge";
import {
  getStockStatus,
  STOCK_STATUS,
  STOCK_STATUS_LABELS,
} from "@/lib/constants/stock";
import { cn } from "@/lib/utils";
import { AlertCircle, TrendingDown, CheckCircle2 } from "lucide-react";

type StockStatusBadgeProps = {
  currentStock: number;
  alertThreshold: number;
};

export function StockStatusBadge({
  currentStock,
  alertThreshold,
}: StockStatusBadgeProps) {
  const status = getStockStatus(currentStock, alertThreshold);
  const label = STOCK_STATUS_LABELS[status];

  // Consistent styling for all stock statuses
  const variantMap = {
    [STOCK_STATUS.OUT_OF_STOCK]: "destructive" as const,
    [STOCK_STATUS.LOW_STOCK]: "outline" as const,
    [STOCK_STATUS.IN_STOCK]: "secondary" as const,
  };

  const classNameMap = {
    [STOCK_STATUS.OUT_OF_STOCK]:
      "bg-status-alert text-status-alert-foreground border-status-alert-border",
    [STOCK_STATUS.LOW_STOCK]:
      "bg-status-warning text-status-warning-foreground border-status-warning-border",
    [STOCK_STATUS.IN_STOCK]:
      "bg-status-ok text-status-ok-foreground border-status-ok-border",
  };

  // Icon components
  const IconComponent = {
    [STOCK_STATUS.OUT_OF_STOCK]: AlertCircle,
    [STOCK_STATUS.LOW_STOCK]: TrendingDown,
    [STOCK_STATUS.IN_STOCK]: CheckCircle2,
  }[status];

  return (
    <Badge
      variant={variantMap[status]}
      className={cn(
        "font-medium gap-1",
        classNameMap[status]
      )}
    >
      <IconComponent className="h-3 w-3" />
      {label}
    </Badge>
  );
}
