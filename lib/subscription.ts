import { createClient } from '@/utils/supabase/server'

export type SubscriptionStatus =
  | 'active'
  | 'canceled'
  | 'incomplete'
  | 'incomplete_expired'
  | 'past_due'
  | 'trialing'
  | 'unpaid'
  | 'free'

export interface Subscription {
  id: string
  user_id: string
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  stripe_price_id: string | null
  status: SubscriptionStatus
  current_period_start: string | null
  current_period_end: string | null
  cancel_at_period_end: boolean
  created_at: string
  updated_at: string
}

export async function getUserSubscription(userId: string): Promise<Subscription | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) {
    console.error('Error fetching subscription:', error)
    return null
  }

  return data
}

export async function isUserPro(userId: string): Promise<boolean> {
  const subscription = await getUserSubscription(userId)

  if (!subscription) return false

  return subscription.status === 'active' || subscription.status === 'trialing'
}

export async function updateSubscription(
  userId: string,
  data: Partial<Omit<Subscription, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('subscriptions')
    .update(data)
    .eq('user_id', userId)

  if (error) {
    console.error('Error updating subscription:', error)
    throw error
  }
}

export async function createOrUpdateSubscription(
  userId: string,
  data: Partial<Omit<Subscription, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('subscriptions')
    .upsert({
      user_id: userId,
      ...data,
    })

  if (error) {
    console.error('Error creating/updating subscription:', error)
    throw error
  }
}

// Free plan limits
export const FREE_PLAN_LIMITS = {
  MAX_PRODUCTS: 10,
}

export async function checkProductLimit(userId: string): Promise<{ canCreate: boolean; count: number }> {
  const supabase = await createClient()
  const isPro = await isUserPro(userId)

  if (isPro) {
    return { canCreate: true, count: 0 }
  }

  const { count, error } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  if (error) {
    console.error('Error counting products:', error)
    return { canCreate: false, count: 0 }
  }

  return {
    canCreate: (count || 0) < FREE_PLAN_LIMITS.MAX_PRODUCTS,
    count: count || 0,
  }
}
