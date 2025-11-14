"use client";

import { useState, ReactNode } from "react";
import { Smartphone, Tablet, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Viewport = "mobile" | "tablet" | "desktop";

interface ViewportWrapperProps {
  children: ReactNode;
  title: string;
  description: string;
  conceptNumber: number;
}

const viewportConfig = {
  mobile: {
    maxWidth: "max-w-[375px]",
    label: "Mobile",
    icon: Smartphone,
    width: "375px"
  },
  tablet: {
    maxWidth: "max-w-[768px]",
    label: "Tablette",
    icon: Tablet,
    width: "768px"
  },
  desktop: {
    maxWidth: "max-w-[1200px]",
    label: "Bureau",
    icon: Monitor,
    width: "1200px"
  }
};

export function ViewportWrapper({ children, title, description, conceptNumber }: ViewportWrapperProps) {
  const [viewport, setViewport] = useState<Viewport>("mobile");
  const config = viewportConfig[viewport];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Fixed Header with Viewport Toggle */}
      <div className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            {/* Title Section */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="shrink-0">
                  Concept #{conceptNumber}
                </Badge>
                <h1 className="text-lg font-bold truncate">{title}</h1>
              </div>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>

            {/* Viewport Toggle */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-muted-foreground mr-1">Aperçu :</span>
              {(Object.keys(viewportConfig) as Viewport[]).map((view) => {
                const ViewIcon = viewportConfig[view].icon;
                const isActive = viewport === view;

                return (
                  <Button
                    key={view}
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewport(view)}
                    className="h-8"
                  >
                    <ViewIcon className="h-3.5 w-3.5 mr-1.5" />
                    <span className="hidden sm:inline">{viewportConfig[view].label}</span>
                    <span className="sm:hidden">{viewportConfig[view].label.slice(0, 3)}</span>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Viewport Container */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-center">
          <div
            className={`${config.maxWidth} w-full transition-all duration-300 ease-in-out`}
            style={{
              boxShadow: viewport !== "desktop" ? "0 0 0 1px hsl(var(--border)), 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" : "none",
              borderRadius: viewport !== "desktop" ? "1rem" : "0",
              overflow: "hidden"
            }}
          >
            {/* Width Indicator */}
            <div className="bg-muted/50 border-b px-4 py-2 text-center">
              <span className="text-xs font-medium text-muted-foreground">
                {config.width} · {config.label}
              </span>
            </div>

            {/* Content */}
            <div className="bg-background">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
