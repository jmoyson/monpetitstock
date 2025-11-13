import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { Navbar } from '@/components/dashboard/navbar'
import { HistoryTable } from '@/components/history/history-table'
import { getStockActivities } from './actions'

export default async function HistoryPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { activities, isFreePlan, historyLimitDays } = await getStockActivities()

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Historique</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Historique des mouvements de stock
          </p>
        </div>
        <HistoryTable
          activities={activities}
          isFreePlan={isFreePlan}
          historyLimitDays={historyLimitDays}
        />
      </main>
    </div>
  )
}
