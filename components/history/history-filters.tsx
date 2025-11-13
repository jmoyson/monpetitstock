"use client"

import { useState } from "react"
import { Search, ChevronsUpDown, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type HistoryFiltersProps = {
  searchQuery: string
  onSearchChange: (value: string) => void
  dateFilter: string
  onDateFilterChange: (value: string) => void
  typeFilter: string
  onTypeFilterChange: (value: string) => void
  productFilters: string[]
  onProductFiltersChange: (value: string[]) => void
  uniqueProducts: string[]
}

export function HistoryFilters({
  searchQuery,
  onSearchChange,
  dateFilter,
  onDateFilterChange,
  typeFilter,
  onTypeFilterChange,
  productFilters,
  onProductFiltersChange,
  uniqueProducts,
}: HistoryFiltersProps) {
  const [open, setOpen] = useState(false)

  const toggleProduct = (product: string) => {
    if (productFilters.includes(product)) {
      onProductFiltersChange(productFilters.filter((p) => p !== product))
    } else {
      onProductFiltersChange([...productFilters, product])
    }
  }

  const clearProductFilters = () => {
    onProductFiltersChange([])
  }

  return (
    <div className="mb-6">
      {/* Desktop: All on one line. Mobile: Search on line 1, filters on line 2 */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-col md:flex-row gap-2">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters group - stays together */}
          <div className="flex flex-row gap-2 md:flex-shrink-0">
            {/* Date Filter */}
            <Select value={dateFilter} onValueChange={onDateFilterChange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes périodes</SelectItem>
                <SelectItem value="today">Aujourd'hui</SelectItem>
                <SelectItem value="week">7 derniers jours</SelectItem>
                <SelectItem value="month">30 derniers jours</SelectItem>
              </SelectContent>
            </Select>

            {/* Type Filter */}
            <Select value={typeFilter} onValueChange={onTypeFilterChange}>
              <SelectTrigger className="w-[130px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous types</SelectItem>
                <SelectItem value="in">Entrées</SelectItem>
                <SelectItem value="out">Sorties</SelectItem>
              </SelectContent>
            </Select>

            {/* Product Multi-Select Combobox */}
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-[160px] justify-between"
                >
                  <span className="truncate">
                    {productFilters.length === 0 ? (
                      "Produits"
                    ) : (
                      <span className="flex items-center gap-1">
                        Produits
                        <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-xs">
                          {productFilters.length}
                        </Badge>
                      </span>
                    )}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[250px] p-0" align="end">
                <Command>
                  <CommandInput placeholder="Rechercher..." />
                  <CommandList>
                    <CommandEmpty>Aucun produit trouvé</CommandEmpty>
                    <CommandGroup>
                      {uniqueProducts.map((product) => (
                        <CommandItem
                          key={product}
                          value={product}
                          onSelect={() => toggleProduct(product)}
                        >
                          <Checkbox
                            checked={productFilters.includes(product)}
                            className="mr-2"
                          />
                          <span className="flex-1">{product}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                  {productFilters.length > 0 && (
                    <div className="border-t p-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full"
                        onClick={clearProductFilters}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Effacer la sélection
                      </Button>
                    </div>
                  )}
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </div>
  )
}
