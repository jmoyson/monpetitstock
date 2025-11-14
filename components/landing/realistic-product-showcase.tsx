'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Package, PackagePlus, PackageMinus, Search, Filter, Plus, Coffee, Scissors, Shirt } from 'lucide-react'
import { cn } from '@/lib/utils'

const showcaseProducts = [
  {
    id: 1,
    name: 'Café en grains',
    icon: Coffee,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100 dark:bg-amber-950',
    current_stock: 12,
    alert_threshold: 5,
    category: 'Alimentation'
  },
  {
    id: 2,
    name: 'Ciseaux professionnels',
    icon: Scissors,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 dark:bg-blue-950',
    current_stock: 3,
    alert_threshold: 5,
    category: 'Outils'
  },
  {
    id: 3,
    name: 'T-shirts blancs (L)',
    icon: Shirt,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100 dark:bg-purple-950',
    current_stock: 0,
    alert_threshold: 10,
    category: 'Textile'
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
                <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">Produit</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">Catégorie</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">Stock</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">Seuil</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">Statut</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {filteredProducts.map((product, index) => {
                const status = getStatus(product)
                const Icon = product.icon
                return (
                  <tr
                    key={product.id}
                    className="group hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className={cn("p-2.5 rounded-lg", product.bgColor)}>
                          <Icon className={cn("h-5 w-5", product.color)} />
                        </div>
                        <span className="font-medium text-zinc-900 dark:text-zinc-100">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="outline" className="text-xs">
                        {product.category}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100">{product.current_stock}</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-zinc-600 dark:text-zinc-400">{product.alert_threshold}</span>
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
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                          onClick={() => handleDecrement(product.id)}
                          disabled={product.current_stock === 0}
                        >
                          <PackageMinus className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                          onClick={() => handleIncrement(product.id)}
                        >
                          <PackagePlus className="h-4 w-4" />
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
                  className="bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-4"
                >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={cn("p-2.5 rounded-lg", product.bgColor)}>
                    <Icon className={cn("h-5 w-5", product.color)} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{product.name}</h3>
                    <Badge variant="outline" className="text-xs mt-1">
                      {product.category}
                    </Badge>
                  </div>
                </div>
                <Badge variant="outline" className={cn("text-xs gap-1.5", status.color)}>
                  <span className={cn("w-1.5 h-1.5 rounded-full", status.dotColor)}></span>
                  {status.label}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                <div>
                  <span className="text-zinc-600 dark:text-zinc-400">Stock actuel</span>
                  <p className="font-semibold text-lg text-zinc-900 dark:text-zinc-100">{product.current_stock}</p>
                </div>
                <div>
                  <span className="text-zinc-600 dark:text-zinc-400">Seuil d'alerte</span>
                  <p className="font-semibold text-lg text-zinc-900 dark:text-zinc-100">{product.alert_threshold}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 gap-2"
                  onClick={() => handleDecrement(product.id)}
                  disabled={product.current_stock === 0}
                >
                  <PackageMinus className="h-4 w-4" />
                  Utiliser
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 gap-2"
                  onClick={() => handleIncrement(product.id)}
                >
                  <PackagePlus className="h-4 w-4" />
                  +5
                </Button>
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
