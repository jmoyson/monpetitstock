'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, Crown, Check } from 'lucide-react'
import { toast } from 'sonner'
import type { Subscription } from '@/lib/subscription'

interface SubscriptionCardProps {
  subscription: Subscription | null
  userEmail: string
}

export function SubscriptionCard({ subscription, userEmail }: SubscriptionCardProps) {
  const [loading, setLoading] = useState(false)

  const isPro = subscription?.status === 'active' || subscription?.status === 'trialing'
  const isCanceling = subscription?.cancel_at_period_end

  const handleUpgrade = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      console.error('Error:', error)
      toast.error('Erreur lors de la création de la session de paiement')
      setLoading(false)
    }
  }

  const handleManageSubscription = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to create portal session')
      }

      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      console.error('Error:', error)
      toast.error('Erreur lors de l\'ouverture du portail de gestion')
      setLoading(false)
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Abonnement</CardTitle>
            <CardDescription>Gérez votre plan et votre facturation</CardDescription>
          </div>
          <Badge variant={isPro ? 'default' : 'secondary'} className="gap-1">
            {isPro && <Crown className="h-3 w-3" />}
            {isPro ? 'Pro' : 'Gratuit'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isPro ? (
          <>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-3">Plan Gratuit</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    Jusqu'à 10 produits
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    Gestion de stock basique
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    Historique des mouvements
                  </li>
                </ul>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Crown className="h-5 w-5 text-primary" />
                  Plan Pro - 9,99€/an
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    Produits illimités
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    Toutes les fonctionnalités
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    Support prioritaire
                  </li>
                </ul>
                <Button onClick={handleUpgrade} disabled={loading} className="w-full gap-2">
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Chargement...
                    </>
                  ) : (
                    <>
                      <Crown className="h-4 w-4" />
                      Passer au plan Pro
                    </>
                  )}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Crown className="h-5 w-5 text-primary" />
                  Plan Pro
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Prix</span>
                    <span className="font-medium">9,99€/an</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Statut</span>
                    <span className="font-medium capitalize">
                      {isCanceling ? 'Annulation en cours' : subscription.status}
                    </span>
                  </div>
                  {subscription.current_period_end && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {isCanceling ? 'Expire le' : 'Renouvellement le'}
                      </span>
                      <span className="font-medium">
                        {formatDate(subscription.current_period_end)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {isCanceling && (
                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg p-4">
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    Votre abonnement sera annulé à la fin de la période en cours.
                    Vous pourrez toujours utiliser les fonctionnalités Pro jusqu'au{' '}
                    {formatDate(subscription.current_period_end)}.
                  </p>
                </div>
              )}

              <Button
                onClick={handleManageSubscription}
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Chargement...
                  </>
                ) : (
                  'Gérer mon abonnement'
                )}
              </Button>
            </div>
          </>
        )}

        <div className="text-xs text-muted-foreground border-t pt-4">
          <p>Email: {userEmail}</p>
          <p className="mt-1">
            Les paiements sont sécurisés et traités par Stripe.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
