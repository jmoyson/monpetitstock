"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, ArrowLeft, List, Grid3X3 } from "lucide-react";
import { mockProducts } from "../mock-data";
import { getStockStatus } from "@/lib/constants/stock";
import { ViewportWrapper } from "../components/viewport-wrapper";

export default function Concept18() {
  const [stocks, setStocks] = useState(mockProducts.map(p => p.current_stock));
  const [view, setView] = useState<"list" | "grid">("list");

  const updateStock = (index: number, delta: number) => {
    const newStocks = [...stocks];
    newStocks[index] = Math.max(0, newStocks[index] + delta);
    setStocks(newStocks);
  };

  return (
    <ViewportWrapper
      title="Contrôles Segmentés"
      description="Basculer entre les vues – organisation flexible"
      conceptNumber={18}
    >
      <div className="bg-background min-h-screen">
        <div className="px-4 py-6">
          <Link href="/stock-ui-tests" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux concepts
          </Link>

          <div className="max-w-2xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-1">Contrôles Segmentés</h1>
                <p className="text-sm text-muted-foreground">Basculer entre les vues liste et grille</p>
              </div>

              {/* View Toggle */}
              <div className="flex border rounded-xl overflow-hidden shadow-sm">
                <Button
                  variant={view === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setView("list")}
                  className="rounded-none transition-all"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={view === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setView("grid")}
                  className="rounded-none transition-all"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* List View */}
            {view === "list" && (
              <div className="space-y-3">
                {mockProducts.map((product, index) => {
                  const status = getStockStatus(stocks[index], product.alert_threshold);

                  return (
                    <div key={product.id} className="border rounded-xl p-4 flex items-center gap-3 hover:shadow-md transition-shadow">
                      <div className="flex-1">
                        <div className="font-semibold">{product.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {stocks[index]} {product.unit}
                        </div>
                      </div>
                      <Badge variant={
                        status === "out_of_stock" ? "destructive" :
                        status === "low_stock" ? "outline" :
                        "secondary"
                      }>
                        {status === "out_of_stock" ? "Rupture" :
                         status === "low_stock" ? "Bas" :
                         "OK"}
                      </Badge>
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 rounded-lg transition-all hover:scale-105"
                          onClick={() => updateStock(index, -1)}
                          disabled={stocks[index] <= 0}
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          className="h-8 w-8 rounded-lg transition-all hover:scale-105"
                          onClick={() => updateStock(index, 1)}
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Grid View */}
            {view === "grid" && (
              <div className="grid grid-cols-2 gap-4">
                {mockProducts.map((product, index) => {
                  const status = getStockStatus(stocks[index], product.alert_threshold);

                  return (
                    <div key={product.id} className="border rounded-xl p-4 hover:shadow-md transition-shadow">
                      <Badge variant={
                        status === "out_of_stock" ? "destructive" :
                        status === "low_stock" ? "outline" :
                        "secondary"
                      } className="mb-2">
                        {status === "out_of_stock" ? "Rupture" :
                         status === "low_stock" ? "Bas" :
                         "OK"}
                      </Badge>
                      <h3 className="font-semibold text-sm mb-3 line-clamp-2">{product.name}</h3>

                      <div className="text-center py-3 mb-3">
                        <div className="text-3xl font-bold tabular-nums">{stocks[index]}</div>
                        <div className="text-xs text-muted-foreground">{product.unit}</div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="flex-1 h-9 rounded-lg transition-all hover:scale-105"
                          onClick={() => updateStock(index, -1)}
                          disabled={stocks[index] <= 0}
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          className="flex-1 h-9 rounded-lg transition-all hover:scale-105"
                          onClick={() => updateStock(index, 1)}
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </ViewportWrapper>
  );
}
