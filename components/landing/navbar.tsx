'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Moon, Sun, Package } from 'lucide-react'
import { useTheme } from 'next-themes'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

export function LandingNavbar() {
  const { setTheme } = useTheme()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-7xl mx-auto flex h-16 items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg group">
          <div className="p-2 rounded-lg bg-purple-600 group-hover:bg-purple-700 transition-colors">
            <Package className="h-5 w-5 text-white" />
          </div>
          <span className="text-purple-600 dark:text-purple-400">
            Mon Petit Stock
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-4 text-sm">
          <Link href="#features" className="text-muted-foreground transition-colors hover:text-foreground">
            Fonctionnalités
          </Link>
          <Link href="#pricing" className="text-muted-foreground transition-colors hover:text-foreground">
            Tarifs
          </Link>
          <Link href="#faq" className="text-muted-foreground transition-colors hover:text-foreground">
            FAQ
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme('light')}>
                Clair
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')}>
                Sombre
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')}>
                Système
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button asChild>
            <Link href="/login">Connexion</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
