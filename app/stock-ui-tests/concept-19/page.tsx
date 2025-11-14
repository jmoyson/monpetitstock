"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Plus, ArrowLeft } from "lucide-react";
import { mockProducts } from "../mock-data";
import { getStockStatus } from "@/lib/constants/stock";
import { ViewportWrapper } from "../components/viewport-wrapper";

export default function Concept19() {
  const [stocks, setStocks] = useState(mockProducts.map(p => p.current_stock));
  const [selectedProduct, setSelectedProduct] = useState("");

  const updateStock = (index: number, delta: number) => {
    const newStocks = [...stocks];
    newStocks[index] = Math.max(0, newStocks[index] + delta);
    setStocks(newStocks);
  };

  const quickAdd = (amount: number) => {
    if (!selectedProduct) return;
    const index = parseInt(selectedProduct);
    updateStock(index, amount);
  };

  return (
    <ViewportWrapper
      title="Ajout Rapide Flottant"
      description="Bouton flottant avec sélecteur – toujours accessible"
      conceptNumber={19}
    >
      <div className="bg-background min-h-screen pb-20">
        <div className="px-4 py-6">
          <Link href="/stock-ui-tests" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux concepts
          </Link>

          <div className="max-w-md mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-1">Ajout Rapide Flottant</h1>
              <p className="text-sm text-muted-foreground">Bouton flottant avec sélecteur de produit</p>
            </div>

            {/* Product List */}
            <div className="space-y-3">
              {mockProducts.map((product, index) => {
                const status = getStockStatus(stocks[index], product.alert_threshold);

                return (
                  <div key={product.id} className="border rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-shadow">
                    <div>
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
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Floating Action Button */}
        <div className="fixed bottom-6 right-6">
          <Popover>
            <PopoverTrigger asChild>
              <Button size="lg" className="rounded-full h-14 w-14 shadow-lg hover:shadow-xl transition-shadow">
                <Plus className="h-6 w-6" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 rounded-xl" align="end">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Ajouter du stock</h4>
                  <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                    <SelectTrigger className="rounded-lg">
                      <SelectValue placeholder="Sélectionner un produit" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockProducts.map((product, index) => (
                        <SelectItem key={product.id} value={index.toString()}>
                          {product.name} ({stocks[index]})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    className="rounded-lg transition-all hover:scale-105"
                    onClick={() => quickAdd(1)}
                    disabled={!selectedProduct}
                  >
                    +1
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-lg transition-all hover:scale-105"
                    onClick={() => quickAdd(5)}
                    disabled={!selectedProduct}
                  >
                    +5
                  </Button>
                  <Button
                    className="rounded-lg transition-all hover:scale-105"
                    onClick={() => quickAdd(10)}
                    disabled={!selectedProduct}
                  >
                    +10
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </ViewportWrapper>
  );
}
