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

  // Exact same styling as landing page
  const classNameMap = {
    [STOCK_STATUS.OUT_OF_STOCK]:
      "bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-900",
    [STOCK_STATUS.LOW_STOCK]:
      "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-400 dark:border-yellow-900",
    [STOCK_STATUS.IN_STOCK]:
      "bg-green-100 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-900",
  };

  // Dot colors
  const dotColorMap = {
    [STOCK_STATUS.OUT_OF_STOCK]: "bg-red-500",
    [STOCK_STATUS.LOW_STOCK]: "bg-yellow-500",
    [STOCK_STATUS.IN_STOCK]: "bg-green-500",
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        "text-xs gap-1.5",
        classNameMap[status]
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", dotColorMap[status])} />
      {label}
    </Badge>
  );
}
