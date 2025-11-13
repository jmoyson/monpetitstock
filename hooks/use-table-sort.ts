import { useState, useMemo } from "react"

export type SortDirection = "asc" | "desc" | null

export type SortConfig<T> = {
  key: keyof T
  direction: "asc" | "desc"
}

type UseSortableTableProps<T> = {
  items: T[]
  defaultSort?: SortConfig<T>[]
}

export function useSortableTable<T>({ items, defaultSort = [] }: UseSortableTableProps<T>) {
  const [sortConfigs, setSortConfigs] = useState<SortConfig<T>[]>(defaultSort)

  const sortedItems = useMemo(() => {
    if (sortConfigs.length === 0) return items

    const sorted = [...items]

    sorted.sort((a, b) => {
      // Apply each sort config in order (multi-sort)
      for (const config of sortConfigs) {
        const aValue = a[config.key]
        const bValue = b[config.key]

        // Handle null/undefined
        if (aValue == null && bValue == null) continue
        if (aValue == null) return 1
        if (bValue == null) return -1

        let comparison = 0

        if (typeof aValue === "string" && typeof bValue === "string") {
          comparison = aValue.localeCompare(bValue)
        } else if (typeof aValue === "number" && typeof bValue === "number") {
          comparison = aValue - bValue
        } else {
          // Generic comparison
          comparison = String(aValue).localeCompare(String(bValue))
        }

        if (comparison !== 0) {
          return config.direction === "asc" ? comparison : -comparison
        }
      }

      return 0
    })

    return sorted
  }, [items, sortConfigs])

  const requestSort = (key: keyof T, multiSort: boolean = false) => {
    setSortConfigs((prevConfigs) => {
      // Find if this column is already being sorted
      const existingIndex = prevConfigs.findIndex((config) => config.key === key)

      if (existingIndex !== -1) {
        // Column is already sorted - cycle through: asc -> desc -> remove
        const existingConfig = prevConfigs[existingIndex]
        const newConfigs = [...prevConfigs]

        if (existingConfig.direction === "asc") {
          // Change to desc
          newConfigs[existingIndex] = { key, direction: "desc" }
          return newConfigs
        } else {
          // Remove this sort
          newConfigs.splice(existingIndex, 1)
          return multiSort ? newConfigs : []
        }
      } else {
        // New column - add as asc
        const newConfig: SortConfig<T> = { key, direction: "asc" }
        return multiSort ? [...prevConfigs, newConfig] : [newConfig]
      }
    })
  }

  const getSortDirection = (key: keyof T): SortDirection => {
    const config = sortConfigs.find((config) => config.key === key)
    return config?.direction || null
  }

  const getSortPriority = (key: keyof T): number | null => {
    const index = sortConfigs.findIndex((config) => config.key === key)
    return index !== -1 ? index + 1 : null
  }

  return {
    items: sortedItems,
    requestSort,
    getSortDirection,
    getSortPriority,
    sortConfigs,
  }
}
