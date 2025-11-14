import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { RealisticProductShowcase } from '@/components/landing/realistic-product-showcase'
import { LandingNavbar } from '@/components/landing/navbar'
import { Testimonials } from '@/components/landing/testimonials'
import { FAQSection } from '@/components/landing/faq-section'
import { CheckCircle, Zap, Search, AlertTriangle, History, Smartphone, Lock, Star, ArrowRight, Sparkles, TrendingUp, Clock, Shield } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function LandingPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect('/stock')
  }

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950">
      <LandingNavbar />
      <main className="flex-grow">
        {/* Hero Section - Enhanced with gradient and better visuals */}
        <section className="relative overflow-hidden pt-20 pb-32 sm:pt-28 sm:pb-40">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-purple-50/50 via-white to-white dark:from-purple-950/10 dark:via-zinc-950 dark:to-zinc-950"></div>

          {/* Animated Grid Pattern */}
          <div className="absolute inset-0 bg-grid-zinc-900/[0.04] dark:bg-grid-zinc-100/[0.02] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>

          {/* Subtle Gradient Orb - Purple only */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-200 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-blob"></div>

          <div className="container max-w-7xl mx-auto relative z-10">
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 text-sm font-medium mb-6 border border-purple-100 dark:border-purple-900">
                <Sparkles className="h-4 w-4" />
                <span>Gratuit · Sans engagement · Sans CB</span>
              </div>

              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-6">
                Gérez votre stock en{' '}
                <span className="text-purple-600 dark:text-purple-400">
                  2 clics
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 max-w-3xl mb-4">
                La solution la plus simple pour suivre votre inventaire.
                Pas de complexité, pas de formations, juste l'essentiel.
              </p>

              <p className="text-base text-zinc-500 dark:text-zinc-500 mb-10">
                Conçu pour les indépendants, artisans et associations qui veulent gagner du temps
              </p>

              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/30 text-lg px-10 h-14" id="cta-hero-start">
                  <Link href="/login">
                    Commencer gratuitement
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-lg px-10 h-14 border-2 border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950/50" id="cta-hero-demo">
                  <Link href="#showcase">
                    Voir la démo
                  </Link>
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center gap-6 text-sm text-zinc-600 dark:text-zinc-400">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Sans carte bancaire</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span>Connexion sécurisée</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-green-600" />
                  <span>Prêt en 30 secondes</span>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* Product Showcase - Realistic Demo */}
        <section id="showcase" className="py-20 sm:py-28 bg-zinc-50 dark:bg-zinc-900/50 scroll-mt-20">
          <div className="container max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
                Votre stock, en un coup d'œil
              </h2>
              <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto">
                Une interface épurée qui vous donne toutes les informations essentielles sans vous noyer dans les détails
              </p>
            </div>
            <RealisticProductShowcase />
          </div>
        </section>

        {/* Video/Image Placeholder */}
        <section className="py-20 sm:py-28 bg-white dark:bg-zinc-950">
          <div className="container max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                Simple, rapide, efficace
              </h2>
              <p className="text-lg text-zinc-600 dark:text-zinc-400">
                Découvrez Mon Petit Stock en action
              </p>
            </div>

            {/* Video Placeholder */}
            <div className="relative aspect-video rounded-2xl border-2 border-zinc-200 dark:border-zinc-800 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/30 overflow-hidden shadow-2xl">
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-purple-600 flex items-center justify-center mb-4 shadow-lg hover:bg-purple-700 transition-colors cursor-pointer">
                  <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Vidéo de démonstration (à venir)</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid - Redesigned */}
        <section id="features" className="py-20 sm:py-28 scroll-mt-20">
          <div className="container max-w-7xl mx-auto">
            <div className="text-center mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium mb-6">
                <Star className="h-4 w-4" />
                <span>Fonctionnalités</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
                Tout ce qu'il vous faut, rien de superflu
              </h2>
              <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto">
                Puissant mais simple. Concentrez-vous sur votre activité, pas sur l'outil.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              {[
                {
                  icon: <Zap className="h-8 w-8" />,
                  title: 'Ajout ultra-rapide',
                  text: 'Créez un produit en 10 secondes. Nom, stock, seuil d\'alerte, c\'est tout.',
                  gradient: 'from-yellow-400 to-orange-500'
                },
                {
                  icon: <Search className="h-8 w-8" />,
                  title: 'Recherche instantanée',
                  text: 'Trouvez n\'importe quel produit en tapant quelques lettres. Filtres par catégorie et statut.',
                  gradient: 'from-blue-500 to-cyan-500'
                },
                {
                  icon: <AlertTriangle className="h-8 w-8" />,
                  title: 'Alertes intelligentes',
                  text: 'Visualisez d\'un coup d\'œil les produits en rupture ou bientôt épuisés.',
                  gradient: 'from-red-500 to-rose-500'
                },
                {
                  icon: <History className="h-8 w-8" />,
                  title: 'Historique complet',
                  text: 'Chaque mouvement est enregistré : qui, quand, combien. Traçabilité totale.',
                  gradient: 'from-purple-500 to-purple-600'
                },
                {
                  icon: <Smartphone className="h-8 w-8" />,
                  title: 'Mobile-first',
                  text: 'Conçu pour mobile. Ajoutez du stock depuis l\'entrepôt, en déplacement.',
                  gradient: 'from-green-500 to-emerald-600'
                },
                {
                  icon: <Lock className="h-8 w-8" />,
                  title: 'Sécurisé & privé',
                  text: 'Vos données sont chiffrées et sécurisées. Connexion sans mot de passe par lien magique.',
                  gradient: 'from-indigo-600 to-purple-700'
                },
              ].map((f) => (
                <div
                  key={f.title}
                  className="group relative bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-purple-200 dark:hover:border-purple-800 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                >
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${f.gradient} text-white mb-5 shadow-md`}>
                    {f.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-zinc-900 dark:text-zinc-100">{f.title}</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">{f.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <Testimonials />

        {/* Pricing - Enhanced */}
        <section id="pricing" className="py-20 sm:py-28 scroll-mt-20">
          <div className="container max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium mb-6">
                <TrendingUp className="h-4 w-4" />
                <span>Tarification</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
                Un tarif simple et honnête
              </h2>
              <p className="text-xl text-zinc-600 dark:text-zinc-400">
                Commencez gratuitement. Passez au Pro uniquement quand vous en avez besoin.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2 max-w-5xl mx-auto">
              {/* Free Plan */}
              <div className="relative bg-white dark:bg-zinc-900 rounded-3xl p-8 border-2 border-zinc-200 dark:border-zinc-800 flex flex-col">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">Gratuit</h3>
                  <p className="text-zinc-600 dark:text-zinc-400">Parfait pour démarrer</p>
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-zinc-900 dark:text-zinc-100">0€</span>
                    <span className="text-zinc-600 dark:text-zinc-400">/toujours</span>
                  </div>
                </div>

                <div className="space-y-4 mb-8 flex-grow">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-zinc-900 dark:text-zinc-100">Jusqu'à 10 produits</p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">Suffisant pour tester ou petits besoins</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-zinc-900 dark:text-zinc-100">Toutes les fonctionnalités de base</p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">Gestion de stock, alertes, recherche</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-zinc-900 dark:text-zinc-100">Historique 30 jours</p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">Traçabilité des mouvements</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-zinc-900 dark:text-zinc-100">Support communautaire</p>
                    </div>
                  </div>
                </div>

                <Button asChild variant="outline" className="w-full h-12 text-base border-2" size="lg">
                  <Link href="/login">Commencer gratuitement</Link>
                </Button>
              </div>

              {/* Pro Plan */}
              <div className="relative bg-purple-600 dark:bg-purple-700 rounded-3xl p-8 flex flex-col text-white shadow-2xl shadow-purple-500/40 border-2 border-purple-500 dark:border-purple-600">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-white text-purple-600 px-4 py-1.5 rounded-full text-sm font-bold shadow-lg flex items-center gap-1.5 border-2 border-purple-200">
                    <Star className="h-4 w-4 fill-current" />
                    Recommandé
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2">Pro</h3>
                  <p className="text-purple-100">Pour une gestion sans limites</p>
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold">9,99€</span>
                    <span className="text-purple-100">/an</span>
                  </div>
                  <p className="text-sm text-purple-100 mt-2">Moins d'1€ par mois</p>
                </div>

                <div className="space-y-4 mb-8 flex-grow">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Produits illimités</p>
                      <p className="text-sm text-purple-100">Gérez autant de produits que vous voulez</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Historique illimité</p>
                      <p className="text-sm text-purple-100">Accédez à tout l'historique</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Export de données</p>
                      <p className="text-sm text-purple-100">Exportez vos données quand vous voulez</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Support prioritaire</p>
                      <p className="text-sm text-purple-100">Réponse en moins de 24h</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Nouvelles fonctionnalités en premier</p>
                      <p className="text-sm text-purple-100">Accès anticipé aux nouveautés</p>
                    </div>
                  </div>
                </div>

                <Button asChild className="w-full h-12 text-base bg-white text-purple-600 hover:bg-purple-50" size="lg" id="cta-pricing-pro">
                  <Link href="/login">
                    Passer au Pro
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="mt-12 text-center">
              <p className="text-zinc-600 dark:text-zinc-400 flex items-center justify-center gap-2 flex-wrap">
                <Shield className="h-5 w-5 text-green-600" />
                Paiements sécurisés par Stripe • Annulation en 1 clic • Facture automatique
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <FAQSection />

        {/* Final CTA - Monochrome Purple */}
        <section className="py-20 sm:py-32 relative overflow-hidden">
          {/* Background gradient - Purple only */}
          <div className="absolute inset-0 bg-gradient-to-b from-purple-600 to-purple-700 dark:from-purple-700 dark:to-purple-900"></div>
          <div className="absolute inset-0 bg-grid-white/[0.05]"></div>

          {/* Subtle orb */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white rounded-full mix-blend-soft-light filter blur-3xl opacity-10 animate-blob"></div>

          <div className="container max-w-7xl mx-auto relative z-10 text-center text-white">
            <div className="max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-8 border border-white/30">
                <Clock className="h-4 w-4" />
                <span>Prêt en 30 secondes</span>
              </div>

              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
                Prêt à gagner du temps ?
              </h2>
              <p className="text-xl sm:text-2xl mb-4">
                Essayez gratuitement, passez au Pro quand vous en avez besoin
              </p>
              <p className="text-lg mb-12 text-purple-100">
                Sans engagement • Sans carte bancaire • Prêt en 30 secondes
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-purple-600 hover:bg-purple-50 shadow-2xl text-lg px-10 h-16 font-semibold"
                  id="cta-final-start"
                >
                  <Link href="/login">
                    Commencer gratuitement
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="bg-white/10 text-white border-2 border-white/30 hover:bg-white hover:text-purple-600 text-lg px-10 h-16 backdrop-blur-sm transition-all"
                  id="cta-final-demo"
                >
                  <Link href="#showcase">
                    Voir la démo
                  </Link>
                </Button>
              </div>

              {/* Trust badges */}
              <div className="mt-16 flex flex-wrap justify-center gap-8 text-sm text-purple-100">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>Sans engagement</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>RGPD compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>Données sécurisées</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
        <div className="container max-w-7xl mx-auto py-12 px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <Link href="/" className="font-bold text-xl text-zinc-900 dark:text-zinc-100 mb-3 inline-block">
                Mon Petit Stock
              </Link>
              <p className="text-zinc-600 dark:text-zinc-400 max-w-md">
                La solution la plus simple pour gérer votre inventaire.
                Conçue pour les PME, artisans et associations.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-3">Produit</h4>
              <div className="space-y-2 text-sm">
                <Link href="#features" className="block text-zinc-600 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-purple-400">
                  Fonctionnalités
                </Link>
                <Link href="#pricing" className="block text-zinc-600 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-purple-400">
                  Tarifs
                </Link>
                <Link href="#faq" className="block text-zinc-600 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-purple-400">
                  FAQ
                </Link>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-3">Légal</h4>
              <div className="space-y-2 text-sm">
                <Link href="#" className="block text-zinc-600 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-purple-400">
                  Mentions Légales
                </Link>
                <Link href="#" className="block text-zinc-600 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-purple-400">
                  Confidentialité
                </Link>
                <Link href="#" className="block text-zinc-600 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-purple-400">
                  CGV
                </Link>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              &copy; {new Date().getFullYear()} Mon Petit Stock. Tous droits réservés.
            </p>
            <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
              <span>Fait avec</span>
              <span className="text-red-500">❤️</span>
              <span>en France</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
