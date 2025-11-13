import { Badge } from "@/components/ui/badge"
import { parseCategories } from "@/lib/utils/formatters"

type CategoryBadgesProps = {
  category: string | null
  maxVisible?: number
}

export function CategoryBadges({ category, maxVisible = 2 }: CategoryBadgesProps) {
  const categories = parseCategories(category)

  if (categories.length === 0) {
    return <span className="text-muted-foreground text-sm">-</span>
  }

  const visible = categories.slice(0, maxVisible)
  const remaining = categories.length - maxVisible

  return (
    <div className="flex flex-wrap gap-1">
      {visible.map((cat) => (
        <Badge key={cat} variant="secondary" className="text-xs">
          {cat}
        </Badge>
      ))}
      {remaining > 0 && (
        <Badge variant="secondary" className="text-xs">
          +{remaining}
        </Badge>
      )}
    </div>
  )
}
