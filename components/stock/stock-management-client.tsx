"use client";

import { useState, useMemo, useTransition } from "react";
import {
  Plus,
  Minus,
  MoreVertical,
  Pencil,
  Trash2,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StockStatusBadge } from "@/components/shared/stock-status-badge";
import { CategoryBadges } from "@/components/shared/category-badges";
import { ProductFilters } from "@/components/shared/product-filters";
import { SortableTableHead } from "@/components/shared/sortable-table-head";
import { ProductCardMobile } from "@/components/shared/product-card-mobile";
import { FreePlanAlert } from "@/components/shared/free-plan-alert";
import { ProductModal } from "./product-modal";
import { RestockModal } from "./restock-modal";
import { UpgradeModal } from "@/components/shared/upgrade-modal";
import {
  deleteProduct,
  useProduct,
  type Product,
} from "@/app/(dashboard)/stock/actions";
import { getStockStatus, STOCK_STATUS } from "@/lib/constants/stock";
import { parseCategories } from "@/lib/utils/formatters";
import { useSortableTable } from "@/hooks/use-table-sort";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type StockManagementClientProps = {
  initialProducts: Product[];
};

type ProductWithSortFields = Product & {
  category_sort: string;
  status_sort: number;
};

const FREE_PLAN_LIMIT = 10;

export function StockManagementClient({
  initialProducts,
}: StockManagementClientProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  // Modal states
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [restockModalOpen, setRestockModalOpen] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [restockProduct, setRestockProduct] = useState<Product | null>(null);

  // Action states
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilters, setCategoryFilters] = useState<string[]>([]);

  const isAtLimit = initialProducts.length >= FREE_PLAN_LIMIT;

  // Add sortable fields to products
  const productsWithSortFields = useMemo<ProductWithSortFields[]>(() => {
    return initialProducts.map((product) => {
      const categories = parseCategories(product.category);
      const category_sort = categories.length > 0 ? categories.sort()[0] : "";

      const status = getStockStatus(
        product.current_stock,
        product.alert_threshold
      );
      const status_sort =
        status === STOCK_STATUS.OUT_OF_STOCK
          ? 0
          : status === STOCK_STATUS.LOW_STOCK
          ? 1
          : 2;

      return { ...product, category_sort, status_sort };
    });
  }, [initialProducts]);

  // Get unique categories for filter
  const uniqueCategories = useMemo(() => {
    const categories = new Set<string>();
    productsWithSortFields.forEach((product) => {
      const productCategories = parseCategories(product.category);
      productCategories.forEach((cat) => categories.add(cat));
    });
    return Array.from(categories).sort();
  }, [productsWithSortFields]);

  // Apply filters
  const filteredProducts = useMemo(() => {
    return productsWithSortFields.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      if (statusFilter !== "all") {
        const productStatus = getStockStatus(
          product.current_stock,
          product.alert_threshold
        );
        if (productStatus !== statusFilter) return false;
      }

      if (categoryFilters.length > 0) {
        const productCategories = parseCategories(product.category);
        const hasMatchingCategory = categoryFilters.some((filter) =>
          productCategories.includes(filter)
        );
        if (!hasMatchingCategory) return false;
      }

      return true;
    });
  }, [productsWithSortFields, searchQuery, statusFilter, categoryFilters]);

  // Apply sorting - default by status
  const {
    items: sortedProducts,
    requestSort,
    getSortDirection,
    getSortPriority,
  } = useSortableTable<ProductWithSortFields>({
    items: filteredProducts,
    defaultSort: [{ key: "status_sort", direction: "asc" }],
  });

  // Handlers
  const handleCreate = () => {
    if (isAtLimit) {
      setUpgradeModalOpen(true);
      return;
    }
    setSelectedProduct(undefined);
    setProductModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setProductModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) return;

    setDeletingId(id);
    await deleteProduct(id);
    setDeletingId(null);
    router.refresh();
  };

  const handleUseProduct = async (product: Product) => {
    if (product.current_stock <= 0) {
      toast.error("Stock déjà à 0");
      return;
    }

    setProcessingId(product.id);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const result = await useProduct(product.id);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Stock mis à jour");
      startTransition(() => router.refresh());
    }

    setProcessingId(null);
  };

  const handleRestock = (product: Product) => {
    setRestockProduct(product);
    setRestockModalOpen(true);
  };

  const handleRestockSuccess = () => {
    startTransition(() => router.refresh());
    setRestockModalOpen(false);
    setRestockProduct(null);
  };

  const handleProductModalClose = (open: boolean) => {
    setProductModalOpen(open);
    if (!open) {
      setSelectedProduct(undefined);
      router.refresh();
    }
  };

  return (
    <main className="container mx-auto px-4 py-6 md:py-8">
      {/* Free Plan Alert */}
      {isAtLimit && (
        <FreePlanAlert
          title="Plan gratuit"
          description="Passez à Premium pour un nombre illimité de produits"
          limitDisplay={`${FREE_PLAN_LIMIT}/${FREE_PLAN_LIMIT} produits`}
        />
      )}

      {/* Integrated Toolbar */}
      <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex-1 max-w-2xl">
          <ProductFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            categoryFilters={categoryFilters}
            onCategoryFiltersChange={setCategoryFilters}
            uniqueCategories={uniqueCategories}
          />
        </div>
        <Button onClick={handleCreate} className="md:mt-0">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau produit
        </Button>
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 rounded-full bg-muted/30 p-6">
            <Package className="h-12 w-12 text-muted-foreground/60" />
          </div>
          <h2 className="text-xl font-semibold mb-2">
            {initialProducts.length === 0 ? "Aucun produit" : "Aucun résultat"}
          </h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm">
            {initialProducts.length === 0
              ? "Commencez par créer votre premier produit pour gérer votre stock"
              : "Aucun produit ne correspond à vos filtres"}
          </p>
          {initialProducts.length === 0 && (
            <Button onClick={handleCreate} size="lg">
              <Plus className="h-4 w-4 mr-2" />
              Créer un produit
            </Button>
          )}
        </div>
      ) : (
        <>
          {/* Mobile: Cards */}
          <div className="md:hidden space-y-3">
            {sortedProducts.map((product) => (
              <ProductCardMobile
                key={product.id}
                product={product}
                onUse={handleUseProduct}
                onRestock={handleRestock}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isProcessing={processingId === product.id}
                isDeleting={deletingId === product.id}
              />
            ))}
          </div>

          {/* Desktop: Table */}
          <div className="hidden md:block rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <SortableTableHead
                    sortDirection={getSortDirection("name")}
                    sortPriority={getSortPriority("name")}
                    onSort={(multiSort) => requestSort("name", multiSort)}
                  >
                    Produit
                  </SortableTableHead>
                  <SortableTableHead
                    sortDirection={getSortDirection("category_sort")}
                    sortPriority={getSortPriority("category_sort")}
                    onSort={(multiSort) =>
                      requestSort("category_sort", multiSort)
                    }
                  >
                    Catégories
                  </SortableTableHead>
                  <SortableTableHead
                    align="center"
                    sortDirection={getSortDirection("current_stock")}
                    sortPriority={getSortPriority("current_stock")}
                    onSort={(multiSort) =>
                      requestSort("current_stock", multiSort)
                    }
                  >
                    Stock
                  </SortableTableHead>
                  <SortableTableHead
                    align="center"
                    sortDirection={getSortDirection("alert_threshold")}
                    sortPriority={getSortPriority("alert_threshold")}
                    onSort={(multiSort) =>
                      requestSort("alert_threshold", multiSort)
                    }
                  >
                    Seuil
                  </SortableTableHead>
                  <SortableTableHead
                    align="center"
                    sortDirection={getSortDirection("status_sort")}
                    sortPriority={getSortPriority("status_sort")}
                    onSort={(multiSort) =>
                      requestSort("status_sort", multiSort)
                    }
                  >
                    Statut
                  </SortableTableHead>
                  <SortableTableHead align="right">Actions</SortableTableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedProducts.map((product) => {
                  const isProcessing = processingId === product.id;
                  const isDeleting = deletingId === product.id;

                  return (
                    <TableRow key={product.id} className="group">
                      <TableCell className="font-medium">
                        {product.name}
                      </TableCell>
                      <TableCell>
                        <CategoryBadges
                          category={product.category}
                          maxVisible={3}
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="font-bold tabular-nums">
                          {product.current_stock}
                        </span>
                      </TableCell>
                      <TableCell className="text-center font-medium tabular-nums text-muted-foreground">
                        {product.alert_threshold}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          <StockStatusBadge
                            currentStock={product.current_stock}
                            alertThreshold={product.alert_threshold}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUseProduct(product)}
                            disabled={
                              isProcessing || product.current_stock <= 0
                            }
                          >
                            <Minus className="h-4 w-4 mr-1" />
                            Utiliser
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleRestock(product)}
                            disabled={isProcessing}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Ajouter
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-9 w-9 p-0"
                                disabled={isDeleting}
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
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      {/* Modals */}
      <ProductModal
        open={productModalOpen}
        onOpenChange={handleProductModalClose}
        product={selectedProduct}
      />

      <RestockModal
        product={restockProduct}
        open={restockModalOpen}
        onOpenChange={setRestockModalOpen}
        onSuccess={handleRestockSuccess}
      />

      <UpgradeModal
        open={upgradeModalOpen}
        onOpenChange={setUpgradeModalOpen}
      />
    </main>
  );
}
