"use client";

import { useState, useMemo, useTransition, useRef, useEffect } from "react";
import {
  Plus,
  Minus,
  MoreVertical,
  Pencil,
  Trash2,
  Package,
  Package2,
  RefreshCw,
  Search,
  Box, PackageOpen, PackageCheck, PackagePlus, PackageMinus,
  ShoppingCart, ShoppingBag, Store, Warehouse,
  Wrench, Hammer, Drill,
  Coffee, Wine, Beer, Pizza, Utensils,
  Shirt, Watch, Glasses, Gem, Crown,
  Cpu, HardDrive, Monitor, Smartphone, Headphones,
  Book, Scissors, Paperclip, Ruler,
  Home, Building, Factory, Landmark,
  Car, Bike, Truck, Plane,
  Heart, Star, Sparkles, Flame, Zap,
  Circle, Square, Triangle,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { StockStatusBadge } from "@/components/shared/stock-status-badge";
import { CategoryBadges } from "@/components/shared/category-badges";
import { ProductCardMobile } from "@/components/shared/product-card-mobile";
import { FreePlanAlert } from "@/components/shared/free-plan-alert";
import { ProductModal } from "./product-modal";
import { RestockModal } from "./restock-modal";
import { UpgradeModal } from "@/components/shared/upgrade-modal";
import { StockStatusCards } from "./stock-status-cards";
import { FilterSortSheet } from "./filter-sort-sheet";
import {
  deleteProduct,
  useProduct,
  updateStockQuantity,
  type Product,
} from "@/app/(dashboard)/stock/actions";
import { getStockStatus, STOCK_STATUS } from "@/lib/constants/stock";
import { parseCategories } from "@/lib/utils/formatters";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type StockManagementClientProps = {
  initialProducts: Product[];
  isPro?: boolean;
};

type ProductWithSortFields = Product & {
  category_sort: string;
  status_sort: number;
};

const FREE_PLAN_LIMIT = 10;

export function StockManagementClient({
  initialProducts,
  isPro = false,
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

  // Sort state - single combined value
  const [sortMode, setSortMode] = useState("status");

  // Pull-to-refresh states
  const [isPullingToRefresh, setIsPullingToRefresh] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);

  // Pull-to-refresh refs
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const isPulling = useRef(false);

  const isAtLimit = !isPro && initialProducts.length >= FREE_PLAN_LIMIT;

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

      return true;
    });
  }, [productsWithSortFields, searchQuery, statusFilter]);

  // Calculate status counts for all products (not filtered)
  const statusCounts = useMemo(() => {
    return productsWithSortFields.reduce(
      (acc, product) => {
        const status = getStockStatus(
          product.current_stock,
          product.alert_threshold
        );
        if (status === STOCK_STATUS.OUT_OF_STOCK) acc.outOfStock++;
        else if (status === STOCK_STATUS.LOW_STOCK) acc.lowStock++;
        else acc.inStock++;
        return acc;
      },
      { outOfStock: 0, lowStock: 0, inStock: 0 }
    );
  }, [productsWithSortFields]);

  // Apply sorting
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];

    sorted.sort((a, b) => {
      switch (sortMode) {
        case "status":
          return a.status_sort - b.status_sort;
        case "stock-asc":
          return a.current_stock - b.current_stock;
        case "stock-desc":
          return b.current_stock - a.current_stock;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return a.status_sort - b.status_sort;
      }
    });

    return sorted;
  }, [filteredProducts, sortMode]);

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

  // Quick stock update handler
  const handleQuickUpdate = async (productId: string, newStock: number) => {
    setProcessingId(productId);
    const result = await updateStockQuantity(productId, newStock);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Stock mis à jour");
      startTransition(() => router.refresh());
    }

    setProcessingId(null);
  };

  // Pull-to-refresh handlers
  const handleTouchStart = (e: TouchEvent) => {
    if (window.scrollY === 0) {
      touchStartY.current = e.touches[0].clientY;
      isPulling.current = false;
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (window.scrollY === 0 && touchStartY.current > 0) {
      const touchY = e.touches[0].clientY;
      const delta = touchY - touchStartY.current;

      if (delta > 0 && delta <= 100) {
        isPulling.current = true;
        setPullDistance(delta);
        e.preventDefault();
      }
    }
  };

  const handleTouchEnd = async () => {
    if (isPulling.current && pullDistance > 60) {
      setIsPullingToRefresh(true);
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate refresh
      router.refresh();
      setIsPullingToRefresh(false);
    }

    touchStartY.current = 0;
    setPullDistance(0);
    isPulling.current = false;
  };

  // Setup pull-to-refresh
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    container.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    container.addEventListener("touchend", handleTouchEnd);

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [pullDistance]);

  return (
    <main
      ref={containerRef}
      className="container mx-auto px-2 py-6 md:py-8 relative"
    >
      {/* Pull-to-Refresh Indicator */}
      {pullDistance > 0 && (
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 flex items-center justify-center transition-opacity"
          style={{
            opacity: Math.min(pullDistance / 60, 1),
            transform: `translateX(-50%) translateY(${Math.min(
              pullDistance - 20,
              40
            )}px)`,
          }}
        >
          <RefreshCw
            className={cn(
              "h-6 w-6 text-primary",
              isPullingToRefresh && "animate-spin"
            )}
          />
        </div>
      )}

      {/* Free Plan Alert */}
      {isAtLimit && (
        <FreePlanAlert
          title="Plan gratuit"
          description="Passez à Premium pour un nombre illimité de produits"
          limitDisplay={`${FREE_PLAN_LIMIT}/${FREE_PLAN_LIMIT} produits`}
          isPro={isPro}
        />
      )}

      {/* Search Bar and Filters */}
      <div className="mb-4 space-y-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10"
            />
          </div>
          <FilterSortSheet value={sortMode} onValueChange={setSortMode} />
          <Button onClick={handleCreate} className="h-10 px-3">
            <Plus className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Nouveau</span>
          </Button>
        </div>

        {/* Smart Status Filter Cards */}
        <StockStatusCards
          counts={statusCounts}
          activeFilter={statusFilter}
          onFilterChange={setStatusFilter}
        />
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
                onQuickUpdate={handleQuickUpdate}
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
                  <TableHead className="h-14">Produit</TableHead>
                  <TableHead className="h-14">Catégorie</TableHead>
                  <TableHead className="text-center h-14">Stock</TableHead>
                  <TableHead className="text-center h-14">Seuil</TableHead>
                  <TableHead className="text-center h-14">Statut</TableHead>
                  <TableHead className="text-right h-14">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedProducts.map((product) => {
                  const isProcessing = processingId === product.id;
                  const isDeleting = deletingId === product.id;

                  // Map of icon names to components
                  const ICON_MAP: Record<string, LucideIcon> = {
                    Package, Box, PackageOpen, PackageCheck, PackagePlus, PackageMinus,
                    ShoppingCart, ShoppingBag, Store, Warehouse,
                    Wrench, Hammer, Drill,
                    Coffee, Wine, Beer, Pizza, Utensils,
                    Shirt, Watch, Glasses, Gem, Crown,
                    Cpu, HardDrive, Monitor, Smartphone, Headphones,
                    Book, Pencil, Scissors, Paperclip, Ruler,
                    Home, Building, Factory, Landmark,
                    Car, Bike, Truck, Plane,
                    Heart, Star, Sparkles, Flame, Zap,
                    Circle, Square, Triangle,
                  };

                  const IconComponent = ICON_MAP[product.icon] || Package;

                  return (
                    <TableRow key={product.id} className="group h-20">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div
                            className="p-2 rounded-lg shrink-0"
                            style={{ backgroundColor: `${product.icon_color}20` }}
                          >
                            <IconComponent
                              className="h-5 w-5"
                              style={{ color: product.icon_color }}
                            />
                          </div>
                          <span className="text-base">{product.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <CategoryBadges
                          category={product.category}
                          maxVisible={3}
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="font-bold tabular-nums text-lg">
                          {product.current_stock}
                        </span>
                      </TableCell>
                      <TableCell className="text-center font-medium tabular-nums text-muted-foreground text-base">
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
                            className="h-9"
                          >
                            <PackageMinus className="h-4 w-4 mr-1.5" />
                            Retirer
                          </Button>
                          <Button
                            variant={
                              product.current_stock === 0
                                ? "destructive"
                                : "default"
                            }
                            size="sm"
                            onClick={() => handleRestock(product)}
                            disabled={isProcessing}
                            className="h-9"
                          >
                            <PackagePlus className="h-4 w-4 mr-1.5" />
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
        allProducts={initialProducts}
        onUpgradeRequired={() => setUpgradeModalOpen(true)}
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
