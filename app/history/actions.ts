'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export type StockActivity = {
  id: string
  product_id: string
  activity_type: 'in' | 'out' | 'adjustment'
  quantity: number
  created_at: string
  products: {
    name: string
  } | null
}

export async function getStockActivities(): Promise<StockActivity[]> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const { data, error } = await supabase
    .from('stock_activities')
    .select(`
      id,
      product_id,
      activity_type,
      quantity,
      created_at,
      products!inner (
        name
      )
    `)
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) {
    console.error('Error fetching stock activities:', error)
    return []
  }

  return (data || []).map(item => ({
    ...item,
    products: Array.isArray(item.products) ? item.products[0] : item.products
  })) as StockActivity[]
}
