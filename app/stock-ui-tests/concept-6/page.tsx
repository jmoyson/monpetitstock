"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Plus, Minus, Menu, ArrowLeft } from "lucide-react";
import { mockProducts } from "../mock-data";
import { getStockStatus } from "@/lib/constants/stock";
import { ViewportWrapper } from "../components/viewport-wrapper";

export default function Concept6() {
  const [stocks, setStocks] = useState(mockProducts.map(p => p.current_stock));

  const updateStock = (index: number, delta: number) => {
    const newStocks = [...stocks];
    newStocks[index] = Math.max(0, newStocks[index] + delta);
    setStocks(newStocks);
  };

  return (
    <ViewportWrapper
      title="Tiroir d'Actions"
      description="Interface glissante interactive – gestes fluides"
      conceptNumber={6}
    >
      <div className="bg-background min-h-screen">
        <div className="px-4 py-6">
          <Link href="/stock-ui-tests" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux concepts
          </Link>

          <div className="max-w-md mx-auto">
            <div className="mb-6 flex items-center justify-end">
              <Sheet>
                <SheetTrigger asChild>
                  <Button size="icon" variant="outline" className="rounded-xl">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-full sm:max-w-md">
                  <SheetHeader>
                    <SheetTitle>Gérer le stock</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-3 max-h-[calc(100vh-120px)] overflow-y-auto">
                    {mockProducts.map((product, index) => (
                      <div key={product.id} className="border rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-semibold text-sm">{product.name}</div>
                          <Badge variant="outline">{stocks[index]}</Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() => updateStock(index, -1)}
                            disabled={stocks[index] <= 0}
                          >
                            <Minus className="h-3.5 w-3.5 mr-1" />
                            -1
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1"
                            onClick={() => updateStock(index, 1)}
                          >
                            <Plus className="h-3.5 w-3.5 mr-1" />
                            +1
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Main View - Summary */}
            <div className="space-y-3">
              {mockProducts.map((product, index) => {
                const status = getStockStatus(stocks[index], product.alert_threshold);
                return (
                  <div key={product.id} className="border rounded-xl p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                    <div>
                      <div className="font-semibold">{product.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Stock: {stocks[index]} {product.unit}
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
