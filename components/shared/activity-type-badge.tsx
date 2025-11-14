import { Badge } from "@/components/ui/badge"
import { ACTIVITY_TYPE, ACTIVITY_TYPE_LABELS } from "@/lib/constants/stock"
import { ArrowUpCircle, ArrowDownCircle, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

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

  const classNameMap = {
    [ACTIVITY_TYPE.IN]:
      "bg-activity-in text-activity-in-foreground border-activity-in-border",
    [ACTIVITY_TYPE.OUT]:
      "bg-activity-out text-activity-out-foreground border-activity-out-border",
    [ACTIVITY_TYPE.ADJUSTMENT]:
      "bg-primary/10 text-primary border-primary/30",
  }

  const IconComponent = {
    [ACTIVITY_TYPE.IN]: ArrowUpCircle,
    [ACTIVITY_TYPE.OUT]: ArrowDownCircle,
    [ACTIVITY_TYPE.ADJUSTMENT]: RefreshCw,
  }[type]

  return (
    <Badge
      variant={variantMap[type]}
      className={cn("font-medium gap-1", classNameMap[type])}
    >
      <IconComponent className="h-3 w-3" />
      {label}
    </Badge>
  )
}
