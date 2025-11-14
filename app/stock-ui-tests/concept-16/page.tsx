"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Minus, ArrowLeft } from "lucide-react";
import { mockProducts } from "../mock-data";
import { getStockStatus } from "@/lib/constants/stock";
import { ViewportWrapper } from "../components/viewport-wrapper";

export default function Concept16() {
  const [stocks, setStocks] = useState(mockProducts.map(p => p.current_stock));

  const updateStock = (index: number, delta: number) => {
    const newStocks = [...stocks];
    newStocks[index] = Math.max(0, newStocks[index] + delta);
    setStocks(newStocks);
  };

  return (
    <ViewportWrapper
      title="Menu Contextuel"
      description="Interactions par appui long – actions rapides"
      conceptNumber={16}
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
                  <DropdownMenu key={product.id}>
                    <DropdownMenuTrigger asChild>
                      <button className="w-full border rounded-xl p-3 flex items-center justify-between hover:bg-accent/50 hover:shadow-md transition-all text-left">
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
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuItem
                        onClick={() => updateStock(index, 1)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter 1
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => updateStock(index, 5)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter 5
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => updateStock(index, -1)}
                        disabled={stocks[index] <= 0}
                      >
                        <Minus className="h-4 w-4 mr-2" />
                        Retirer 1
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => updateStock(index, -5)}
                        disabled={stocks[index] < 5}
                      >
                        <Minus className="h-4 w-4 mr-2" />
                        Retirer 5
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </ViewportWrapper>
  );
}
