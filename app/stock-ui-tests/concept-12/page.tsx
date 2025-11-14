"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Minus, ArrowLeft } from "lucide-react";
import { mockProducts } from "../mock-data";
import { ViewportWrapper } from "../components/viewport-wrapper";

export default function Concept12() {
  const [stocks, setStocks] = useState(mockProducts.map(p => p.current_stock));

  const updateStock = (index: number, delta: number) => {
    const newStocks = [...stocks];
    newStocks[index] = Math.max(0, newStocks[index] + delta);
    setStocks(newStocks);
  };

  return (
    <ViewportWrapper
      title="Cartes Minimalistes"
      description="Design ultra-épuré et moderne – essentialisme"
      conceptNumber={12}
    >
      <div className="bg-background min-h-screen">
        <div className="px-4 py-6">
          <Link href="/stock-ui-tests" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux concepts
          </Link>

          <div className="max-w-md mx-auto">
            <div className="space-y-4">
              {mockProducts.map((product, index) => (
                <div key={product.id} className="border rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">{product.name}</h3>
                    <span className="text-3xl font-bold tabular-nums">{stocks[index]}</span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => updateStock(index, -1)}
                      disabled={stocks[index] <= 0}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={() => updateStock(index, 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ViewportWrapper>
  );
}
