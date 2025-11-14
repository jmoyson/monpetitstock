"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, ArrowLeft, TrendingDown, AlertCircle, CheckCircle2 } from "lucide-react";
import { mockProducts } from "../mock-data";
import { getStockStatus, STOCK_STATUS } from "@/lib/constants/stock";
import { ViewportWrapper } from "../components/viewport-wrapper";

export default function Concept20() {
  const [stocks, setStocks] = useState(mockProducts.map(p => p.current_stock));

  const updateStock = (index: number, delta: number) => {
    const newStocks = [...stocks];
    newStocks[index] = Math.max(0, newStocks[index] + delta);
    setStocks(newStocks);
  };

  // Smart sorting: prioritize by status (out of stock > low > ok)
  const sortedProducts = useMemo(() => {
    return mockProducts
      .map((product, index) => ({ product, index }))
      .sort((a, b) => {
        const statusA = getStockStatus(stocks[a.index], a.product.alert_threshold);
        const statusB = getStockStatus(stocks[b.index], b.product.alert_threshold);

        const priorityA =
          statusA === STOCK_STATUS.OUT_OF_STOCK ? 0 :
          statusA === STOCK_STATUS.LOW_STOCK ? 1 : 2;

        const priorityB =
          statusB === STOCK_STATUS.OUT_OF_STOCK ? 0 :
          statusB === STOCK_STATUS.LOW_STOCK ? 1 : 2;

        return priorityA - priorityB;
      });
  }, [stocks]);

  return (
    <ViewportWrapper
      title="Priorité Intelligente"
      description="Trié par IA selon l'importance – gestion prédictive"
      conceptNumber={20}
    >
      <div className="bg-background min-h-screen">
        <div className="px-4 py-6">
          <Link href="/stock-ui-tests" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux concepts
          </Link>

          <div className="max-w-md mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-1">Priorité Intelligente</h1>
              <p className="text-sm text-muted-foreground">Trié par urgence et importance</p>
            </div>

            {/* Priority Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="border rounded-xl p-4 text-center hover:shadow-md transition-shadow">
                <AlertCircle className="h-5 w-5 text-destructive mx-auto mb-2" />
                <div className="text-2xl font-bold">
                  {sortedProducts.filter(({ product, index }) =>
                    getStockStatus(stocks[index], product.alert_threshold) === STOCK_STATUS.OUT_OF_STOCK
                  ).length}
                </div>
                <div className="text-xs text-muted-foreground">Rupture</div>
              </div>
              <div className="border rounded-xl p-4 text-center hover:shadow-md transition-shadow">
                <TrendingDown className="h-5 w-5 text-orange-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">
                  {sortedProducts.filter(({ product, index }) =>
                    getStockStatus(stocks[index], product.alert_threshold) === STOCK_STATUS.LOW_STOCK
                  ).length}
                </div>
                <div className="text-xs text-muted-foreground">Bas</div>
              </div>
              <div className="border rounded-xl p-4 text-center hover:shadow-md transition-shadow">
                <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">
                  {sortedProducts.filter(({ product, index }) =>
                    getStockStatus(stocks[index], product.alert_threshold) === STOCK_STATUS.IN_STOCK
                  ).length}
                </div>
                <div className="text-xs text-muted-foreground">OK</div>
              </div>
            </div>

            {/* Sorted Products */}
            <div className="space-y-3">
              {sortedProducts.map(({ product, index }) => {
                const status = getStockStatus(stocks[index], product.alert_threshold);
                const isPriority = status === STOCK_STATUS.OUT_OF_STOCK || status === STOCK_STATUS.LOW_STOCK;

                return (
                  <div
                    key={product.id}
                    className={`border rounded-xl p-4 hover:shadow-md transition-shadow ${
                      isPriority ? "border-orange-300 bg-orange-50/50 dark:bg-orange-950/20" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {isPriority && (
                            <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
                          )}
                          <div className="font-semibold truncate">{product.name}</div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {stocks[index]} {product.unit}
                        </div>
                      </div>
                      <Badge variant={
                        status === "out_of_stock" ? "destructive" :
                        status === "low_stock" ? "outline" :
                        "secondary"
                      }>
                        {status === "out_of_stock" ? "URGENT" :
                         status === "low_stock" ? "Bas" :
                         "OK"}
                      </Badge>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1 rounded-lg transition-all hover:scale-105"
                        onClick={() => updateStock(index, -1)}
                        disabled={stocks[index] <= 0}
                      >
                        <Minus className="h-4 w-4 mr-2" />
                        Retirer
                      </Button>
                      <Button
                        className="flex-1 rounded-lg transition-all hover:scale-105"
                        onClick={() => updateStock(index, 1)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </ViewportWrapper>
  );
}
