'use client'

import { useState, useEffect, useMemo } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createProduct, updateProduct, type Product } from '@/app/(dashboard)/stock/actions'
import { IconColorPicker } from '@/components/shared/icon-color-picker'
import { CategoryAutocomplete } from '@/components/shared/category-autocomplete'

type ProductModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  product?: Product
  allProducts?: Product[]
  onUpgradeRequired?: () => void
}

export function ProductModal({ open, onOpenChange, product, allProducts = [], onUpgradeRequired }: ProductModalProps) {
  const [name, setName] = useState('')
  const [currentStock, setCurrentStock] = useState('0')
  const [threshold, setThreshold] = useState('0')
  const [categories, setCategories] = useState<string[]>([])
  const [icon, setIcon] = useState('Package')
  const [iconColor, setIconColor] = useState('#8b5cf6')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Extract unique categories from all products
  const availableCategories = useMemo(() => {
    const allCategories = allProducts
      .filter((p) => p.category)
      .flatMap((p) => p.category!.split(',').filter(Boolean))
      .map((cat) => cat.trim())

    // Remove duplicates (case-insensitive)
    const uniqueCategories = Array.from(
      new Map(allCategories.map((cat) => [cat.toLowerCase(), cat])).values()
    )

    return uniqueCategories.sort()
  }, [allProducts])

  useEffect(() => {
    if (product) {
      setName(product.name)
      setCurrentStock(product.current_stock.toString())
      setThreshold(product.alert_threshold.toString())
      setCategories(product.category ? product.category.split(',').filter(Boolean) : [])
      setIcon(product.icon || 'Package')
      setIconColor(product.icon_color || '#8b5cf6')
    } else {
      setName('')
      setCurrentStock('0')
      setThreshold('0')
      setCategories([])
      setIcon('Package')
      setIconColor('#8b5cf6')
    }
    setError('')
  }, [product, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    const formData = new FormData()
    formData.append('name', name)
    formData.append('current_stock', currentStock)
    formData.append('alert_threshold', threshold)
    formData.append('category', categories.join(','))
    formData.append('icon', icon)
    formData.append('icon_color', iconColor)

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
              <div className="flex gap-2">
                <IconColorPicker
                  icon={icon}
                  color={iconColor}
                  onIconChange={setIcon}
                  onColorChange={setIconColor}
                />
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Café en grains"
                  required
                  className="flex-1"
                />
              </div>
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
              <CategoryAutocomplete
                selectedCategories={categories}
                onCategoriesChange={setCategories}
                availableCategories={availableCategories}
              />
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
