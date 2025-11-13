'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export type Product = {
  id: string
  name: string
  current_stock: number
  alert_threshold: number
  category: string | null
  created_at: string
  updated_at: string
}

export async function getProducts(): Promise<Product[]> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  return data || []
}

export async function createProduct(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  const name = formData.get('name') as string
  const current_stock = parseInt(formData.get('current_stock') as string) || 0
  const alert_threshold = parseInt(formData.get('alert_threshold') as string) || 0
  const category = formData.get('category') as string || null

  if (!name) {
    return { error: 'Name is required' }
  }

  const { error } = await supabase
    .from('products')
    .insert({
      user_id: user.id,
      name,
      alert_threshold,
      category,
      current_stock
    })

  if (error) {
    console.error('Error creating product:', error)
    return { error: 'Failed to create product' }
  }

  revalidatePath('/products')
  return { success: true }
}

export async function updateProduct(id: string, formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  const name = formData.get('name') as string
  const current_stock = parseInt(formData.get('current_stock') as string) || 0
  const alert_threshold = parseInt(formData.get('alert_threshold') as string) || 0
  const category = formData.get('category') as string || null

  if (!name) {
    return { error: 'Name is required' }
  }

  const { error } = await supabase
    .from('products')
    .update({
      name,
      current_stock,
      alert_threshold,
      category
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error updating product:', error)
    return { error: 'Failed to update product' }
  }

  revalidatePath('/products')
  return { success: true }
}

export async function deleteProduct(id: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error deleting product:', error)
    return { error: 'Failed to delete product' }
  }

  revalidatePath('/products')
  return { success: true }
}
