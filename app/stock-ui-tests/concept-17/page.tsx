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
import { Input } from "@/components/ui/input";
import { Plus, Minus, ArrowLeft } from "lucide-react";
import { mockProducts } from "../mock-data";
import { getStockStatus } from "@/lib/constants/stock";
import { ViewportWrapper } from "../components/viewport-wrapper";

export default function Concept17() {
  const [stocks, setStocks] = useState(mockProducts.map(p => p.current_stock));
  const [selectedIndex, setSelectedIndex] = useState("0");
  const [quickAmount, setQuickAmount] = useState("1");

  const updateStock = (index: number, delta: number) => {
    const newStocks = [...stocks];
    newStocks[index] = Math.max(0, newStocks[index] + delta);
    setStocks(newStocks);
  };

  const quickAdd = () => {
    const index = parseInt(selectedIndex);
    const amount = parseInt(quickAmount) || 1;
    updateStock(index, amount);
  };

  const quickRemove = () => {
    const index = parseInt(selectedIndex);
    const amount = parseInt(quickAmount) || 1;
    updateStock(index, -amount);
  };

  return (
    <ViewportWrapper
      title="Barre d'Entrée Rapide"
      description="Sélecteur de produit en haut – accès immédiat"
      conceptNumber={17}
    >
      <div className="bg-background min-h-screen">
        <div className="px-4 py-6">
          <Link href="/stock-ui-tests" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux concepts
          </Link>

          <div className="max-w-md mx-auto">
            {/* Quick Entry */}
            <div className="border rounded-xl p-4 mb-6 space-y-3 sticky top-6 bg-background shadow-lg z-10 hover:shadow-xl transition-shadow">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Produit</label>
                  <Select value={selectedIndex} onValueChange={setSelectedIndex}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {mockProducts.map((product, index) => (
                        <SelectItem key={product.id} value={index.toString()}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Quantité</label>
                  <Input
                    type="number"
                    value={quickAmount}
                    onChange={(e) => setQuickAmount(e.target.value)}
                    min="1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={quickRemove}
                  disabled={stocks[parseInt(selectedIndex)] < parseInt(quickAmount || "1")}
                >
                  <Minus className="h-4 w-4 mr-2" />
                  Retirer
                </Button>
                <Button onClick={quickAdd}>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter
                </Button>
              </div>

              <div className="text-center pt-2 border-t">
                <div className="text-sm text-muted-foreground">Stock actuel</div>
                <div className="text-3xl font-bold tabular-nums">
                  {stocks[parseInt(selectedIndex)]}
                </div>
              </div>
            </div>

            {/* Product List */}
            <div className="space-y-2">
              {mockProducts.map((product, index) => {
                const status = getStockStatus(stocks[index], product.alert_threshold);

                return (
                  <div key={product.id} className="border rounded-xl p-3 flex items-center justify-between hover:shadow-md transition-shadow">
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
      </div>
    </ViewportWrapper>
  );
}
