"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Plus, Minus, ArrowLeft } from "lucide-react";
import { mockProducts } from "../mock-data";
import { ViewportWrapper } from "../components/viewport-wrapper";

export default function Concept14() {
  const [stocks, setStocks] = useState(mockProducts.map(p => p.current_stock));
  const [search, setSearch] = useState("");

  const updateStock = (index: number, delta: number) => {
    const newStocks = [...stocks];
    newStocks[index] = Math.max(0, newStocks[index] + delta);
    setStocks(newStocks);
  };

  return (
    <ViewportWrapper
      title="Palette de Commandes"
      description="Interface pilotée au clavier – productivité avancée"
      conceptNumber={14}
    >
      <div className="bg-background min-h-screen">
        <div className="px-4 py-6">
          <Link href="/stock-ui-tests" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux concepts
          </Link>

          <div className="max-w-md mx-auto">
            <Command className="rounded-xl border shadow-md">
              <CommandInput
                placeholder="Rechercher un produit..."
                value={search}
                onValueChange={setSearch}
              />
              <CommandList className="max-h-[500px]">
                <CommandEmpty>Aucun produit trouvé.</CommandEmpty>
                <CommandGroup>
                  {mockProducts.map((product, index) => (
                    <CommandItem
                      key={product.id}
                      value={product.name}
                      className="flex items-center justify-between gap-3 py-3"
                    >
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
                          onClick={(e) => {
                            e.stopPropagation();
                            updateStock(index, -1);
                          }}
                          disabled={stocks[index] <= 0}
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateStock(index, 1);
                          }}
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </div>
        </div>
      </div>
    </ViewportWrapper>
  );
}
