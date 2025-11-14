import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { SubscriptionCard } from '@/components/subscription/subscription-card'
import { ThemeSelector } from '@/components/settings/theme-selector'
import { LogoutButton } from '@/components/auth/logout-button'
import { getUserSubscription } from '@/lib/subscription'

export default async function SettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const subscription = await getUserSubscription(user.id)

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
            <p className="text-muted-foreground mt-2">
              Gérez votre abonnement et vos préférences
            </p>
          </div>

          <ThemeSelector />

          <SubscriptionCard
            subscription={subscription}
            userEmail={user.email || ''}
          />

          <div className="pt-4 border-t">
            <h2 className="text-lg font-semibold mb-4">Compte</h2>
            <LogoutButton />
          </div>
        </div>
      </main>
    </div>
  )
}
