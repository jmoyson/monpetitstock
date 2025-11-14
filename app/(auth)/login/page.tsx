import { Suspense } from 'react'
import { MagicLinkForm } from '@/components/auth/magic-link-form'

export default function LoginPage() {
  return (
    <div className="w-full max-w-md space-y-8 px-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Mon Petit Stock</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Connectez-vous avec votre email
        </p>
      </div>

      <Suspense fallback={<div>Chargement...</div>}>
        <MagicLinkForm />
      </Suspense>
    </div>
  )
}
