"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, ArrowLeft } from "lucide-react";
import { mockProducts } from "../mock-data";
import { getStockStatus } from "@/lib/constants/stock";
import { ViewportWrapper } from "../components/viewport-wrapper";

export default function Concept7() {
  const [stocks, setStocks] = useState(mockProducts.map(p => p.current_stock));

  const updateStock = (index: number, delta: number) => {
    const newStocks = [...stocks];
    newStocks[index] = Math.max(0, newStocks[index] + delta);
    setStocks(newStocks);
  };

  return (
    <ViewportWrapper
      title="Vue Grille"
      description="Grille compacte de produits – vue d'ensemble optimale"
      conceptNumber={7}
    >
      <div className="bg-background min-h-screen">
        <div className="px-4 py-6">
          <Link href="/stock-ui-tests" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux concepts
          </Link>

          <div className="max-w-md mx-auto">
            <div className="grid grid-cols-2 gap-3">
              {mockProducts.map((product, index) => {
                const status = getStockStatus(stocks[index], product.alert_threshold);

                return (
                  <div key={product.id} className="border rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow">
                    <div className="mb-2">
                      <Badge variant={
                        status === "out_of_stock" ? "destructive" :
                        status === "low_stock" ? "outline" :
                        "secondary"
                      } className="mb-2">
                        {status === "out_of_stock" ? "Rupture" :
                         status === "low_stock" ? "Bas" :
                         "OK"}
                      </Badge>
                      <h3 className="font-semibold text-sm leading-tight line-clamp-2 min-h-[2.5rem]">
                        {product.name}
                      </h3>
                    </div>

                    <div className="text-center py-2 mb-2">
                      <div className="text-3xl font-bold tabular-nums">{stocks[index]}</div>
                      <div className="text-xs text-muted-foreground">{product.unit}</div>
                    </div>

                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="outline"
                        className="flex-1 h-8"
                        onClick={() => updateStock(index, -1)}
                        disabled={stocks[index] <= 0}
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        className="flex-1 h-8"
                        onClick={() => updateStock(index, 1)}
                      >
                        <Plus className="h-3.5 w-3.5" />
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
