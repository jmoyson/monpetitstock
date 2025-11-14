"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Minus, ArrowLeft } from "lucide-react";
import { mockProducts } from "../mock-data";
import { getStockStatus } from "@/lib/constants/stock";
import { ViewportWrapper } from "../components/viewport-wrapper";

export default function Concept13() {
  const [stocks, setStocks] = useState(mockProducts.map(p => p.current_stock));
  const [selected, setSelected] = useState<number[]>([]);

  const updateStock = (index: number, delta: number) => {
    const newStocks = [...stocks];
    newStocks[index] = Math.max(0, newStocks[index] + delta);
    setStocks(newStocks);
  };

  const bulkUpdate = (delta: number) => {
    const newStocks = [...stocks];
    selected.forEach(index => {
      newStocks[index] = Math.max(0, newStocks[index] + delta);
    });
    setStocks(newStocks);
    setSelected([]);
  };

  const toggleSelect = (index: number) => {
    setSelected(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  return (
    <ViewportWrapper
      title="Sélection Multiple"
      description="Multi-sélection avec actions groupées – efficacité maximale"
      conceptNumber={13}
    >
      <div className="bg-background min-h-screen pb-24">
        <div className="px-4 py-6">
          <Link href="/stock-ui-tests" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux concepts
          </Link>

          <div className="max-w-md mx-auto">
            <div className="space-y-2">
              {mockProducts.map((product, index) => {
                const status = getStockStatus(stocks[index], product.alert_threshold);
                const isSelected = selected.includes(index);

                return (
                  <div
                    key={product.id}
                    className={`border rounded-xl p-3 transition-all ${
                      isSelected ? "bg-accent border-primary hover:shadow-md" : "hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleSelect(index)}
                      />

                      <div className="flex-1 min-w-0">
                        <div className="font-semibold truncate">{product.name}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={
                            status === "out_of_stock" ? "destructive" :
                            status === "low_stock" ? "outline" :
                            "secondary"
                          }>
                            {stocks[index]} {product.unit}
                          </Badge>
                        </div>
                      </div>

                      {!isSelected && (
                        <div className="flex gap-1">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8"
                            onClick={() => updateStock(index, -1)}
                            disabled={stocks[index] <= 0}
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateStock(index, 1)}
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selected.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 border-t bg-background p-4 shadow-lg">
            <div className="container max-w-md mx-auto">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{selected.length} sélectionnés</span>
                <div className="flex-1 flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => bulkUpdate(-1)}
                  >
                    <Minus className="h-4 w-4 mr-2" />
                    -1 Tous
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => bulkUpdate(1)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    +1 Tous
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelected([])}
                >
                  Annuler
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ViewportWrapper>
  );
}
