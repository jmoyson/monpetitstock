"use client"

import { useState, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { History, Sparkles } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import type { StockActivity } from "@/app/history/actions"
import { ActivityTypeBadge } from "@/components/shared/activity-type-badge"
import { formatDate, formatQuantity } from "@/lib/utils/formatters"
import { HistoryFilters } from "./history-filters"
import { UpgradeModal } from "@/components/products/upgrade-modal"

type HistoryTableProps = {
  activities: StockActivity[]
  isFreePlan: boolean
  historyLimitDays: number
}

export function HistoryTable({ activities, isFreePlan, historyLimitDays }: HistoryTableProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [dateFilter, setDateFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [productFilters, setProductFilters] = useState<string[]>([])
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false)

  // Get unique product names for the product filter
  const uniqueProducts = useMemo(() => {
    const products = new Set<string>()
    activities.forEach((activity) => {
      if (activity.products?.name) {
        products.add(activity.products.name)
      }
    })
    return Array.from(products).sort()
  }, [activities])

  // Filter activities based on all filters
  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      // Search filter
      const productName = activity.products?.name || 'Produit supprimé'
      const matchesSearch = productName.toLowerCase().includes(searchQuery.toLowerCase())
      if (!matchesSearch) return false

      // Type filter
      if (typeFilter !== "all" && activity.activity_type !== typeFilter) {
        return false
      }

      // Product filter (multi-select)
      if (productFilters.length > 0 && !productFilters.includes(productName)) {
        return false
      }

      // Date filter
      if (dateFilter !== "all") {
        const activityDate = new Date(activity.created_at)
        const now = new Date()

        switch (dateFilter) {
          case "today":
            const isToday = activityDate.toDateString() === now.toDateString()
            if (!isToday) return false
            break
          case "week":
            const weekAgo = new Date(now)
            weekAgo.setDate(now.getDate() - 7)
            if (activityDate < weekAgo) return false
            break
          case "month":
            const monthAgo = new Date(now)
            monthAgo.setMonth(now.getMonth() - 1)
            if (activityDate < monthAgo) return false
            break
        }
      }

      return true
    })
  }, [activities, searchQuery, dateFilter, typeFilter, productFilters])

  return (
    <>
      {/* Free Plan Limit Alert */}
      {isFreePlan && (
        <Alert className="mb-6">
          <Sparkles className="h-4 w-4" />
          <AlertTitle>Plan gratuit - Historique limité à {historyLimitDays} jours</AlertTitle>
          <AlertDescription className="flex items-center justify-between gap-4">
            <span>
              Vous consultez l'historique des {historyLimitDays} derniers jours uniquement.
              Passez à Premium pour accéder à l'historique complet sans limite.
            </span>
            <Button
              size="sm"
              onClick={() => setUpgradeModalOpen(true)}
              className="flex-shrink-0"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Passer à Premium
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <HistoryFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        dateFilter={dateFilter}
        onDateFilterChange={setDateFilter}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        productFilters={productFilters}
        onProductFiltersChange={setProductFilters}
        uniqueProducts={uniqueProducts}
      />

      {filteredActivities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <History className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">
            {activities.length === 0 ? "Aucune activité" : "Aucun résultat"}
          </h2>
          <p className="text-muted-foreground text-sm">
            {activities.length === 0
              ? "Les mouvements de stock apparaîtront ici"
              : "Essayez de modifier vos filtres"}
          </p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Produit</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Quantité</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredActivities.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell className="text-muted-foreground">
                    {formatDate(activity.created_at)}
                  </TableCell>
                  <TableCell className="font-medium">
                    {activity.products?.name || 'Produit supprimé'}
                  </TableCell>
                  <TableCell>
                    <ActivityTypeBadge type={activity.activity_type} />
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatQuantity(activity.quantity)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <UpgradeModal
        open={upgradeModalOpen}
        onOpenChange={setUpgradeModalOpen}
      />
    </>
  )
}
