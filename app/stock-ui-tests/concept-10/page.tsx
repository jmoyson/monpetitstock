"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Minus, ArrowLeft } from "lucide-react";
import { mockProducts, type MockProduct } from "../mock-data";
import { getStockStatus } from "@/lib/constants/stock";
import { parseCategories } from "@/lib/utils/formatters";
import { ViewportWrapper } from "../components/viewport-wrapper";

export default function Concept10() {
  const [stocks, setStocks] = useState(mockProducts.map(p => p.current_stock));
  const [selectedProduct, setSelectedProduct] = useState<{ product: MockProduct; index: number } | null>(null);

  const updateStock = (index: number, delta: number) => {
    const newStocks = [...stocks];
    newStocks[index] = Math.max(0, newStocks[index] + delta);
    setStocks(newStocks);
  };

  return (
    <ViewportWrapper
      title="Dialogue d'Actions"
      description="Dialogue plein écran pour actions – focus total"
      conceptNumber={10}
    >
      <div className="bg-background min-h-screen">
        <div className="px-4 py-6">
          <Link href="/stock-ui-tests" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux concepts
          </Link>

          <div className="max-w-md mx-auto">
            <div className="space-y-2">
              {mockProducts.map((product, index) => {
                const status = getStockStatus(stocks[index], product.alert_threshold);

                return (
                  <button
                    key={product.id}
                    onClick={() => setSelectedProduct({ product, index })}
                    className="w-full border rounded-xl p-4 flex items-center justify-between hover:bg-accent/50 transition-all shadow-sm hover:shadow-md text-left"
                  >
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
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Dialog */}
      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <DialogContent className="max-w-sm">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedProduct.product.name}</DialogTitle>
                <DialogDescription>
                  {parseCategories(selectedProduct.product.category).join(", ")}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="text-center p-6 bg-accent/50 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-2">Stock actuel</div>
                  <div className="text-5xl font-bold tabular-nums">
                    {stocks[selectedProduct.index]}
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    {selectedProduct.product.unit}
                  </div>
                </div>

                <div className="flex gap-2">
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
        </DialogContent>
      </Dialog>
    </ViewportWrapper>
  );
}
