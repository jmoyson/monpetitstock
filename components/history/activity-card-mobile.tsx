"use client";

import { Calendar, Package } from "lucide-react";
import type { StockActivity } from "@/app/(dashboard)/history/actions";
import { ActivityTypeBadge } from "@/components/shared/activity-type-badge";
import { formatDate, formatQuantity } from "@/lib/utils/formatters";

type ActivityCardMobileProps = {
  activity: StockActivity;
};

export function ActivityCardMobile({ activity }: ActivityCardMobileProps) {
  return (
    <div className="rounded-xl border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="p-3 space-y-2">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2.5 flex-1 min-w-0">
            <div className="mt-0.5 p-1.5 rounded-lg bg-primary/10 shrink-0">
              <Package className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base truncate">
                {activity.products?.name || "Produit supprimé"}
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {formatDate(activity.created_at)}
              </div>
            </div>
          </div>
          <ActivityTypeBadge type={activity.activity_type} />
        </div>

        {/* Quantity Display */}
        <div className="text-center py-2 bg-muted/30 rounded-lg">
          <span className="text-3xl font-bold tracking-tight tabular-nums">
            {formatQuantity(activity.quantity)}
          </span>
          <p className="text-xs text-muted-foreground mt-1">quantité</p>
        </div>
      </div>
    </div>
  );
}
