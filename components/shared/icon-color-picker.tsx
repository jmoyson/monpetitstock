'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import {
  Package, Box, PackageOpen, PackageCheck, PackagePlus, PackageMinus,
  ShoppingCart, ShoppingBag, Store, Warehouse,
  Wrench, Hammer, Drill,
  Coffee, Wine, Beer, Pizza, Utensils,
  Shirt, Watch, Glasses, Gem, Crown,
  Cpu, HardDrive, Monitor, Smartphone, Headphones,
  Book, Pencil, Scissors, Paperclip, Ruler,
  Home, Building, Factory, Landmark,
  Car, Bike, Truck, Plane,
  Heart, Star, Sparkles, Flame, Zap,
  Circle, Square, Triangle,
  type LucideIcon,
} from 'lucide-react'

// Map of icon names to their components
const ICON_MAP: Record<string, LucideIcon> = {
  Package, Box, PackageOpen, PackageCheck, PackagePlus, PackageMinus,
  ShoppingCart, ShoppingBag, Store, Warehouse,
  Wrench, Hammer, Drill,
  Coffee, Wine, Beer, Pizza, Utensils,
  Shirt, Watch, Glasses, Gem, Crown,
  Cpu, HardDrive, Monitor, Smartphone, Headphones,
  Book, Pencil, Scissors, Paperclip, Ruler,
  Home, Building, Factory, Landmark,
  Car, Bike, Truck, Plane,
  Heart, Star, Sparkles, Flame, Zap,
  Circle, Square, Triangle,
}

// List of available icon names
const AVAILABLE_ICONS = Object.keys(ICON_MAP)

// Predefined color palette
const COLORS = [
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Green', value: '#10b981' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Slate', value: '#64748b' },
]

interface IconColorPickerProps {
  icon: string
  color: string
  onIconChange: (icon: string) => void
  onColorChange: (color: string) => void
}

export function IconColorPicker({ icon, color, onIconChange, onColorChange }: IconColorPickerProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  // Get the icon component
  const IconComponent = ICON_MAP[icon] || Package

  // Filter icons based on search
  const filteredIcons = useMemo(() => {
    return AVAILABLE_ICONS.filter(iconName =>
      iconName.toLowerCase().includes(search.toLowerCase())
    )
  }, [search])

  const handleIconSelect = (selectedIcon: string) => {
    onIconChange(selectedIcon)
  }

  const handleColorSelect = (selectedColor: string) => {
    onColorChange(selectedColor)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 w-9 p-0 shrink-0"
          style={{ borderColor: color }}
        >
          <IconComponent className="h-4 w-4" style={{ color }} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-3 border-b">
          <Input
            placeholder="Rechercher une icône..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8"
          />
        </div>
        <div className="p-3 max-h-64 overflow-y-auto overscroll-contain" style={{ scrollbarGutter: 'auto' }}>
          <div className="grid grid-cols-7 gap-1">
            {filteredIcons.map((iconName) => {
              const Icon = ICON_MAP[iconName]

              return (
                <button
                  key={iconName}
                  type="button"
                  onClick={() => handleIconSelect(iconName)}
                  className={cn(
                    "h-9 w-9 rounded-md flex items-center justify-center hover:bg-accent transition-colors",
                    icon === iconName && "bg-accent ring-2 ring-ring"
                  )}
                  title={iconName}
                >
                  <Icon className="h-4 w-4" style={{ color }} />
                </button>
              )
            })}
          </div>
          {filteredIcons.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Aucune icône trouvée
            </p>
          )}
        </div>
        <div className="p-3 border-t">
          <div className="flex gap-2 justify-center">
            {COLORS.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => handleColorSelect(c.value)}
                className={cn(
                  "h-6 w-6 rounded-full transition-all hover:scale-110",
                  color === c.value && "ring-2 ring-offset-2 ring-ring scale-110"
                )}
                style={{ backgroundColor: c.value }}
                title={c.name}
              />
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
