"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SlidersHorizontal, Check, X, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

type HistoryFilterSortModalProps = {
  // Date filter
  dateFilter: string;
  onDateFilterChange: (value: string) => void;

  // Product filter
  productFilters: string[];
  onProductFiltersChange: (values: string[]) => void;
  availableProducts: string[];

  // Sort
  sortMode: string;
  onSortModeChange: (value: string) => void;
};

const dateOptions = [
  { value: "all", label: "Toutes périodes" },
  { value: "today", label: "Aujourd'hui" },
  { value: "week", label: "7 derniers jours" },
  { value: "month", label: "30 derniers jours" },
];

const sortOptions = [
  { value: "date-desc", label: "Plus récent → Plus ancien" },
  { value: "date-asc", label: "Plus ancien → Plus récent" },
  { value: "quantity-desc", label: "Quantité décroissante" },
  { value: "quantity-asc", label: "Quantité croissante" },
  { value: "product-name", label: "Nom produit (A-Z)" },
];

export function HistoryFilterSortModal({
  dateFilter,
  onDateFilterChange,
  productFilters,
  onProductFiltersChange,
  availableProducts,
  sortMode,
  onSortModeChange,
}: HistoryFilterSortModalProps) {
  const [open, setOpen] = useState(false);
  const [productPopoverOpen, setProductPopoverOpen] = useState(false);

  // Local state for filters (applied on "Apply" button)
  const [localDateFilter, setLocalDateFilter] = useState(dateFilter);
  const [localProductFilters, setLocalProductFilters] = useState(productFilters);
  const [localSortMode, setLocalSortMode] = useState(sortMode);

  const handleApply = () => {
    onDateFilterChange(localDateFilter);
    onProductFiltersChange(localProductFilters);
    onSortModeChange(localSortMode);
    setOpen(false);
  };

  const handleReset = () => {
    setLocalDateFilter("all");
    setLocalProductFilters([]);
    setLocalSortMode("date-desc");
  };

  const toggleProduct = (product: string) => {
    setLocalProductFilters((prev) =>
      prev.includes(product)
        ? prev.filter((p) => p !== product)
        : [...prev, product]
    );
  };

  const activeFiltersCount = [
    dateFilter !== "all" ? 1 : 0,
    productFilters.length > 0 ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-10 gap-2 relative">
          <SlidersHorizontal className="h-4 w-4" />
          <span className="hidden sm:inline">Trier & Filtrer</span>
          {activeFiltersCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Trier & Filtrer</DialogTitle>
          <DialogDescription>
            Personnalisez l'affichage de votre historique
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Sort Section */}
          <div className="space-y-2">
            <Label htmlFor="sort-select">Trier par</Label>
            <Select value={localSortMode} onValueChange={setLocalSortMode}>
              <SelectTrigger id="sort-select">
                <SelectValue placeholder="Choisir un tri" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Filter Section */}
          <div className="space-y-2">
            <Label htmlFor="date-select">Période</Label>
            <Select value={localDateFilter} onValueChange={setLocalDateFilter}>
              <SelectTrigger id="date-select">
                <SelectValue placeholder="Choisir une période" />
              </SelectTrigger>
              <SelectContent>
                {dateOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Product Filter Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Produits</Label>
              {localProductFilters.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLocalProductFilters([])}
                  className="h-7 text-xs px-2"
                >
                  <X className="h-3 w-3 mr-1" />
                  Effacer
                </Button>
              )}
            </div>
            <Popover open={productPopoverOpen} onOpenChange={setProductPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between"
                >
                  <span className="truncate">
                    {localProductFilters.length === 0
                      ? "Tous les produits"
                      : `${localProductFilters.length} produit${localProductFilters.length > 1 ? "s" : ""} sélectionné${localProductFilters.length > 1 ? "s" : ""}`}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Rechercher un produit..." />
                  <CommandList>
                    <CommandEmpty>Aucun produit trouvé.</CommandEmpty>
                    <CommandGroup>
                      {availableProducts.map((product) => (
                        <CommandItem
                          key={product}
                          value={product}
                          onSelect={() => toggleProduct(product)}
                        >
                          <div className="flex items-center gap-2 flex-1">
                            <div
                              className={cn(
                                "h-4 w-4 border rounded flex items-center justify-center",
                                localProductFilters.includes(product)
                                  ? "bg-primary border-primary"
                                  : "border-input"
                              )}
                            >
                              {localProductFilters.includes(product) && (
                                <Check className="h-3 w-3 text-primary-foreground" />
                              )}
                            </div>
                            <span className="truncate">{product}</span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {localProductFilters.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {localProductFilters.map((product) => (
                  <div
                    key={product}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-primary/10 text-xs font-medium"
                  >
                    <span className="truncate max-w-[150px]">{product}</span>
                    <button
                      onClick={() => toggleProduct(product)}
                      className="hover:bg-primary/20 rounded-sm p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleReset}>
            Réinitialiser
          </Button>
          <Button onClick={handleApply}>Appliquer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
