"use client";

import { useState } from "react";
import { Search, ChevronsUpDown, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

type ProductFiltersProps = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  categoryFilters: string[];
  onCategoryFiltersChange: (value: string[]) => void;
  uniqueCategories: string[];
};

export function ProductFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  categoryFilters,
  onCategoryFiltersChange,
  uniqueCategories,
}: ProductFiltersProps) {
  const [open, setOpen] = useState(false);

  const toggleCategory = (category: string) => {
    if (categoryFilters.includes(category)) {
      onCategoryFiltersChange(categoryFilters.filter((c) => c !== category));
    } else {
      onCategoryFiltersChange([...categoryFilters, category]);
    }
  };

  const clearCategoryFilters = () => {
    onCategoryFiltersChange([]);
  };

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
          <div className="flex flex-row gap-2 md:shrink-0">
            {/* Stock Status Filter */}
            <Select value={statusFilter} onValueChange={onStatusFilterChange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous statuts</SelectItem>
                <SelectItem value="out_of_stock">Rupture</SelectItem>
                <SelectItem value="low_stock">Attention</SelectItem>
                <SelectItem value="in_stock">OK</SelectItem>
              </SelectContent>
            </Select>

            {/* Category Multi-Select Combobox */}
            {uniqueCategories.length > 0 && (
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[160px] justify-between"
                  >
                    <span className="truncate">
                      {categoryFilters.length === 0 ? (
                        "Catégories"
                      ) : (
                        <span className="flex items-center gap-1">
                          Catégories
                          <Badge
                            variant="secondary"
                            className="ml-1 px-1.5 py-0 text-xs"
                          >
                            {categoryFilters.length}
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
                      <CommandEmpty>Aucune catégorie trouvée</CommandEmpty>
                      <CommandGroup>
                        {uniqueCategories.map((category) => (
                          <CommandItem
                            key={category}
                            value={category}
                            onSelect={() => toggleCategory(category)}
                          >
                            <Checkbox
                              checked={categoryFilters.includes(category)}
                              className="mr-2"
                            />
                            <span className="flex-1">{category}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                    {categoryFilters.length > 0 && (
                      <div className="border-t p-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full"
                          onClick={clearCategoryFilters}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Effacer la sélection
                        </Button>
                      </div>
                    )}
                  </Command>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
