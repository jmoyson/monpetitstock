# Stripe Subscription Setup Guide

This guide will walk you through setting up Stripe for your Mon Petit Stock application with an annual Pro subscription at 9.99€/year.

## Prerequisites

- A Stripe account (create one at https://stripe.com)
- Stripe CLI installed (for webhook testing)
- Node.js and npm installed
- Supabase project set up

## Step 1: Install Stripe CLI

### macOS

```bash
brew install stripe/stripe-cli/stripe
```

### Linux

```bash
curl -s https://packages.stripe.com/api/v1/keys/stripe-cli/gpg | sudo apt-key add -
echo "deb https://packages.stripe.com/stripe-cli-debian-local stable main" | sudo tee -a /etc/apt/sources.list.d/stripe.list
sudo apt update
sudo apt install stripe
```

### Windows

Download from: https://github.com/stripe/stripe-cli/releases/latest

## Step 2: Login to Stripe CLI

```bash
stripe login
```

This will open a browser window to authorize the CLI with your Stripe account.

## Step 3: Create a Product and Price

### Option A: Using Stripe Dashboard (Recommended)

1. Go to https://dashboard.stripe.com/test/products
2. Click "Add product"
3. Fill in:
   - Name: `Mon Petit Stock Pro`
   - Description: `Plan Pro avec produits illimités`
4. Under Pricing:
   - Select "Recurring"
   - Price: `9.99` EUR
   - Billing period: `Yearly`
   - Payment mode: `Subscription`
5. Click "Add product"
6. **Copy the Price ID** (starts with `price_...`) - you'll need this!

### Option B: Using Stripe CLI

```bash
# Create the product
stripe products create \
  --name="Mon Petit Stock Pro" \
  --description="Plan Pro avec produits illimités"

# Create the annual price (replace prod_xxx with your product ID)
stripe prices create \
  --product=prod_xxx \
  --unit-amount=999 \
  --currency=eur \
  --recurring[interval]=year \
  --recurring[interval_count]=1
```

**Copy the Price ID from the output!**

## Step 4: Configure Environment Variables

1. Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

2. Get your Stripe API keys from https://dashboard.stripe.com/test/apikeys

3. Update `.env.local` with your keys:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx  # From Stripe Dashboard
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx  # From Stripe Dashboard
STRIPE_PRICE_ID=price_xxxxxxxxxxxxx  # The Price ID from Step 3
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx  # We'll get this in Step 6
```

## Step 5: Run Database Migration

Apply the subscription schema to your Supabase database:

```bash
# Using Supabase CLI
supabase db push

# OR manually run the migration
# Copy the contents of supabase/migrations/20250114000000_add_subscriptions.sql
# and run it in your Supabase SQL Editor at:
# https://app.supabase.com/project/_/sql
```

## Step 6: Set Up Webhook for Local Development

### Start Your Development Server

```bash
npm run dev
```

### In a New Terminal, Forward Webhooks

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

You'll see output like:

```
> Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxx
```

**Copy this webhook secret** and add it to your `.env.local`:

```bash
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

### Restart Your Dev Server

After adding the webhook secret, restart your development server:

```bash
# Stop the dev server (Ctrl+C) and restart
npm run dev
```

## Step 7: Configure Customer Portal

The Customer Portal allows users to manage their subscriptions (cancel, update payment, view invoices).

1. Go to https://dashboard.stripe.com/test/settings/billing/portal
2. Click "Activate test link"
3. Configure settings:
   - **Allow customers to**: ✅ Update payment methods, Cancel subscriptions
   - **Cancellation**: Choose "Cancel immediately" or "Cancel at period end"
   - **Invoice history**: ✅ Show
4. Click "Save changes"

## Step 8: Test the Integration

### Test the Checkout Flow

1. Start the dev server and webhook forwarding (from Step 6)
2. Navigate to http://localhost:3000
3. Sign up/Login to your app
4. Go to Settings (Paramètres)
5. Click "Passer au plan Pro"
6. Use Stripe test card: `4242 4242 4242 4242`
   - Any future expiry date
   - Any 3-digit CVC
   - Any postal code
7. Complete the checkout

### Verify Webhook Events

In your webhook terminal, you should see:

```
checkout.session.completed
customer.subscription.created
invoice.paid
```

### Test Customer Portal

1. After subscribing, click "Gérer mon abonnement"
2. You should be redirected to Stripe's Customer Portal
3. Test canceling/updating your subscription

## Step 9: Test Different Scenarios

### Test Card Numbers

Stripe provides test cards for different scenarios:

- **Successful payment**: `4242 4242 4242 4242`
- **Payment requires authentication**: `4000 0025 0000 3155`
- **Payment is declined**: `4000 0000 0000 9995`
- **Insufficient funds**: `4000 0000 0000 9995`

### Test Subscription Lifecycle

```bash
# List all subscriptions
stripe subscriptions list

# Cancel a subscription
stripe subscriptions cancel sub_xxxxxxxxxxxxx

# Update a subscription
stripe subscriptions update sub_xxxxxxxxxxxxx --cancel_at_period_end=true
```

## Step 10: Production Setup

### Create Production Product

Repeat Step 3 in **Live mode** (toggle in Stripe Dashboard top-right).

### Get Live API Keys

1. Go to https://dashboard.stripe.com/apikeys (Live mode)
2. Copy your live keys

### Set Up Production Webhook

1. Go to https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Enter your production URL: `https://yourdomain.com/api/stripe/webhook`
4. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
5. Click "Add endpoint"
6. **Copy the webhook signing secret** (starts with `whsec_`)

### Update Production Environment Variables

Set these in your hosting platform (Vercel, Railway, etc.):

```bash
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxx
STRIPE_PRICE_ID=price_xxxxxxxxxxxxx  # Live mode Price ID
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx  # Live mode webhook secret
```

## Troubleshooting

### Webhooks not working

- Ensure `stripe listen` is running
- Check that `STRIPE_WEBHOOK_SECRET` is set correctly
- Restart your dev server after setting the secret
- Check webhook logs: `stripe logs tail`

### Checkout session fails

- Verify `STRIPE_PRICE_ID` is correct
- Check that the price is in "Recurring" mode
- Ensure your Stripe account is activated

### Database errors

- Run the migration: `supabase db push`
- Check RLS policies are applied
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set (needed for webhooks)

### Can't access Customer Portal

- Activate the portal in Stripe Dashboard
- Ensure customer has a subscription
- Check browser console for errors

## Useful Commands

```bash
# View webhook events
stripe events list

# View subscriptions
stripe subscriptions list

# View customers
stripe customers list

# View products
stripe products list

# View prices
stripe prices list

# Trigger test webhooks
stripe trigger checkout.session.completed
stripe trigger invoice.paid
stripe trigger invoice.payment_failed

# View webhook logs
stripe logs tail
```

## Architecture Overview

### How it Works

1. **User upgrades**:

   - Clicks "Passer au plan Pro" → `/api/stripe/checkout`
   - API creates Checkout Session → Redirects to Stripe hosted checkout
   - User pays → Stripe redirects back to your app

2. **Webhook processes payment**:

   - Stripe sends `checkout.session.completed` → `/api/stripe/webhook`
   - Webhook updates subscription in database
   - User now has Pro access

3. **User manages subscription**:
   - Clicks "Gérer mon abonnement" → `/api/stripe/portal`
   - API creates Portal Session → Redirects to Stripe hosted portal
   - User can cancel, update payment, view invoices
   - Changes sync via webhooks

### Why This Approach?

- **Stripe Checkout**: Fully hosted, PCI compliant, handles all payment UI
- **Customer Portal**: Fully hosted, handles subscription management, invoices
- **Webhooks**: Keep your database in sync with Stripe automatically
- **Minimal Code**: Stripe handles the complex stuff, you just sync data

## Next Steps

- Set up email notifications via Stripe Dashboard
- Customize Checkout and Portal branding
- Add more subscription tiers
- Set up usage-based billing (if needed)
- Monitor with Stripe Sigma (analytics)

## Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe CLI Reference](https://stripe.com/docs/cli)
- [Test Cards](https://stripe.com/docs/testing)
- [Webhooks Guide](https://stripe.com/docs/webhooks)
- [Customer Portal Guide](https://stripe.com/docs/billing/subscriptions/integrating-customer-portal)
