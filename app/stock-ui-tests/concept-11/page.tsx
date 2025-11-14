"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, ArrowLeft } from "lucide-react";
import { mockProducts } from "../mock-data";
import { getStockStatus } from "@/lib/constants/stock";
import { ViewportWrapper } from "../components/viewport-wrapper";

export default function Concept11() {
  const [stocks, setStocks] = useState(mockProducts.map(p => p.current_stock));

  const updateStock = (index: number, delta: number) => {
    const newStocks = [...stocks];
    newStocks[index] = Math.max(0, newStocks[index] + delta);
    setStocks(newStocks);
  };

  return (
    <ViewportWrapper
      title="Vue Divisée"
      description="Disposition sur deux colonnes – comparaison facilitée"
      conceptNumber={11}
    >
      <div className="bg-background min-h-screen">
        <div className="px-4 py-6">
          <Link href="/stock-ui-tests" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux concepts
          </Link>

          <div className="max-w-md mx-auto">
            <div className="border rounded-xl divide-y hover:shadow-md transition-shadow">
              {mockProducts.map((product, index) => {
                const status = getStockStatus(stocks[index], product.alert_threshold);

                return (
                  <div key={product.id} className="p-3 grid grid-cols-[1fr,auto,auto] gap-3 items-center">
                    <div className="min-w-0">
                      <div className="font-semibold text-sm truncate">{product.name}</div>
                      <Badge variant={
                        status === "out_of_stock" ? "destructive" :
                        status === "low_stock" ? "outline" :
                        "secondary"
                      } className="mt-1">
                        {status === "out_of_stock" ? "Rupture" :
                         status === "low_stock" ? "Bas" :
                         "OK"}
                      </Badge>
                    </div>

                    <div className="text-center">
                      <div className="text-2xl font-bold tabular-nums">{stocks[index]}</div>
                      <div className="text-xs text-muted-foreground">{product.unit}</div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <Button
                        size="sm"
                        className="h-7 w-16"
                        onClick={() => updateStock(index, 1)}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        +1
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 w-16"
                        onClick={() => updateStock(index, -1)}
                        disabled={stocks[index] <= 0}
                      >
                        <Minus className="h-3 w-3 mr-1" />
                        -1
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
