"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Minus,
  MoreHorizontal,
  Pencil,
  Trash2,
  Package,
} from "lucide-react";
import { StockStatusBadge } from "@/components/shared/stock-status-badge";
import { parseCategories } from "@/lib/utils/formatters";
import type { Product } from "@/app/(dashboard)/stock/actions";

type ProductCardMobileProps = {
  product: Product;
  onUse: (product: Product) => void;
  onRestock: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onQuickUpdate?: (productId: string, newStock: number) => Promise<void>;
  isProcessing: boolean;
  isDeleting: boolean;
};

export function ProductCardMobile({
  product,
  onUse,
  onRestock,
  onEdit,
  onDelete,
  onQuickUpdate,
  isProcessing,
  isDeleting,
}: ProductCardMobileProps) {
  const categories = parseCategories(product.category);
  const isOutOfStock = product.current_stock === 0;

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
              <h3 className="font-semibold text-base truncate">{product.name}</h3>
              {categories.length > 0 && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {categories.slice(0, 2).join(" · ")}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <StockStatusBadge
              currentStock={product.current_stock}
              alertThreshold={product.alert_threshold}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:bg-muted">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem className="cursor-pointer" onClick={() => onEdit(product)}>
                  <Pencil className="h-3.5 w-3.5 mr-2" />
                  Modifier
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive cursor-pointer"
                  onClick={() => onDelete(product.id)}
                >
                  <Trash2 className="h-3.5 w-3.5 mr-2" />
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Stock Display */}
        <div className="text-center py-2 bg-muted/30 rounded-lg">
          <span className="text-4xl font-bold tracking-tight tabular-nums">
            {product.current_stock}
          </span>
          <p className="text-xs text-muted-foreground mt-1">en stock</p>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 h-9 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-colors"
            onClick={() => onUse(product)}
            disabled={isProcessing || product.current_stock <= 0}
          >
            <Minus className="h-4 w-4 mr-1.5" />
            Retirer
          </Button>
          <Button
            variant={isOutOfStock ? "destructive" : "default"}
            size="sm"
            className="flex-1 h-9"
            onClick={() => onRestock(product)}
            disabled={isProcessing}
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Ajouter
          </Button>
        </div>
      </div>
    </div>
  );
}
