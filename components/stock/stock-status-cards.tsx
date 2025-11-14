"use client";

import { AlertCircle, TrendingDown, CheckCircle2, X } from "lucide-react";
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
      color: "text-status-alert-foreground",
      bgColor: "bg-status-alert/30",
      borderColor: "border-status-alert-border/50",
      activeBorderColor: "border-status-alert-border",
    },
    {
      status: STOCK_STATUS.LOW_STOCK,
      label: STOCK_STATUS_LABELS[STOCK_STATUS.LOW_STOCK],
      count: counts.lowStock,
      icon: TrendingDown,
      color: "text-status-warning-foreground",
      bgColor: "bg-status-warning/30",
      borderColor: "border-status-warning-border/50",
      activeBorderColor: "border-status-warning-border",
    },
    {
      status: STOCK_STATUS.IN_STOCK,
      label: STOCK_STATUS_LABELS[STOCK_STATUS.IN_STOCK],
      count: counts.inStock,
      icon: CheckCircle2,
      color: "text-status-ok-foreground",
      bgColor: "bg-status-ok/30",
      borderColor: "border-status-ok-border/50",
      activeBorderColor: "border-status-ok-border",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-2 md:gap-3">
      {cards.map(({ status, label, count, icon: Icon, color, bgColor, borderColor, activeBorderColor }) => {
        const isActive = activeFilter === status;

        return (
          <button
            key={status}
            onClick={() => onFilterChange(isActive ? "all" : status)}
            className={cn(
              "relative rounded-lg p-3 md:p-4 text-center transition-all cursor-pointer group",
              bgColor,
              "hover:shadow-md active:scale-95",
              isActive ? `border-2 ${activeBorderColor}` : `border ${borderColor} hover:${activeBorderColor}/70`
            )}
          >
            {/* Active indicator with close icon */}
            {isActive && (
              <div className={cn("absolute top-2 right-2 opacity-60 group-hover:opacity-100 transition-opacity", color)}>
                <X className="h-3 w-3 md:h-4 md:w-4" />
              </div>
            )}

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
