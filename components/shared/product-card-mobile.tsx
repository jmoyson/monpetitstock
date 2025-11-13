"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Minus, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { StockStatusBadge } from "@/components/shared/stock-status-badge";
import { parseCategories } from "@/lib/utils/formatters";
import { cn } from "@/lib/utils";
import type { Product } from "@/app/(dashboard)/stock/actions";

type ProductCardMobileProps = {
  product: Product;
  onUse: (product: Product) => void;
  onRestock: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  isProcessing: boolean;
  isDeleting: boolean;
};

export function ProductCardMobile({
  product,
  onUse,
  onRestock,
  onEdit,
  onDelete,
  isProcessing,
  isDeleting,
}: ProductCardMobileProps) {
  const categories = parseCategories(product.category);

  return (
    <div className={cn("rounded-lg border overflow-hidden")}>
      <div className="p-2.5 space-y-1.5">
        {/* Header with name, badge, and menu */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base truncate">{product.name}</h3>
            {categories.length > 0 && (
              <p className="text-xs text-muted-foreground/70 mt-0.5">
                {categories.slice(0, 2).join(" · ")}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <StockStatusBadge
              currentStock={product.current_stock}
              alertThreshold={product.alert_threshold}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  disabled={isDeleting}
                >
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(product)}>
                  <Pencil className="h-3.5 w-3.5 mr-2" />
                  Modifier
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete(product.id)}
                  className="text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-2" />
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Centered stock display */}
        <div className="text-center py-1">
          <span className="text-3xl font-bold tracking-tight">
            {product.current_stock}
          </span>
          <p className="text-xs text-muted-foreground mt-0.5">en stock</p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-1.5">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 h-8"
            onClick={() => onUse(product)}
            disabled={isProcessing || product.current_stock <= 0}
          >
            <Minus className="h-3.5 w-3.5 mr-1" />
            Utiliser
          </Button>
          <Button
            size="sm"
            className="flex-1 h-8"
            onClick={() => onRestock(product)}
            disabled={isProcessing}
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Ajouter
          </Button>
        </div>
      </div>
    </div>
  );
}
