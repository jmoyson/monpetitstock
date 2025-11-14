'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'
import { createProduct, updateProduct, type Product } from '@/app/(dashboard)/stock/actions'

type ProductModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  product?: Product
  onUpgradeRequired?: () => void
}

export function ProductModal({ open, onOpenChange, product, onUpgradeRequired }: ProductModalProps) {
  const [name, setName] = useState('')
  const [currentStock, setCurrentStock] = useState('0')
  const [threshold, setThreshold] = useState('0')
  const [categoryInput, setCategoryInput] = useState('')
  const [categories, setCategories] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (product) {
      setName(product.name)
      setCurrentStock(product.current_stock.toString())
      setThreshold(product.alert_threshold.toString())
      setCategories(product.category ? product.category.split(',').filter(Boolean) : [])
    } else {
      setName('')
      setCurrentStock('0')
      setThreshold('0')
      setCategories([])
    }
    setCategoryInput('')
    setError('')
  }, [product, open])

  const handleAddCategory = () => {
    const trimmed = categoryInput.trim()
    if (trimmed && !categories.includes(trimmed)) {
      setCategories([...categories, trimmed])
      setCategoryInput('')
    }
  }

  const handleRemoveCategory = (category: string) => {
    setCategories(categories.filter(c => c !== category))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddCategory()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    const formData = new FormData()
    formData.append('name', name)
    formData.append('current_stock', currentStock)
    formData.append('alert_threshold', threshold)
    formData.append('category', categories.join(','))

    try {
      const result = product
        ? await updateProduct(product.id, formData)
        : await createProduct(formData)

      if (result.error) {
        // Check if user hit the product limit
        if (result.error === 'LIMIT_REACHED') {
          onOpenChange(false)
          onUpgradeRequired?.()
        } else {
          setError((result as any).message || result.error)
        }
      } else {
        onOpenChange(false)
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{product ? 'Modifier le produit' : 'Ajouter un produit'}</DialogTitle>
            <DialogDescription>
              {product ? 'Modifiez les informations du produit' : 'Ajoutez un nouveau produit à votre inventaire'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {error && (
              <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="name">Nom du produit</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Café en grains"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="currentStock">Stock actuel</Label>
              <Input
                id="currentStock"
                type="number"
                value={currentStock}
                onChange={(e) => setCurrentStock(e.target.value)}
                min="0"
                placeholder="0"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="threshold">Seuil d&apos;alerte</Label>
              <Input
                id="threshold"
                type="number"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                min="0"
                placeholder="0"
              />
              <p className="text-xs text-muted-foreground">
                Vous serez alerté quand le stock descend sous ce seuil
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Catégorie</Label>
              <div className="flex gap-2">
                <Input
                  id="category"
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Tapez et appuyez sur Entrée"
                />
                <Button
                  type="button"
                  onClick={handleAddCategory}
                  variant="outline"
                  size="sm"
                >
                  Ajouter
                </Button>
              </div>
              {categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {categories.map((cat) => (
                    <Badge
                      key={cat}
                      variant="secondary"
                      className="pl-2 pr-1 py-1 text-sm"
                    >
                      {cat}
                      <button
                        type="button"
                        onClick={() => handleRemoveCategory(cat)}
                        className="ml-1 hover:bg-muted rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'En cours...' : product ? 'Modifier' : 'Créer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
