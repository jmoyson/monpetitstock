import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { Navbar } from '@/components/dashboard/navbar'
import { StockTable } from '@/components/dashboard/stock-table'
import { getProducts } from '@/app/products/actions'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const products = await getProducts()

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <StockTable products={products} />
      </main>
    </div>
  )
}
