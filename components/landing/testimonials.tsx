import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Sophie M.',
    role: 'Gérante de salon',
    image: '👩‍💼',
    content: 'Exactement ce que je cherchais : simple, efficace, pas cher. Je peux enfin gérer mon stock de produits sans y passer des heures chaque semaine.',
    rating: 5
  },
  {
    name: 'Thomas D.',
    role: 'Artisan',
    image: '👨‍🔧',
    content: 'Interface ultra-simple, exactement ce dont j\'avais besoin. Pas de fonctionnalités inutiles, juste l\'essentiel. Et le prix est imbattable.',
    rating: 5
  },
  {
    name: 'Marie L.',
    role: 'Association',
    image: '👩‍💻',
    content: 'Le plan gratuit est parfait pour notre association. On peut enfin suivre notre matériel facilement. Simple et efficace !',
    rating: 5
  },
]

export function Testimonials() {
  return (
    <section className="py-20 sm:py-28 bg-zinc-50 dark:bg-zinc-900/50">
      <div className="container max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium mb-6">
            <Star className="h-4 w-4 fill-current" />
            <span>Témoignages</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            Ce que disent nos utilisateurs
          </h2>
          <p className="text-xl text-zinc-600 dark:text-zinc-400">
            Des retours authentiques de nos utilisateurs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white dark:bg-zinc-900 rounded-2xl p-8 border border-zinc-200 dark:border-zinc-800 hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-200 hover:shadow-lg group"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-5">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-purple-600 dark:text-purple-400 fill-current" />
                ))}
              </div>

              {/* Content */}
              <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed mb-6 text-base">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/40 flex items-center justify-center text-2xl ring-2 ring-purple-100 dark:ring-purple-900/50">
                  {testimonial.image}
                </div>
                <div>
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
