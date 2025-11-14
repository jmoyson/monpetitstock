import Stripe from 'stripe'

// Initialize Stripe only if secret key is available (allows builds without env vars)
export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-10-29.clover',
      typescript: true,
    })
  : null as any as Stripe

export const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID || ''
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || ''
