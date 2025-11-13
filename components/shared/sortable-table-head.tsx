"use client"

import { ArrowUp, ArrowDown } from "lucide-react"
import { TableHead } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import type { SortDirection } from "@/hooks/use-table-sort"

type SortableTableHeadProps = {
  children: React.ReactNode
  sortKey?: string
  sortDirection?: SortDirection
  sortPriority?: number | null
  onSort?: (multiSort: boolean) => void
  className?: string
  align?: "left" | "center" | "right"
}

export function SortableTableHead({
  children,
  sortDirection,
  sortPriority,
  onSort,
  className,
  align = "left",
}: SortableTableHeadProps) {
  const isSortable = !!onSort

  const handleClick = (e: React.MouseEvent) => {
    if (!onSort) return
    // Allow multi-sort when holding Shift or Cmd/Ctrl
    const multiSort = e.shiftKey || e.metaKey || e.ctrlKey
    onSort(multiSort)
  }

  const alignClass = {
    left: "",
    center: "text-center",
    right: "text-right",
  }[align]

  return (
    <TableHead
      className={cn(
        alignClass,
        isSortable && "cursor-pointer select-none hover:bg-muted/50 transition-colors",
        className
      )}
      onClick={handleClick}
    >
      <div
        className={cn(
          "flex items-center gap-2",
          align === "center" && "justify-center",
          align === "right" && "justify-end"
        )}
      >
        <span>{children}</span>
        {isSortable && (
          <div className="flex items-center gap-0.5">
            {sortDirection === "asc" && <ArrowUp className="h-4 w-4" />}
            {sortDirection === "desc" && <ArrowDown className="h-4 w-4" />}
            {sortPriority !== null && sortPriority !== undefined && sortPriority > 1 && (
              <span className="text-xs font-semibold text-muted-foreground">{sortPriority}</span>
            )}
          </div>
        )}
      </div>
    </TableHead>
  )
}
