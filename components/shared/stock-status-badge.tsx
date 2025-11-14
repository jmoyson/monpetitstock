import { Badge } from "@/components/ui/badge";
import {
  getStockStatus,
  STOCK_STATUS,
  STOCK_STATUS_LABELS,
} from "@/lib/constants/stock";
import { cn } from "@/lib/utils";

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
      "bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800",
    [STOCK_STATUS.LOW_STOCK]:
      "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-400 dark:border-orange-800",
    [STOCK_STATUS.IN_STOCK]:
      "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800",
  };

  // Dot indicator for minimalist design
  const dotClassMap = {
    [STOCK_STATUS.OUT_OF_STOCK]: "bg-red-600 dark:bg-red-500",
    [STOCK_STATUS.LOW_STOCK]: "bg-orange-600 dark:bg-orange-500",
    [STOCK_STATUS.IN_STOCK]: "bg-green-600 dark:bg-green-500",
  };

  return (
    <Badge
      variant={variantMap[status]}
      className={cn(
        "font-medium",
        classNameMap[status],
        status === STOCK_STATUS.OUT_OF_STOCK && "animate-pulse"
      )}
    >
      <span className="flex items-center gap-1.5">
        <span className={cn("h-1.5 w-1.5 rounded-full", dotClassMap[status])} />
        {label}
      </span>
    </Badge>
  );
}
