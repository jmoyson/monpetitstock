// Stock status types and labels
export const STOCK_STATUS = {
  OUT_OF_STOCK: 'out_of_stock',
  LOW_STOCK: 'low_stock',
  IN_STOCK: 'in_stock',
} as const

export const STOCK_STATUS_LABELS = {
  [STOCK_STATUS.OUT_OF_STOCK]: 'Rupture',
  [STOCK_STATUS.LOW_STOCK]: 'Attention',
  [STOCK_STATUS.IN_STOCK]: 'OK',
} as const

// Activity types
export const ACTIVITY_TYPE = {
  IN: 'in',
  OUT: 'out',
  ADJUSTMENT: 'adjustment',
} as const

export const ACTIVITY_TYPE_LABELS = {
  [ACTIVITY_TYPE.IN]: 'Entrée',
  [ACTIVITY_TYPE.OUT]: 'Sortie',
  [ACTIVITY_TYPE.ADJUSTMENT]: 'Ajustement',
} as const

// Helper to get stock status based on current stock and threshold
export function getStockStatus(currentStock: number, alertThreshold: number) {
  if (currentStock === 0) {
    return STOCK_STATUS.OUT_OF_STOCK
  }
  if (currentStock <= alertThreshold) {
    return STOCK_STATUS.LOW_STOCK
  }
  return STOCK_STATUS.IN_STOCK
}
