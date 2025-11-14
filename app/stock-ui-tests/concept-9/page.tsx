"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, Search, ArrowLeft } from "lucide-react";
import { mockProducts } from "../mock-data";
import { getStockStatus } from "@/lib/constants/stock";
import { ViewportWrapper } from "../components/viewport-wrapper";

export default function Concept9() {
  const [stocks, setStocks] = useState(mockProducts.map(p => p.current_stock));
  const [searchQuery, setSearchQuery] = useState("");

  const updateStock = (index: number, delta: number) => {
    const newStocks = [...stocks];
    newStocks[index] = Math.max(0, newStocks[index] + delta);
    setStocks(newStocks);
  };

  const filteredProducts = useMemo(() => {
    return mockProducts
      .map((product, index) => ({ product, index }))
      .filter(({ product }) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [searchQuery]);

  return (
    <ViewportWrapper
      title="Recherche Prioritaire"
      description="Grande barre de recherche avec actions rapides"
      conceptNumber={9}
    >
      <div className="bg-background min-h-screen">
        <div className="px-4 py-6">
          <Link href="/stock-ui-tests" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux concepts
          </Link>

          <div className="max-w-md mx-auto">
            {/* Large Search */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-lg rounded-xl shadow-sm"
              />
            </div>

            {/* Results */}
            <div className="space-y-3">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  Aucun produit trouvé
                </div>
              ) : (
                filteredProducts.map(({ product, index }) => {
                  const status = getStockStatus(stocks[index], product.alert_threshold);

                  return (
                    <div key={product.id} className="border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{product.name}</h3>
                          <p className="text-sm text-muted-foreground">{product.unit}</p>
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

                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => updateStock(index, -1)}
                          disabled={stocks[index] <= 0}
                        >
                          <Minus className="h-4 w-4 mr-2" />
                          Retirer
                        </Button>

                        <div className="text-center px-4">
                          <div className="text-3xl font-bold tabular-nums">{stocks[index]}</div>
                        </div>

                        <Button
                          className="flex-1"
                          onClick={() => updateStock(index, 1)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Ajouter
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </ViewportWrapper>
  );
}
