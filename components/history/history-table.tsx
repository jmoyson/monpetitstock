"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { History } from "lucide-react"
import type { StockActivity } from "@/app/history/actions"
import { ActivityTypeBadge } from "@/components/shared/activity-type-badge"
import { formatDate, formatQuantity } from "@/lib/utils/formatters"

type HistoryTableProps = {
  activities: StockActivity[]
}

export function HistoryTable({ activities }: HistoryTableProps) {

  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <History className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Aucune activité</h2>
        <p className="text-muted-foreground text-sm">
          Les mouvements de stock apparaîtront ici
        </p>
      </div>
    )
  }

  return (
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
          {activities.map((activity) => (
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
  )
}
