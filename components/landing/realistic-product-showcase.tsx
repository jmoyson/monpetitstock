'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Package, PackagePlus, PackageMinus, Search, Filter, Plus, Coffee, Scissors, Shirt } from 'lucide-react'
import { cn } from '@/lib/utils'

const showcaseProducts = [
  {
    id: 3,
    name: 'T-shirts blancs (L)',
    icon: Shirt,
    icon_color: '#9333ea',
    current_stock: 0,
    alert_threshold: 10,
    category: 'Textile'
  },
  {
    id: 2,
    name: 'Ciseaux professionnels',
    icon: Scissors,
    icon_color: '#2563eb',
    current_stock: 3,
    alert_threshold: 5,
    category: 'Outils'
  },
  {
    id: 1,
    name: 'Café en grains',
    icon: Coffee,
    icon_color: '#d97706',
    current_stock: 12,
    alert_threshold: 5,
    category: 'Alimentation'
  },
]

type Product = typeof showcaseProducts[0]

const getStatus = (product: Product) => {
  if (product.current_stock === 0) {
    return {
      label: 'Rupture',
      color: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-900',
      dotColor: 'bg-red-500'
    }
  }
  if (product.current_stock < product.alert_threshold) {
    return {
      label: 'Stock bas',
      color: 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-400 dark:border-yellow-900',
      dotColor: 'bg-yellow-500'
    }
  }
  return {
    label: 'En stock',
    color: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-900',
    dotColor: 'bg-green-500'
  }
}

export function RealisticProductShowcase() {
  const [products, setProducts] = useState(showcaseProducts)
  const [searchTerm, setSearchTerm] = useState('')

  const handleIncrement = (id: number) => {
    setProducts(prev =>
      prev.map(p => p.id === id ? { ...p, current_stock: p.current_stock + 5 } : p)
    )
  }

  const handleDecrement = (id: number) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id === id && p.current_stock > 0) {
          return { ...p, current_stock: Math.max(0, p.current_stock - 1) }
        }
        return p
      })
    )
  }

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Desktop View - Table */}
      <div className="hidden md:block bg-white dark:bg-zinc-900 rounded-2xl border-2 border-zinc-200 dark:border-zinc-800 shadow-2xl shadow-purple-500/10 overflow-hidden">
        {/* Toolbar */}
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30 border-b border-zinc-200 dark:border-zinc-800 p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <Input
                type="text"
                placeholder="Rechercher un produit..."
                className="pl-10 bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-700">
                <th className="text-left py-4 px-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100 h-14">Produit</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100 h-14">Catégorie</th>
                <th className="text-center py-4 px-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100 h-14">Stock</th>
                <th className="text-center py-4 px-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100 h-14">Seuil</th>
                <th className="text-center py-4 px-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100 h-14">Statut</th>
                <th className="text-right py-4 px-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100 h-14">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {filteredProducts.map((product, index) => {
                const status = getStatus(product)
                const Icon = product.icon
                return (
                  <tr
                    key={product.id}
                    className="group hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors h-20"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="p-2 rounded-lg shrink-0"
                          style={{ backgroundColor: `${product.icon_color}20` }}
                        >
                          <Icon
                            className="h-5 w-5"
                            style={{ color: product.icon_color }}
                          />
                        </div>
                        <span className="font-medium text-base text-zinc-900 dark:text-zinc-100">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="outline" className="text-xs">
                        {product.category}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="font-bold tabular-nums text-lg text-zinc-900 dark:text-zinc-100">{product.current_stock}</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="font-medium tabular-nums text-base text-zinc-600 dark:text-zinc-400">{product.alert_threshold}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex justify-center">
                        <Badge variant="outline" className={cn("text-xs gap-1.5", status.color)}>
                          <span className={cn("w-1.5 h-1.5 rounded-full", status.dotColor)}></span>
                          {status.label}
                        </Badge>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-9"
                          onClick={() => handleDecrement(product.id)}
                          disabled={product.current_stock === 0}
                        >
                          <PackageMinus className="h-4 w-4 mr-1.5" />
                          Retirer
                        </Button>
                        <Button
                          size="sm"
                          variant={product.current_stock === 0 ? "destructive" : "default"}
                          className="h-9"
                          onClick={() => handleIncrement(product.id)}
                        >
                          <PackagePlus className="h-4 w-4 mr-1.5" />
                          Ajouter
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-200 dark:border-zinc-800 p-4">
          <p className="text-sm text-zinc-600 dark:text-zinc-400 text-center">
            <span className="font-semibold">{filteredProducts.length}</span> produit{filteredProducts.length > 1 ? 's' : ''} •{' '}
            <span className="text-red-600 dark:text-red-400 font-semibold">
              {filteredProducts.filter(p => p.current_stock === 0).length}
            </span>{' '}
            en rupture •{' '}
            <span className="text-yellow-600 dark:text-yellow-400 font-semibold">
              {filteredProducts.filter(p => p.current_stock > 0 && p.current_stock < p.alert_threshold).length}
            </span>{' '}
            stock bas
          </p>
        </div>
      </div>

      {/* Mobile View - Cards */}
      <div className="md:hidden">
        {/* Demo Badge */}
        <div className="mb-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-medium border border-purple-200 dark:border-purple-800">
            <Package className="h-3.5 w-3.5" />
            <span>Démo interactive</span>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl border-2 border-zinc-200 dark:border-zinc-800 shadow-xl p-4 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input
              type="text"
              placeholder="Rechercher..."
              className="pl-10 bg-zinc-50 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Product Cards */}
          <div className="space-y-3">
            {filteredProducts.map((product) => {
              const status = getStatus(product)
              const Icon = product.icon
              return (
                <div
                  key={product.id}
                  className="rounded-xl border bg-white dark:bg-zinc-900 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="p-3 space-y-2">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5 flex-1 min-w-0">
                        <div
                          className="mt-0.5 p-1.5 rounded-lg shrink-0"
                          style={{ backgroundColor: `${product.icon_color}20` }}
                        >
                          <Icon
                            className="h-4 w-4"
                            style={{ color: product.icon_color }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-base truncate text-zinc-900 dark:text-zinc-100">{product.name}</h3>
                          <Badge variant="outline" className="text-xs mt-1">
                            {product.category}
                          </Badge>
                        </div>
                      </div>
                      <div className="shrink-0">
                        <Badge variant="outline" className={cn("text-xs gap-1.5", status.color)}>
                          <span className={cn("w-1.5 h-1.5 rounded-full", status.dotColor)}></span>
                          {status.label}
                        </Badge>
                      </div>
                    </div>

                    {/* Stock Display */}
                    <div className="text-center py-2 bg-muted/30 rounded-lg">
                      <span className="text-4xl font-bold tracking-tight tabular-nums text-zinc-900 dark:text-zinc-100">
                        {product.current_stock}
                      </span>
                      <p className="text-xs text-muted-foreground mt-1">en stock</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 h-9"
                        onClick={() => handleDecrement(product.id)}
                        disabled={product.current_stock === 0}
                      >
                        <PackageMinus className="h-4 w-4 mr-1.5" />
                        Retirer
                      </Button>
                      <Button
                        size="sm"
                        variant={product.current_stock === 0 ? "destructive" : "default"}
                        className="flex-1 h-9"
                        onClick={() => handleIncrement(product.id)}
                      >
                        <PackagePlus className="h-4 w-4 mr-1.5" />
                        Ajouter
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Try it note */}
      <div className="mt-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm">
          <Package className="h-4 w-4" />
          <span className="font-medium">Essayez d'utiliser ou réapprovisionner un produit ☝️</span>
        </div>
      </div>
    </div>
  )
}
