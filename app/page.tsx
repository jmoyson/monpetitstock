import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect('/stock')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
      <main className="flex w-full max-w-2xl flex-col items-center justify-center gap-6 px-4 py-16">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold tracking-tight">Mon Petit Stock</h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
            Le moyen le plus simple de gérer votre stock
          </p>
        </div>

        <div className="mt-4">
          <Button asChild size="lg">
            <Link href="/login">Commencer</Link>
          </Button>
        </div>

        <div className="mt-8 grid gap-8 md:grid-cols-3 w-full max-w-3xl">
          <div className="text-center space-y-2">
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Simple</div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Interface intuitive et facile à utiliser
            </p>
          </div>
          <div className="text-center space-y-2">
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Rapide</div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Gérez votre inventaire en quelques clics
            </p>
          </div>
          <div className="text-center space-y-2">
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Sécurisé</div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Vos données sont protégées et sécurisées
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
