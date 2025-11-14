'use client'

import { useState, useRef, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Plus, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CategoryAutocompleteProps {
  selectedCategories: string[]
  onCategoriesChange: (categories: string[]) => void
  availableCategories: string[]
}

export function CategoryAutocomplete({
  selectedCategories,
  onCategoriesChange,
  availableCategories,
}: CategoryAutocompleteProps) {
  const [inputValue, setInputValue] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Filter available categories based on input (case-insensitive)
  const filteredCategories = availableCategories.filter(
    (cat) =>
      cat.toLowerCase().includes(inputValue.toLowerCase()) &&
      !selectedCategories.some((selected) => selected.toLowerCase() === cat.toLowerCase())
  )

  // Check if input matches existing category (case-insensitive)
  const exactMatch = availableCategories.find(
    (cat) => cat.toLowerCase() === inputValue.toLowerCase()
  )

  // Show create option if input doesn't match any existing category
  const showCreateOption = inputValue.trim() !== '' && !exactMatch
  const suggestions = [...filteredCategories]
  if (showCreateOption) {
    suggestions.push(`__CREATE__${inputValue}`)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Reset highlighted index when suggestions change
  useEffect(() => {
    setHighlightedIndex(0)
  }, [inputValue])

  const handleSelect = (category: string) => {
    // Check if category already exists in selected (case-insensitive)
    const alreadySelected = selectedCategories.some(
      (cat) => cat.toLowerCase() === category.toLowerCase()
    )

    if (!alreadySelected) {
      onCategoriesChange([...selectedCategories, category])
    }

    setInputValue('')
    setIsOpen(false)
    inputRef.current?.focus()
  }

  const handleRemove = (categoryToRemove: string) => {
    onCategoriesChange(selectedCategories.filter((cat) => cat !== categoryToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && e.key !== 'Escape' && e.key !== 'Backspace') {
      setIsOpen(true)
    }

    if (e.key === 'Enter' && suggestions.length > 0) {
      e.preventDefault()
      const selected = suggestions[highlightedIndex]
      if (selected.startsWith('__CREATE__')) {
        handleSelect(selected.replace('__CREATE__', ''))
      } else {
        handleSelect(selected)
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightedIndex((prev) => (prev + 1) % suggestions.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightedIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length)
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      setInputValue('')
    } else if (e.key === 'Backspace' && !inputValue && selectedCategories.length > 0) {
      e.preventDefault()
      handleRemove(selectedCategories[selectedCategories.length - 1])
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <div
        className={cn(
          "flex min-h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
          "focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
          "cursor-text"
        )}
        onClick={() => inputRef.current?.focus()}
      >
        <div className="flex flex-wrap gap-1.5 flex-1 items-center">
          {selectedCategories.map((cat) => (
            <Badge
              key={cat}
              variant="secondary"
              className="pl-2 pr-1 py-0.5 text-xs h-6"
            >
              {cat}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemove(cat)
                }}
                className="ml-1 hover:bg-muted rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <input
            ref={inputRef}
            type="text"
            className="flex-1 min-w-[120px] outline-none bg-transparent placeholder:text-muted-foreground"
            placeholder={selectedCategories.length === 0 ? "Ajouter une catégorie..." : ""}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value)
              setIsOpen(true)
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsOpen(true)}
          />
        </div>
      </div>

      {/* Dropdown suggestions */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-md max-h-60 overflow-auto">
          {suggestions.map((suggestion, index) => {
            const isCreate = suggestion.startsWith('__CREATE__')
            const displayValue = isCreate ? suggestion.replace('__CREATE__', '') : suggestion

            return (
              <div
                key={suggestion}
                className={cn(
                  "px-3 py-2 text-sm cursor-pointer transition-colors",
                  index === highlightedIndex ? "bg-accent" : "hover:bg-accent/50",
                  isCreate && "text-primary font-medium"
                )}
                onClick={() => {
                  if (isCreate) {
                    handleSelect(displayValue)
                  } else {
                    handleSelect(suggestion)
                  }
                }}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                {isCreate ? (
                  <div className="flex items-center">
                    <Plus className="h-4 w-4 mr-2" />
                    Créer &quot;{displayValue}&quot;
                  </div>
                ) : (
                  displayValue
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
