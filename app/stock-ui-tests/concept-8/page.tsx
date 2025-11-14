"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, ArrowLeft } from "lucide-react";
import { mockProducts } from "../mock-data";
import { getStockStatus, STOCK_STATUS } from "@/lib/constants/stock";
import { ViewportWrapper } from "../components/viewport-wrapper";

export default function Concept8() {
  const [stocks, setStocks] = useState(mockProducts.map(p => p.current_stock));

  const updateStock = (index: number, delta: number) => {
    const newStocks = [...stocks];
    newStocks[index] = Math.max(0, newStocks[index] + delta);
    setStocks(newStocks);
  };

  const groupedProducts = useMemo(() => {
    const groups = {
      [STOCK_STATUS.OUT_OF_STOCK]: [] as Array<{ product: typeof mockProducts[0]; index: number }>,
      [STOCK_STATUS.LOW_STOCK]: [] as Array<{ product: typeof mockProducts[0]; index: number }>,
      [STOCK_STATUS.IN_STOCK]: [] as Array<{ product: typeof mockProducts[0]; index: number }>
    };

    mockProducts.forEach((product, index) => {
      const status = getStockStatus(stocks[index], product.alert_threshold);
      groups[status].push({ product, index });
    });

    return groups;
  }, [stocks]);

  const StatusSection = ({ title, status, items, variant }: any) => {
    if (items.length === 0) return null;

    return (
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant={variant}>{title}</Badge>
          <span className="text-sm text-muted-foreground">({items.length})</span>
        </div>
        <div className="space-y-2">
          {items.map(({ product, index }: any) => (
            <div key={product.id} className="border rounded-xl p-4 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{product.name}</div>
                <div className="text-sm text-muted-foreground">
                  {stocks[index]} {product.unit}
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
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
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <ViewportWrapper
      title="Groupé par Statut"
      description="Organisé par niveau de stock – priorités visuelles"
      conceptNumber={8}
    >
      <div className="bg-background min-h-screen">
        <div className="px-4 py-6">
          <Link href="/stock-ui-tests" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux concepts
          </Link>

          <div className="max-w-md mx-auto">
            <StatusSection
              title="Rupture de stock"
              status={STOCK_STATUS.OUT_OF_STOCK}
              items={groupedProducts[STOCK_STATUS.OUT_OF_STOCK]}
              variant="destructive"
            />

            <StatusSection
              title="Stock faible"
              status={STOCK_STATUS.LOW_STOCK}
              items={groupedProducts[STOCK_STATUS.LOW_STOCK]}
              variant="outline"
            />

            <StatusSection
              title="En stock"
              status={STOCK_STATUS.IN_STOCK}
              items={groupedProducts[STOCK_STATUS.IN_STOCK]}
              variant="secondary"
            />
          </div>
        </div>
      </div>
    </ViewportWrapper>
  );
}
