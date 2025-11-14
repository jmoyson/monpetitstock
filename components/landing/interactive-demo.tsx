'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { ShoppingCart, PackagePlus, PackageSearch, PackageCheck, PackageX, Search } from 'lucide-react'

const initialProducts = [
  { id: 1, name: 'Café en grains', stock: 12, threshold: 3, icon: '☕️' },
  { id: 2, name: 'Filtres à café', stock: 2, threshold: 5, icon: '📄' },
  { id: 3, name: 'Gobelets', stock: 0, threshold: 2, icon: '🥤' },
]

type Product = typeof initialProducts[0]

const getStatus = (product: Product) => {
  if (product.stock === 0) return { label: 'Rupture', color: 'bg-red-500/20 text-red-500 border-red-500/30', icon: <PackageX className="h-3 w-3" /> }
  if (product.stock < product.threshold) return { label: 'Attention', color: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30', icon: <PackageSearch className="h-3 w-3" /> }
  return { label: 'OK', color: 'bg-green-500/20 text-green-500 border-green-500/30', icon: <PackageCheck className="h-3 w-3" /> }
}

export function InteractiveDemo() {
  const [products, setProducts] = useState(initialProducts)
  const [searchTerm, setSearchTerm] = useState('')
  const [history, setHistory] = useState<string[]>([])

  const handleDecrement = (id: number) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id === id && p.stock > 0) {
          const newStock = p.stock - 1
          addToHistory(`${p.name} utilisé (-1). Stock: ${newStock}`)
          toast.success(`Stock de "${p.name}" mis à jour!`)
          return { ...p, stock: newStock }
        }
        return p
      })
    )
  }

  const handleIncrement = (id: number) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id === id) {
          const newStock = p.stock + 5
          addToHistory(`${p.name} réapprovisionné (+5). Stock: ${newStock}`)
          toast.success(`Stock de "${p.name}" mis à jour!`)
          return { ...p, stock: newStock }
        }
        return p
      })
    )
  }
  
  const addToHistory = (entry: string) => {
    setHistory(prev => [entry, ...prev.slice(0, 2)])
  }

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="w-full max-w-lg mx-auto bg-white/50 dark:bg-black/50 backdrop-blur-xl p-4 sm:p-6 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-2xl shadow-purple-500/10">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Démo Interactive</h3>
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            type="text"
            placeholder="Rechercher ('café')..."
            className="pl-9 w-full sm:w-48"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-3">
        {filteredProducts.map(product => {
          const status = getStatus(product)
          return (
            <div key={product.id} className="flex items-center justify-between bg-zinc-100/50 dark:bg-zinc-900/50 p-3 rounded-lg border border-zinc-200/50 dark:border-zinc-800/50">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{product.icon}</div>
                <div>
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">{product.name}</p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Stock: {product.stock} (Seuil: {product.threshold})
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={`text-xs ${status.color}`}>
                  {status.icon}
                  <span className="ml-1.5">{status.label}</span>
                </Badge>
                <Button size="icon" variant="outline" onClick={() => handleDecrement(product.id)} disabled={product.stock === 0} aria-label="Utiliser">
                  <ShoppingCart className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="outline" onClick={() => handleIncrement(product.id)} aria-label="Réapprovisionner">
                  <PackagePlus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )
        })}
         {filteredProducts.length === 0 && (
            <p className="text-center text-sm text-zinc-500 py-4">Aucun produit trouvé.</p>
        )}
      </div>
      
      {history.length > 0 && (
        <div className="mt-4 pt-4 border-t border-zinc-200/50 dark:border-zinc-800/50">
            <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Historique (local)</h4>
            <div className="space-y-1 text-xs text-zinc-500 dark:text-zinc-400">
                {history.map((entry, i) => <p key={i}>{entry}</p>)}
            </div>
        </div>
      )}
    </div>
  )
}
