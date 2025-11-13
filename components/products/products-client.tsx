"use client";

import { useState } from "react";
import {
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
  Package,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { StockStatusBadge } from "@/components/shared/stock-status-badge";
import { CategoryBadges } from "@/components/shared/category-badges";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProductModal } from "./product-modal";
import { UpgradeModal } from "./upgrade-modal";
import { deleteProduct, type Product } from "@/app/products/actions";
import { useRouter } from "next/navigation";

type ProductsClientProps = {
  initialProducts: Product[];
};

const FREE_PLAN_LIMIT = 10;

export function ProductsClient({ initialProducts }: ProductsClientProps) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const isAtLimit = initialProducts.length >= FREE_PLAN_LIMIT;

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleCreate = () => {
    if (isAtLimit) {
      setUpgradeModalOpen(true);
      return;
    }
    setSelectedProduct(undefined);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      return;
    }

    setDeletingId(id);
    await deleteProduct(id);
    setDeletingId(null);
    router.refresh();
  };

  const handleModalClose = (open: boolean) => {
    setModalOpen(open);
    if (!open) {
      setSelectedProduct(undefined);
      router.refresh();
    }
  };

  return (
    <div className="bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-end gap-4">
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Ajouter un produit</span>
              <span className="sm:hidden">Ajouter</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Limit Warning */}
        {isAtLimit && (
          <Alert className="mb-6">
            <Sparkles className="h-4 w-4" />
            <AlertTitle>Limite du plan gratuit atteinte</AlertTitle>
            <AlertDescription>
              Vous avez atteint la limite de {FREE_PLAN_LIMIT} produits. Passez
              à Premium pour ajouter des produits illimités.
            </AlertDescription>
          </Alert>
        )}

        {initialProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Aucun produit</h2>
            <p className="text-muted-foreground mb-4">
              Aucun produit. Commencez par en ajouter un!
            </p>
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un produit
            </Button>
          </div>
        ) : (
          <div className="bg-card rounded-lg border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[150px]">Nom</TableHead>
                  <TableHead className="min-w-[120px]">Catégories</TableHead>
                  <TableHead className="text-right min-w-[100px]">
                    Stock actuel
                  </TableHead>
                  <TableHead className="text-right min-w-[100px]">
                    Seuil d&apos;alerte
                  </TableHead>
                  <TableHead className="min-w-[100px]">Statut</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {initialProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">
                      {product.name}
                    </TableCell>
                    <TableCell>
                      <CategoryBadges category={product.category} maxVisible={3} />
                    </TableCell>
                    <TableCell className="text-right">
                      {product.current_stock}
                    </TableCell>
                    <TableCell className="text-right">
                      {product.alert_threshold}
                    </TableCell>
                    <TableCell>
                      <StockStatusBadge
                        currentStock={product.current_stock}
                        alertThreshold={product.alert_threshold}
                      />
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={deletingId === product.id}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleEdit(product)}
                          >
                            <Pencil className="h-4 w-4 mr-2" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(product.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </main>

      <ProductModal
        open={modalOpen}
        onOpenChange={handleModalClose}
        product={selectedProduct}
      />

      <UpgradeModal
        open={upgradeModalOpen}
        onOpenChange={setUpgradeModalOpen}
      />
    </div>
  );
}
