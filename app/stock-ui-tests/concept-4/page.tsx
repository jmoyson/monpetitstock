"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Plus, Minus, ArrowLeft } from "lucide-react";
import { mockProducts, type MockProduct } from "../mock-data";
import { getStockStatus } from "@/lib/constants/stock";
import { parseCategories } from "@/lib/utils/formatters";
import { ViewportWrapper } from "../components/viewport-wrapper";

export default function Concept4() {
  const [stocks, setStocks] = useState(mockProducts.map(p => p.current_stock));
  const [selectedProduct, setSelectedProduct] = useState<{ product: MockProduct; index: number } | null>(null);

  const updateStock = (index: number, delta: number) => {
    const newStocks = [...stocks];
    newStocks[index] = Math.max(0, newStocks[index] + delta);
    setStocks(newStocks);
  };

  return (
    <ViewportWrapper
      title="Actions en Feuille"
      description="Appui pour ouvrir le panneau d'actions – interactions mobiles"
      conceptNumber={4}
    >
      <div className="bg-background min-h-screen">
        <div className="px-4 py-6">
          <Link href="/stock-ui-tests" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux concepts
          </Link>

          <div className="max-w-md mx-auto">
            <div className="border rounded-xl divide-y shadow-sm hover:shadow-md transition-shadow">
              {mockProducts.map((product, index) => {
                const status = getStockStatus(stocks[index], product.alert_threshold);
                const categories = parseCategories(product.category);

                return (
                  <button
                    key={product.id}
                    onClick={() => setSelectedProduct({ product, index })}
                    className="w-full flex items-center gap-3 p-4 hover:bg-accent/50 transition-colors text-left first:rounded-t-xl last:rounded-b-xl"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold truncate">{product.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {categories.slice(0, 2).join(" · ")}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-2xl font-bold tabular-nums">{stocks[index]}</div>
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
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sheet */}
      <Sheet open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <SheetContent side="bottom" className="max-w-md mx-auto">
          {selectedProduct && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedProduct.product.name}</SheetTitle>
                <SheetDescription>
                  {parseCategories(selectedProduct.product.category).join(", ")}
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-4">
                {/* Current Stock */}
                <div className="text-center p-6 bg-accent/50 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Stock actuel</div>
                  <div className="text-5xl font-bold tabular-nums">
                    {stocks[selectedProduct.index]}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {selectedProduct.product.unit}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => updateStock(selectedProduct.index, -5)}
                    disabled={stocks[selectedProduct.index] < 5}
                  >
                    -5
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => updateStock(selectedProduct.index, -1)}
                    disabled={stocks[selectedProduct.index] <= 0}
                  >
                    -1
                  </Button>
                  <Button
                    size="lg"
                    onClick={() => updateStock(selectedProduct.index, 1)}
                  >
                    +1
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="lg"
                    onClick={() => updateStock(selectedProduct.index, 5)}
                  >
                    +5
                  </Button>
                  <Button
                    size="lg"
                    onClick={() => updateStock(selectedProduct.index, 10)}
                  >
                    +10
                  </Button>
                </div>

                {/* Main Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      updateStock(selectedProduct.index, -1);
                      setSelectedProduct(null);
                    }}
                    disabled={stocks[selectedProduct.index] <= 0}
                  >
                    <Minus className="h-4 w-4 mr-2" />
                    Retirer
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => {
                      updateStock(selectedProduct.index, 1);
                      setSelectedProduct(null);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </ViewportWrapper>
  );
}
