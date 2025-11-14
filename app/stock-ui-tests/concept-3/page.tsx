"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Plus, Minus, ChevronDown, ArrowLeft } from "lucide-react";
import { mockProducts } from "../mock-data";
import { getStockStatus } from "@/lib/constants/stock";
import { parseCategories } from "@/lib/utils/formatters";

import { ViewportWrapper } from "../components/viewport-wrapper";

export default function Concept3() {
  const [stocks, setStocks] = useState(mockProducts.map(p => p.current_stock));
  const [openItems, setOpenItems] = useState<string[]>([]);

  const updateStock = (index: number, delta: number) => {
    const newStocks = [...stocks];
    newStocks[index] = Math.max(0, newStocks[index] + delta);
    setStocks(newStocks);
  };

  const toggleItem = (id: string) => {
    setOpenItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <ViewportWrapper
      title="Liste Accordéon"
      description="Éléments extensibles avec détails – touchez pour déplier"
      conceptNumber={3}
    >
      <div className="bg-background min-h-screen">
        <div className="px-4 py-6">
          <Link href="/stock-ui-tests" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux concepts
          </Link>

          <div className="space-y-2">
            {mockProducts.map((product, index) => {
              const status = getStockStatus(stocks[index], product.alert_threshold);
              const categories = parseCategories(product.category);
              const isOpen = openItems.includes(product.id);

              return (
                <Collapsible
                  key={product.id}
                  open={isOpen}
                  onOpenChange={() => toggleItem(product.id)}
                >
                  <div className="border rounded-xl overflow-hidden bg-card shadow-sm hover:shadow-md transition-shadow">
                    <CollapsibleTrigger className="w-full">
                      <div className="flex items-center gap-3 p-3.5 hover:bg-accent/50 transition-colors">
                        <div className="flex-1 text-left min-w-0">
                          <div className="font-semibold truncate">{product.name}</div>
                          <div className="text-sm text-muted-foreground tabular-nums mt-0.5">
                            Stock : {stocks[index]} {product.unit}
                          </div>
                        </div>
                        <Badge variant={
                          status === "out_of_stock" ? "destructive" :
                          status === "low_stock" ? "outline" :
                          "secondary"
                        } className="text-xs">
                          {status === "out_of_stock" ? "Rupture" :
                           status === "low_stock" ? "Bas" :
                           "OK"}
                        </Badge>
                        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                      </div>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <div className="border-t bg-muted/30 p-4 space-y-4">
                        {/* Details */}
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="bg-background rounded-lg p-2.5">
                            <span className="text-muted-foreground text-xs block mb-1">Catégories</span>
                            <div className="font-medium">{categories.join(", ") || "—"}</div>
                          </div>
                          <div className="bg-background rounded-lg p-2.5">
                            <span className="text-muted-foreground text-xs block mb-1">Seuil d'alerte</span>
                            <div className="font-medium">{product.alert_threshold}</div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            className="flex-1 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateStock(index, -1);
                            }}
                            disabled={stocks[index] <= 0}
                          >
                            <Minus className="h-4 w-4 mr-2" />
                            Retirer
                          </Button>
                          <Button
                            className="flex-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateStock(index, 1);
                            }}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Ajouter
                          </Button>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              );
            })}
          </div>
        </div>
      </div>
    </ViewportWrapper>
  );
}
