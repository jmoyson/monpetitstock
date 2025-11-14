"use client";

import { AlertCircle, TrendingDown, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { STOCK_STATUS, STOCK_STATUS_LABELS } from "@/lib/constants/stock";

type StockStatusCardsProps = {
  counts: {
    outOfStock: number;
    lowStock: number;
    inStock: number;
  };
  activeFilter: string;
  onFilterChange: (filter: string) => void;
};

export function StockStatusCards({
  counts,
  activeFilter,
  onFilterChange,
}: StockStatusCardsProps) {
  const cards = [
    {
      status: STOCK_STATUS.OUT_OF_STOCK,
      label: STOCK_STATUS_LABELS[STOCK_STATUS.OUT_OF_STOCK],
      count: counts.outOfStock,
      icon: AlertCircle,
      color: "text-red-700 dark:text-red-400",
      activeColor: "border-red-200 bg-red-100 dark:border-red-800 dark:bg-red-950",
    },
    {
      status: STOCK_STATUS.LOW_STOCK,
      label: STOCK_STATUS_LABELS[STOCK_STATUS.LOW_STOCK],
      count: counts.lowStock,
      icon: TrendingDown,
      color: "text-orange-700 dark:text-orange-400",
      activeColor: "border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950",
    },
    {
      status: STOCK_STATUS.IN_STOCK,
      label: STOCK_STATUS_LABELS[STOCK_STATUS.IN_STOCK],
      count: counts.inStock,
      icon: CheckCircle2,
      color: "text-green-700 dark:text-green-400",
      activeColor: "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-2 md:gap-3">
      {cards.map(({ status, label, count, icon: Icon, color, activeColor }) => {
        const isActive = activeFilter === status;

        return (
          <button
            key={status}
            onClick={() => onFilterChange(isActive ? "all" : status)}
            className={cn(
              "border rounded-lg p-3 md:p-4 text-center transition-all cursor-pointer bg-card",
              "hover:shadow-md active:scale-95",
              isActive ? activeColor : "hover:border-muted-foreground/30"
            )}
          >
            <Icon className={cn("h-5 w-5 md:h-6 md:w-6 mx-auto mb-2", color)} />
            <div className={cn("text-xl md:text-2xl font-bold tabular-nums", color)}>
              {count}
            </div>
            <div className="text-[10px] md:text-xs text-muted-foreground font-medium">
              {label}
            </div>
          </button>
        );
      })}
    </div>
  );
}
