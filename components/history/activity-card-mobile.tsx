"use client";

import {
  Calendar,
  Package, Box, PackageOpen, PackageCheck, PackagePlus, PackageMinus,
  ShoppingCart, ShoppingBag, Store, Warehouse,
  Wrench, Hammer, Drill,
  Coffee, Wine, Beer, Pizza, Utensils,
  Shirt, Watch, Glasses, Gem, Crown,
  Cpu, HardDrive, Monitor, Smartphone, Headphones,
  Book, Pencil, Scissors, Paperclip, Ruler,
  Home, Building, Factory, Landmark,
  Car, Bike, Truck, Plane,
  Heart, Star, Sparkles, Flame, Zap,
  Circle, Square, Triangle,
  type LucideIcon,
} from "lucide-react";
import type { StockActivity } from "@/app/(dashboard)/history/actions";
import { ActivityTypeBadge } from "@/components/shared/activity-type-badge";
import { formatDate, formatQuantity } from "@/lib/utils/formatters";

// Map of icon names to components
const ICON_MAP: Record<string, LucideIcon> = {
  Package, Box, PackageOpen, PackageCheck, PackagePlus, PackageMinus,
  ShoppingCart, ShoppingBag, Store, Warehouse,
  Wrench, Hammer, Drill,
  Coffee, Wine, Beer, Pizza, Utensils,
  Shirt, Watch, Glasses, Gem, Crown,
  Cpu, HardDrive, Monitor, Smartphone, Headphones,
  Book, Pencil, Scissors, Paperclip, Ruler,
  Home, Building, Factory, Landmark,
  Car, Bike, Truck, Plane,
  Heart, Star, Sparkles, Flame, Zap,
  Circle, Square, Triangle,
};

type ActivityCardMobileProps = {
  activity: StockActivity;
};

export function ActivityCardMobile({ activity }: ActivityCardMobileProps) {
  // Get the icon component dynamically
  const IconComponent = activity.products
    ? ICON_MAP[activity.products.icon] || Package
    : Package;
  const iconColor = activity.products?.icon_color || '#8b5cf6';

  return (
    <div className="rounded-xl border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="p-3 space-y-2">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2.5 flex-1 min-w-0">
            <div
              className="mt-0.5 p-1.5 rounded-lg shrink-0"
              style={{ backgroundColor: `${iconColor}20` }}
            >
              <IconComponent
                className="h-4 w-4"
                style={{ color: iconColor }}
              />
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
