"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, ArrowLeft } from "lucide-react";
import { mockProducts } from "../mock-data";
import { getStockStatus } from "@/lib/constants/stock";
import { ViewportWrapper } from "../components/viewport-wrapper";

export default function Concept15() {
  const [stocks, setStocks] = useState(mockProducts.map(p => p.current_stock));

  const updateStock = (index: number, delta: number) => {
    const newStocks = [...stocks];
    newStocks[index] = Math.max(0, newStocks[index] + delta);
    setStocks(newStocks);
  };

  return (
    <ViewportWrapper
      title="Défilement Horizontal"
      description="Cartes produits à faire glisser – navigation fluide"
      conceptNumber={15}
    >
      <div className="bg-background min-h-screen">
        <div className="px-4 py-6">
          <Link href="/stock-ui-tests" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux concepts
          </Link>

          <div className="max-w-2xl mx-auto">
            <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory">
              {mockProducts.map((product, index) => {
                const status = getStockStatus(stocks[index], product.alert_threshold);

                return (
                  <div
                    key={product.id}
                    className="flex-shrink-0 w-64 snap-center border rounded-xl p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold">{product.name}</h3>
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

                    <div className="text-center py-4 mb-4">
                      <div className="text-5xl font-bold tabular-nums">{stocks[index]}</div>
                      <div className="text-sm text-muted-foreground mt-1">{product.unit}</div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => updateStock(index, -1)}
                        disabled={stocks[index] <= 0}
                      >
                        <Minus className="h-4 w-4 mr-2" />
                        -1
                      </Button>
                      <Button
                        className="flex-1"
                        onClick={() => updateStock(index, 1)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        +1
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
