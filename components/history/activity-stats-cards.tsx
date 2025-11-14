"use client";

import { ArrowUpCircle, ArrowDownCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ActivityStatsCardsProps = {
  stats: {
    totalIn: number;
    totalOut: number;
    totalActivities: number;
  };
  activeFilter: string;
  onFilterChange: (filter: string) => void;
};

export function ActivityStatsCards({
  stats,
  activeFilter,
  onFilterChange,
}: ActivityStatsCardsProps) {
  const cards = [
    {
      type: "in",
      label: "Entrées",
      count: stats.totalIn,
      icon: ArrowUpCircle,
      color: "text-activity-in-foreground",
      activeColor: "border-activity-in-border bg-activity-in",
    },
    {
      type: "out",
      label: "Sorties",
      count: stats.totalOut,
      icon: ArrowDownCircle,
      color: "text-activity-out-foreground",
      activeColor: "border-activity-out-border bg-activity-out",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-2 md:gap-3">
      {cards.map(({ type, label, count, icon: Icon, color, activeColor }) => {
        const isActive = activeFilter === type;

        return (
          <button
            key={type}
            onClick={() => onFilterChange(isActive ? "all" : type)}
            className={cn(
              "relative border rounded-lg p-3 md:p-4 text-center transition-all cursor-pointer bg-card group",
              "hover:shadow-md active:scale-95",
              isActive ? activeColor : "hover:border-muted-foreground/30"
            )}
          >
            {/* Active indicator with close icon */}
            {isActive && (
              <div className="absolute top-2 right-2 opacity-60 group-hover:opacity-100 transition-opacity">
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
