"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Minus, ArrowLeft } from "lucide-react";
import { mockProducts } from "../mock-data";
import { getStockStatus } from "@/lib/constants/stock";
import { ViewportWrapper } from "../components/viewport-wrapper";

export default function Concept5() {
  const [stocks, setStocks] = useState(mockProducts.map(p => p.current_stock));

  const updateStock = (index: number, delta: number) => {
    const newStocks = [...stocks];
    newStocks[index] = Math.max(0, newStocks[index] + delta);
    setStocks(newStocks);
  };

  const setStock = (index: number, value: string) => {
    const num = parseInt(value) || 0;
    const newStocks = [...stocks];
    newStocks[index] = Math.max(0, num);
    setStocks(newStocks);
  };

  return (
    <ViewportWrapper
      title="Contrôle Intégré"
      description="Boutons +/- directs dans la liste – ajustement rapide"
      conceptNumber={5}
    >
      <div className="bg-background min-h-screen">
        <div className="px-4 py-6">
          <Link href="/stock-ui-tests" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux concepts
          </Link>

          <div className="max-w-md mx-auto">
            <div className="space-y-3">
              {mockProducts.map((product, index) => {
                const status = getStockStatus(stocks[index], product.alert_threshold);

                return (
                  <div key={product.id} className="border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold truncate">{product.name}</div>
                        <div className="text-xs text-muted-foreground">{product.unit}</div>
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
                    </div>

                    {/* Stepper */}
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => updateStock(index, -1)}
                        disabled={stocks[index] <= 0}
                        className="shrink-0"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>

                      <Input
                        type="number"
                        value={stocks[index]}
                        onChange={(e) => setStock(index, e.target.value)}
                        className="text-center text-lg font-bold tabular-nums h-10"
                        min="0"
                      />

                      <Button
                        size="icon"
                        onClick={() => updateStock(index, 1)}
                        className="shrink-0"
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
      </div>
    </ViewportWrapper>
  );
}
