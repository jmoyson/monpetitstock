"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, ArrowLeft } from "lucide-react";
import { mockProducts } from "../mock-data";
import { getStockStatus } from "@/lib/constants/stock";
import { ViewportWrapper } from "../components/viewport-wrapper";

export default function Concept2() {
  const [stocks, setStocks] = useState(mockProducts.map(p => p.current_stock));

  const updateStock = (index: number, delta: number) => {
    const newStocks = [...stocks];
    newStocks[index] = Math.max(0, newStocks[index] + delta);
    setStocks(newStocks);
  };

  return (
    <ViewportWrapper
      title="Liste Compacte"
      description="Liste dense avec actions intégrées – voir plus d'un coup d'œil"
      conceptNumber={2}
    >
      <div className="bg-background min-h-screen">
        <div className="px-4 py-6">
          <Link href="/stock-ui-tests" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux concepts
          </Link>

          <div className="border rounded-xl divide-y bg-card shadow-sm">
            {mockProducts.map((product, index) => {
              const status = getStockStatus(stocks[index], product.alert_threshold);

              return (
                <div key={product.id} className="flex items-center gap-3 p-3 hover:bg-accent/50 transition-colors">
                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate">{product.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="h-5 text-xs">
                        {status === "out_of_stock" ? "Rupture" :
                         status === "low_stock" ? "Bas" :
                         "OK"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{product.unit}</span>
                    </div>
                  </div>

                  {/* Stock Counter */}
                  <div className="text-center shrink-0 px-2">
                    <div className="text-2xl font-bold tabular-nums">{stocks[index]}</div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1.5 shrink-0">
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-9 w-9 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-colors"
                      onClick={() => updateStock(index, -1)}
                      disabled={stocks[index] <= 0}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      className="h-9 w-9"
                      onClick={() => updateStock(index, 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
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
