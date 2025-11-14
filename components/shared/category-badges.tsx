import { Badge } from "@/components/ui/badge"
import { parseCategories } from "@/lib/utils/formatters"

type CategoryBadgesProps = {
  category: string | null
  maxVisible?: number
}

// Map de couleurs pour les catégories courantes
const getCategoryColor = (category: string): string => {
  const cat = category.toLowerCase();

  if (cat.includes('cil') || cat.includes('lash')) {
    return 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border-purple-200 dark:border-purple-800';
  }
  if (cat.includes('consommable') || cat.includes('consumable')) {
    return 'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300 border-violet-200 dark:border-violet-800';
  }
  if (cat.includes('matériel') || cat.includes('tool') || cat.includes('outil')) {
    return 'bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300 border-pink-200 dark:border-pink-800';
  }
  if (cat.includes('adhé') || cat.includes('glue') || cat.includes('colle')) {
    return 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800';
  }

  // Couleur par défaut
  return 'bg-secondary text-secondary-foreground';
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
          className={`text-xs font-medium ${getCategoryColor(cat)}`}
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
