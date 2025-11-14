"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type SortSelectProps = {
  value: string;
  onValueChange: (value: string) => void;
};

const sortOptions = [
  { value: "status", label: "Statut (urgence)", description: "Afficher les produits en rupture en premier" },
  { value: "stock-asc", label: "Stock croissant", description: "Du plus petit au plus grand stock" },
  { value: "stock-desc", label: "Stock décroissant", description: "Du plus grand au plus petit stock" },
  { value: "name", label: "Nom (A-Z)", description: "Ordre alphabétique" },
];

export function FilterSortSheet({ value, onValueChange }: SortSelectProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (newValue: string) => {
    onValueChange(newValue);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-10 w-10 p-0">
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Trier les produits</DialogTitle>
          <DialogDescription>
            Choisissez l'ordre d'affichage de vos produits
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-2 py-4">
          {sortOptions.map((option) => {
            const isSelected = value === option.value;

            return (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={cn(
                  "w-full flex items-start gap-3 p-3 rounded-lg text-left transition-all",
                  "border border-border hover:border-primary/50 hover:bg-muted/50",
                  isSelected && "border-primary bg-primary/5"
                )}
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm mb-0.5">
                    {option.label}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {option.description}
                  </div>
                </div>
                {isSelected && (
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
