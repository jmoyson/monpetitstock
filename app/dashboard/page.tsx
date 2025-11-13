import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Package } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const handleSignOut = async () => {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Bienvenue dans Mon Petit Stock
            </p>
          </div>
          <form action={handleSignOut}>
            <Button variant="outline" type="submit">
              Se déconnecter
            </Button>
          </form>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Profil</CardTitle>
              <CardDescription>Informations de votre compte</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Email:</span>{' '}
                  <span className="text-zinc-600 dark:text-zinc-400">{user.email}</span>
                </p>
                <p className="text-sm">
                  <span className="font-medium">ID:</span>{' '}
                  <span className="text-zinc-600 dark:text-zinc-400">{user.id}</span>
                </p>
              </div>
            </CardContent>
          </Card>

          <Link href="/products">
            <Card className="cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Produits
                </CardTitle>
                <CardDescription>Gérez vos produits et leur inventaire</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Cliquez pour accéder à la gestion des produits
                </p>
              </CardContent>
            </Card>
          </Link>

          <Card>
            <CardHeader>
              <CardTitle>Statistiques</CardTitle>
              <CardDescription>Vue d'ensemble</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Fonctionnalité à venir...
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
