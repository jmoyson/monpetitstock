"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Minus, MoreHorizontal, Pencil, Trash2, ArrowLeft, Package } from "lucide-react";
import { mockProducts } from "../mock-data";
import { getStockStatus } from "@/lib/constants/stock";
import { parseCategories } from "@/lib/utils/formatters";
import { ViewportWrapper } from "../components/viewport-wrapper";

export default function Concept1() {
  const [stocks, setStocks] = useState(mockProducts.map(p => p.current_stock));

  const updateStock = (index: number, delta: number) => {
    const newStocks = [...stocks];
    newStocks[index] = Math.max(0, newStocks[index] + delta);
    setStocks(newStocks);
  };

  return (
    <ViewportWrapper
      title="Cartes Actuelles (Baseline)"
      description="Design mobile existant en cartes – référence de base"
      conceptNumber={1}
    >
      <div className="bg-background min-h-screen">
        <div className="px-4 py-6">
          <Link href="/stock-ui-tests" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux concepts
          </Link>

          <div className="space-y-3">
            {mockProducts.map((product, index) => {
              const categories = parseCategories(product.category);
              const status = getStockStatus(stocks[index], product.alert_threshold);

              return (
                <div key={product.id} className="rounded-xl border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow">
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
                        <Badge variant={
                          status === "out_of_stock" ? "destructive" :
                          status === "low_stock" ? "outline" :
                          "secondary"
                        } className="text-xs">
                          {status === "out_of_stock" ? "Rupture" :
                           status === "low_stock" ? "Bas" :
                           "OK"}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:bg-muted">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem className="cursor-pointer">
                              <Pencil className="h-3.5 w-3.5 mr-2" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive cursor-pointer">
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
                        {stocks[index]}
                      </span>
                      <p className="text-xs text-muted-foreground mt-1">{product.unit || 'unités'} en stock</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 h-9 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-colors"
                        onClick={() => updateStock(index, -1)}
                        disabled={stocks[index] <= 0}
                      >
                        <Minus className="h-4 w-4 mr-1.5" />
                        Retirer
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 h-9"
                        onClick={() => updateStock(index, 1)}
                      >
                        <Plus className="h-4 w-4 mr-1.5" />
                        Ajouter
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </ViewportWrapper>
  );
}
