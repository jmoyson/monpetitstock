import { Badge } from "@/components/ui/badge"
import { parseCategories } from "@/lib/utils/formatters"

type CategoryBadgesProps = {
  category: string | null
  maxVisible?: number
}

// Use subtle muted colors for all categories
const getCategoryColor = (): string => {
  return 'bg-muted text-muted-foreground border-border';
};

export function CategoryBadges({ category, maxVisible = 2 }: CategoryBadgesProps) {
  const categories = parseCategories(category)

  if (categories.length === 0) {
    return <span className="text-muted-foreground text-sm">—</span>
  }

  const visible = categories.slice(0, maxVisible)
  const remaining = categories.length - maxVisible

  return (
    <div className="flex flex-wrap gap-1">
      {visible.map((cat) => (
        <Badge
          key={cat}
          variant="outline"
          className={`text-xs font-medium ${getCategoryColor()}`}
        >
          {cat.toLowerCase()}
        </Badge>
      ))}
      {remaining > 0 && (
        <Badge variant="outline" className="text-xs">
          +{remaining}
        </Badge>
      )}
    </div>
  )
}
