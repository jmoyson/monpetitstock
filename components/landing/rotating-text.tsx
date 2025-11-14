'use client'

import { useState, useEffect } from 'react'

const userTypes = [
  'Indépendants',
  'Artisans',
  'Auto-entrepreneurs',
  'Salons',
  'Associations',
  'Commerçants',
]

export function RotatingText() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % userTypes.length)
        setIsAnimating(false)
      }, 300) // Half of the transition duration
    }, 3000) // Change every 3 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <span className="inline-block relative h-7 w-[220px] align-middle">
      <span
        className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
          isAnimating
            ? 'opacity-0 translate-y-4'
            : 'opacity-100 translate-y-0'
        }`}
      >
        <span className="text-purple-600 dark:text-purple-400 font-semibold whitespace-nowrap">
          {userTypes[currentIndex]}
        </span>
      </span>
    </span>
  )
}
