'use client'

import { useEffect, useRef, useState } from 'react'
import { Euro, Clock, Zap, Headphones } from 'lucide-react'

function AnimatedNumber({ value, duration = 2000 }: { value: number; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const startTime = Date.now()
    const animate = () => {
      const now = Date.now()
      const progress = Math.min((now - startTime) / duration, 1)
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      setDisplayValue(Math.floor(easeOutQuart * value))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    animate()
  }, [isVisible, value, duration])

  return <div ref={ref}>{displayValue}</div>
}

export function AnimatedStats() {
  return (
    <section className="py-16 sm:py-20 bg-white dark:bg-zinc-950 border-y border-zinc-200 dark:border-zinc-800">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 mb-4">
              <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
              <AnimatedNumber value={30} />sec
            </div>
            <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400">
              Temps de prise en main
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
              <Euro className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
              9,99€
            </div>
            <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400">
              Par an seulement
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
              <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
              <AnimatedNumber value={3} />
            </div>
            <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400">
              Clics pour gérer un produit
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 mb-4">
              <Headphones className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
              &lt;<AnimatedNumber value={24} />h
            </div>
            <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400">
              Support réactif
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
