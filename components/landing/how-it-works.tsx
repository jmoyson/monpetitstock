import { UserPlus, Package, TrendingUp } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: UserPlus,
    title: 'Créez votre compte',
    description: 'Inscrivez-vous en 30 secondes avec votre email. Connexion sécurisée par lien magique, pas de mot de passe.',
    color: 'from-purple-500 to-pink-500'
  },
  {
    number: '02',
    icon: Package,
    title: 'Ajoutez vos produits',
    description: 'Créez vos premiers produits en quelques clics. Nom, stock actuel, seuil d\'alerte, c\'est tout ce dont vous avez besoin.',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    number: '03',
    icon: TrendingUp,
    title: 'Gérez votre stock',
    description: 'Suivez vos mouvements, recevez des alertes automatiques et gardez toujours le contrôle sur votre inventaire.',
    color: 'from-green-500 to-emerald-500'
  },
]

export function HowItWorks() {
  return (
    <section className="py-20 sm:py-28 bg-white dark:bg-zinc-950">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-6">
            <Package className="h-4 w-4" />
            <span>Comment ça marche</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            Lancez-vous en 3 étapes simples
          </h2>
          <p className="text-xl text-zinc-600 dark:text-zinc-400">
            De l'inscription à la gestion complète de votre stock en moins de 5 minutes
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 md:gap-12 relative">
            {/* Connection line - hidden on mobile */}
            <div className="hidden md:block absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-300 via-blue-300 to-green-300 dark:from-purple-800 dark:via-blue-800 dark:to-green-800 -z-10"></div>

            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={index} className="relative">
                  {/* Step Card */}
                  <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-8 border border-zinc-200 dark:border-zinc-800 hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    {/* Number Badge */}
                    <div className="absolute -top-4 -left-4 w-16 h-16 rounded-full bg-white dark:bg-zinc-900 border-4 border-white dark:border-zinc-950 shadow-lg flex items-center justify-center">
                      <span className={`text-2xl font-bold bg-gradient-to-br ${step.color} bg-clip-text text-transparent`}>
                        {step.number}
                      </span>
                    </div>

                    {/* Icon */}
                    <div className="mb-6 mt-4">
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${step.color} text-white shadow-lg`}>
                        <Icon className="h-8 w-8" />
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-semibold mb-3 text-zinc-900 dark:text-zinc-100">
                      {step.title}
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
