'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { checkProductLimit } from '@/lib/subscription'

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

  // Check product limit for free users
  const { canCreate, count } = await checkProductLimit(user.id)
  if (!canCreate) {
    return {
      error: 'LIMIT_REACHED',
      message: `Vous avez atteint la limite de 10 produits du plan gratuit. Passez au plan Pro pour des produits illimités !`
    }
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

  revalidatePath('/stock')
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

  revalidatePath('/stock')
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

  revalidatePath('/stock')
  return { success: true }
}

export async function useProduct(productId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Get current stock
  const { data: product, error: fetchError } = await supabase
    .from('products')
    .select('current_stock')
    .eq('id', productId)
    .eq('user_id', user.id)
    .single()

  if (fetchError || !product) {
    console.error('Error fetching product:', fetchError)
    return { error: 'Product not found' }
  }

  if (product.current_stock <= 0) {
    return { error: 'Stock already at 0' }
  }

  // Update stock
  const { error: updateError } = await supabase
    .from('products')
    .update({ current_stock: product.current_stock - 1 })
    .eq('id', productId)
    .eq('user_id', user.id)

  if (updateError) {
    console.error('Error updating stock:', updateError)
    return { error: 'Failed to update stock' }
  }

  // Create stock activity
  const { error: activityError } = await supabase
    .from('stock_activities')
    .insert({
      user_id: user.id,
      product_id: productId,
      activity_type: 'out',
      quantity: -1
    })

  if (activityError) {
    console.error('Error creating activity:', activityError)
  }

  revalidatePath('/stock')
  return { success: true }
}

export async function restockProduct(productId: string, quantity: number, note?: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  if (quantity <= 0) {
    return { error: 'Quantity must be positive' }
  }

  // Get current stock
  const { data: product, error: fetchError } = await supabase
    .from('products')
    .select('current_stock')
    .eq('id', productId)
    .eq('user_id', user.id)
    .single()

  if (fetchError || !product) {
    console.error('Error fetching product:', fetchError)
    return { error: 'Product not found' }
  }

  // Update stock
  const { error: updateError } = await supabase
    .from('products')
    .update({ current_stock: product.current_stock + quantity })
    .eq('id', productId)
    .eq('user_id', user.id)

  if (updateError) {
    console.error('Error updating stock:', updateError)
    return { error: 'Failed to update stock' }
  }

  // Create stock activity
  const { error: activityError } = await supabase
    .from('stock_activities')
    .insert({
      user_id: user.id,
      product_id: productId,
      activity_type: 'in',
      quantity: quantity,
      note: note || null
    })

  if (activityError) {
    console.error('Error creating activity:', activityError)
  }

  revalidatePath('/stock')
  return { success: true }
}

export async function updateStockQuantity(productId: string, newQuantity: number) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  if (newQuantity < 0) {
    return { error: 'Quantity cannot be negative' }
  }

  // Get current stock to calculate delta
  const { data: product, error: fetchError } = await supabase
    .from('products')
    .select('current_stock')
    .eq('id', productId)
    .eq('user_id', user.id)
    .single()

  if (fetchError || !product) {
    console.error('Error fetching product:', fetchError)
    return { error: 'Product not found' }
  }

  const delta = newQuantity - product.current_stock

  // Update stock
  const { error: updateError } = await supabase
    .from('products')
    .update({ current_stock: newQuantity })
    .eq('id', productId)
    .eq('user_id', user.id)

  if (updateError) {
    console.error('Error updating stock:', updateError)
    return { error: 'Failed to update stock' }
  }

  // Create stock activity if there was a change
  if (delta !== 0) {
    const { error: activityError } = await supabase
      .from('stock_activities')
      .insert({
        user_id: user.id,
        product_id: productId,
        activity_type: delta > 0 ? 'in' : 'out',
        quantity: Math.abs(delta),
        note: 'Ajustement rapide'
      })

    if (activityError) {
      console.error('Error creating activity:', activityError)
    }
  }

  revalidatePath('/stock')
  return { success: true }
}
