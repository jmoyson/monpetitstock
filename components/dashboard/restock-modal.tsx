"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { restockProduct, type Product } from "@/app/products/actions"
import { toast } from "sonner"

type RestockModalProps = {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function RestockModal({ product, open, onOpenChange, onSuccess }: RestockModalProps) {
  const [quantity, setQuantity] = useState("")
  const [note, setNote] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!product) return

    const qty = parseInt(quantity)
    if (isNaN(qty) || qty <= 0) {
      toast.error("Quantité invalide")
      return
    }

    setIsSubmitting(true)

    const result = await restockProduct(product.id, qty, note || undefined)

    setIsSubmitting(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Stock mis à jour")
      setQuantity("")
      setNote("")
      onOpenChange(false)
      onSuccess()
    }
  }

  const handleClose = () => {
    setQuantity("")
    setNote("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Réapprovisionner {product?.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantité</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Entrez la quantité"
              required
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="note">Note (optionnel)</Label>
            <Input
              id="note"
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Note optionnelle"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "En cours..." : "Réapprovisionner"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
