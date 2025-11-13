/**
 * Format a date string to French locale
 * @param dateString - ISO date string
 * @returns Formatted date string (DD/MM/YYYY HH:MM)
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

/**
 * Format a quantity with +/- sign
 * @param quantity - The quantity number
 * @returns Formatted quantity string
 */
export function formatQuantity(quantity: number): string {
  return quantity > 0 ? `+${quantity}` : `${quantity}`
}

/**
 * Parse category string into array
 * @param categoryString - Comma-separated category string
 * @returns Array of category names
 */
export function parseCategories(categoryString: string | null): string[] {
  if (!categoryString) return []
  return categoryString.split(',').filter(Boolean).map(cat => cat.trim())
}
