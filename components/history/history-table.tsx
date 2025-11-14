"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  History,
  Search,
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
import { FreePlanAlert } from "@/components/shared/free-plan-alert";
import { ActivityCardMobile } from "./activity-card-mobile";
import { ActivityStatsCards } from "./activity-stats-cards";
import { HistoryFilterSortModal } from "./history-filter-sort-modal";

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

type HistoryTableProps = {
  activities: StockActivity[];
  isFreePlan: boolean;
  historyLimitDays: number;
};

export function HistoryTable({
  activities,
  isFreePlan,
  historyLimitDays,
}: HistoryTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [productFilters, setProductFilters] = useState<string[]>([]);
  const [sortMode, setSortMode] = useState("date-desc");

  // Extract unique products from activities
  const uniqueProducts = useMemo(() => {
    const products = activities
      .map((activity) => activity.products?.name || "Produit supprimé")
      .filter((name, index, self) => self.indexOf(name) === index)
      .sort();
    return products;
  }, [activities]);

  // Calculate statistics
  const stats = useMemo(() => {
    return activities.reduce(
      (acc, activity) => {
        if (activity.activity_type === "in") acc.totalIn++;
        if (activity.activity_type === "out") acc.totalOut++;
        acc.totalActivities++;
        return acc;
      },
      { totalIn: 0, totalOut: 0, totalActivities: 0 }
    );
  }, [activities]);

  // Filter and sort activities
  const filteredActivities = useMemo(() => {
    let filtered = activities.filter((activity) => {
      // Search filter
      const productName = activity.products?.name || "Produit supprimé";
      const matchesSearch = productName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      // Type filter
      if (typeFilter !== "all" && activity.activity_type !== typeFilter) {
        return false;
      }

      // Product filter
      if (productFilters.length > 0 && !productFilters.includes(productName)) {
        return false;
      }

      // Date filter
      if (dateFilter !== "all") {
        const activityDate = new Date(activity.created_at);
        const now = new Date();

        switch (dateFilter) {
          case "today":
            const isToday = activityDate.toDateString() === now.toDateString();
            if (!isToday) return false;
            break;
          case "week":
            const weekAgo = new Date(now);
            weekAgo.setDate(now.getDate() - 7);
            if (activityDate < weekAgo) return false;
            break;
          case "month":
            const monthAgo = new Date(now);
            monthAgo.setMonth(now.getMonth() - 1);
            if (activityDate < monthAgo) return false;
            break;
        }
      }

      return true;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortMode) {
        case "date-desc":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "date-asc":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "quantity-desc":
          return b.quantity - a.quantity;
        case "quantity-asc":
          return a.quantity - b.quantity;
        case "product-name":
          const aName = a.products?.name || "Produit supprimé";
          const bName = b.products?.name || "Produit supprimé";
          return aName.localeCompare(bName);
        default:
          return 0;
      }
    });

    return filtered;
  }, [activities, searchQuery, dateFilter, typeFilter, productFilters, sortMode]);

  return (
    <div className="space-y-4">
      {/* Free Plan Limit Alert */}
      {isFreePlan && (
        <FreePlanAlert
          title="Plan gratuit"
          description={`Passez à Premium pour accéder à l'historique complet sans limite.`}
          limitDisplay={`Historique limité à ${historyLimitDays} jours`}
          isPro={!isFreePlan}
        />
      )}

      {/* Search and Filter/Sort Toolbar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Rechercher un produit..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10"
          />
        </div>
        <HistoryFilterSortModal
          dateFilter={dateFilter}
          onDateFilterChange={setDateFilter}
          productFilters={productFilters}
          onProductFiltersChange={setProductFilters}
          availableProducts={uniqueProducts}
          sortMode={sortMode}
          onSortModeChange={setSortMode}
        />
      </div>

      {/* Activity Stats Cards */}
      <ActivityStatsCards
        stats={stats}
        activeFilter={typeFilter}
        onFilterChange={setTypeFilter}
      />

      {/* Empty State or Content */}
      {filteredActivities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <History className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">
            {activities.length === 0 ? "Aucune activité" : "Aucun résultat"}
          </h2>
          <p className="text-muted-foreground text-sm">
            {activities.length === 0
              ? "Les mouvements de stock apparaîtront ici"
              : "Essayez de modifier vos filtres"}
          </p>
        </div>
      ) : (
        <>
          {/* Mobile View */}
          <div className="md:hidden grid gap-3">
            {filteredActivities.map((activity) => (
              <ActivityCardMobile key={activity.id} activity={activity} />
            ))}
          </div>

          {/* Desktop View */}
          <div className="hidden md:block border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Produit</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Quantité</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredActivities.map((activity) => {
                  const IconComponent = activity.products
                    ? ICON_MAP[activity.products.icon] || Package
                    : Package;
                  const iconColor = activity.products?.icon_color || '#8b5cf6';

                  return (
                    <TableRow key={activity.id}>
                      <TableCell className="text-muted-foreground">
                        {formatDate(activity.created_at)}
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div
                            className="p-1.5 rounded-lg shrink-0"
                            style={{ backgroundColor: `${iconColor}20` }}
                          >
                            <IconComponent
                              className="h-3.5 w-3.5"
                              style={{ color: iconColor }}
                            />
                          </div>
                          <span>{activity.products?.name || "Produit supprimé"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <ActivityTypeBadge type={activity.activity_type} />
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatQuantity(activity.quantity)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
}
