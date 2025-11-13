import { Badge } from "@/components/ui/badge"
import { ACTIVITY_TYPE, ACTIVITY_TYPE_LABELS } from "@/lib/constants/stock"

type ActivityTypeBadgeProps = {
  type: 'in' | 'out' | 'adjustment'
}

export function ActivityTypeBadge({ type }: ActivityTypeBadgeProps) {
  const label = ACTIVITY_TYPE_LABELS[type] || type

  // Consistent styling for activity types
  const variantMap = {
    [ACTIVITY_TYPE.IN]: 'default' as const,
    [ACTIVITY_TYPE.OUT]: 'secondary' as const,
    [ACTIVITY_TYPE.ADJUSTMENT]: 'outline' as const,
  }

  return (
    <Badge variant={variantMap[type]}>
      {label}
    </Badge>
  )
}
