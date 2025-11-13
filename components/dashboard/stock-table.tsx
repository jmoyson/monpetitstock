"use client"

import { useState, useTransition } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Package, Plus, Minus } from "lucide-react"
import { RestockModal } from "./restock-modal"
import { useProduct, type Product } from "@/app/products/actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { StockStatusBadge } from "@/components/shared/stock-status-badge"
import { CategoryBadges } from "@/components/shared/category-badges"

type StockTableProps = {
  products: Product[]
}

export function StockTable({ products }: StockTableProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [restockProduct, setRestockProduct] = useState<Product | null>(null)
  const [processingId, setProcessingId] = useState<string | null>(null)

  const handleUseProduct = async (product: Product) => {
    if (product.current_stock <= 0) {
      toast.error("Stock déjà à 0")
      return
    }

    setProcessingId(product.id)

    const result = await useProduct(product.id)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Stock mis à jour")
      startTransition(() => {
        router.refresh()
      })
    }

    setProcessingId(null)
  }

  const handleRestockSuccess = () => {
    startTransition(() => {
      router.refresh()
    })
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Package className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Aucun produit</h2>
        <p className="text-muted-foreground text-sm">
          Ajoutez des produits pour commencer à gérer votre stock
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produit</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead className="text-center">Stock</TableHead>
              <TableHead className="text-center">Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => {
              const isProcessing = processingId === product.id

              return (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    <CategoryBadges category={product.category} />
                  </TableCell>
                  <TableCell className="text-center font-semibold">
                    {product.current_stock}
                  </TableCell>
                  <TableCell className="text-center">
                    <StockStatusBadge
                      currentStock={product.current_stock}
                      alertThreshold={product.alert_threshold}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUseProduct(product)}
                        disabled={isProcessing || product.current_stock <= 0}
                      >
                        <Minus className="h-4 w-4 mr-1" />
                        Utiliser
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => setRestockProduct(product)}
                        disabled={isProcessing}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Ajouter
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <RestockModal
        product={restockProduct}
        open={restockProduct !== null}
        onOpenChange={(open) => !open && setRestockProduct(null)}
        onSuccess={handleRestockSuccess}
      />
    </>
  )
}
