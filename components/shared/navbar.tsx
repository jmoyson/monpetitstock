"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, Box, History, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/stock", label: "Stock", icon: Box },
    { href: "/history", label: "Historique", icon: History },
    { href: "/settings", label: "Paramètres", icon: Settings },
  ];

  return (
    <nav className="border-b bg-card/50 backdrop-blur supports-backdrop-filter:bg-card/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/stock"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity group"
          >
            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <span className="text-lg font-semibold hidden sm:inline">
              Mon Stock
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center gap-0.5">
            {navLinks.slice(0, 3).map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-all",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-[10px] font-medium">{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
