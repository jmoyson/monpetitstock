"use client";

import { useTheme } from "next-themes";
import { Moon, Sun, Monitor, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const themeOptions = [
  {
    value: "light",
    label: "Clair",
    description: "Thème clair permanent",
    icon: Sun,
  },
  {
    value: "dark",
    label: "Sombre",
    description: "Thème sombre permanent",
    icon: Moon,
  },
  {
    value: "system",
    label: "Système",
    description: "S'adapte à vos préférences système",
    icon: Monitor,
  },
];

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="border rounded-lg bg-card">
      <div className="p-6 space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Apparence</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Personnalisez le thème de l'application
          </p>
        </div>

        <div className="grid gap-2">
          {themeOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = theme === option.value;

            return (
              <button
                key={option.value}
                onClick={() => setTheme(option.value)}
                className={cn(
                  "w-full flex items-start gap-3 p-3 rounded-lg text-left transition-all",
                  "border border-border hover:border-primary/50 hover:bg-muted/50",
                  isSelected && "border-primary bg-primary/5"
                )}
              >
                <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
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
      </div>
    </div>
  );
}
