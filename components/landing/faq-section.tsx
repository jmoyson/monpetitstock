'use client'

import { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const faqs = [
  {
    question: 'Le plan gratuit suffit-il pour commencer ?',
    answer: 'Absolument. Le plan gratuit est parfait pour tester l\'application, pour un usage personnel ou si vous avez moins de 10 produits à gérer. Il n\'y a pas de limite de temps et vous bénéficiez de toutes les fonctionnalités essentielles.'
  },
  {
    question: 'Comment fonctionne la connexion par lien magique ?',
    answer: 'Vous entrez votre email, et nous vous envoyons un lien de connexion sécurisé. Cliquez dessus, et vous êtes connecté. Pas de mot de passe à retenir ou à perdre. C\'est plus sécurisé et beaucoup plus simple.'
  },
  {
    question: 'Puis-je annuler mon abonnement Pro à tout moment ?',
    answer: 'Oui, vous pouvez annuler votre abonnement à tout moment depuis vos paramètres. Vous conserverez l\'accès aux fonctionnalités Pro jusqu\'à la fin de votre période de facturation. Aucun engagement, aucune question posée.'
  },
  {
    question: 'La TVA est-elle incluse dans le prix ?',
    answer: 'Oui, le prix de 9,99€ par an est toutes taxes comprises. Vous recevrez une facture détaillée automatiquement après votre paiement, parfait pour votre comptabilité.'
  },
  {
    question: 'Mes données sont-elles en sécurité ?',
    answer: 'La sécurité de vos données est notre priorité absolue. Nous utilisons Supabase pour notre base de données et nos authentifications, un service reconnu pour sa robustesse et sa sécurité. Vos données sont chiffrées et sauvegardées quotidiennement.'
  },
  {
    question: 'Puis-je exporter mes données ?',
    answer: 'Oui, avec le plan Pro vous pouvez exporter toutes vos données à tout moment au format CSV. Vos données vous appartiennent, vous êtes libre de les récupérer quand vous le souhaitez.'
  },
  {
    question: 'Est-ce que ça fonctionne sur mobile ?',
    answer: 'Oui ! Mon Petit Stock est optimisé pour tous les appareils : smartphone, tablette et ordinateur. L\'interface s\'adapte automatiquement et vous pouvez gérer votre stock depuis n\'importe où.'
  },
  {
    question: 'Y a-t-il une période d\'essai pour le plan Pro ?',
    answer: 'Vous pouvez utiliser le plan gratuit aussi longtemps que vous le souhaitez pour tester l\'application. Quand vous passez au Pro, vous payez 9,99€ pour un an, soit moins d\'1€ par mois. Le risque est minimal !'
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="py-20 sm:py-28 bg-zinc-50 dark:bg-zinc-900/50 scroll-mt-20">
      <div className="container max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium mb-6">
            <HelpCircle className="h-4 w-4" />
            <span>FAQ</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            Questions fréquentes
          </h2>
          <p className="text-xl text-zinc-600 dark:text-zinc-400">
            Tout ce que vous devez savoir sur Mon Petit Stock
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-200"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 flex items-start justify-between gap-4 text-left transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                >
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100 flex-1 pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 text-zinc-500 flex-shrink-0 transition-transform duration-200 mt-0.5",
                      openIndex === index && "rotate-180"
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-200 ease-in-out",
                    openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  )}
                >
                  <div className="px-6 pb-5 text-zinc-600 dark:text-zinc-400 leading-relaxed border-t border-zinc-100 dark:border-zinc-800 pt-4">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact CTA */}
          <div className="mt-12 text-center p-8 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30 rounded-2xl border border-purple-200 dark:border-purple-800">
            <h3 className="text-xl font-semibold mb-2 text-zinc-900 dark:text-zinc-100">
              Vous avez d'autres questions ?
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">
              Je suis là pour vous aider
            </p>
            <a
              href="mailto:jeremy@monpetitstock.fr"
              className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium"
            >
              jeremy@monpetitstock.fr
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
