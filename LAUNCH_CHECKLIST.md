# 🚀 Pre-Launch Checklist - Product Hunt Launch Tomorrow (1-2pm)

**Labels**: `priority: critical`, `launch`, `v0.1`
**Milestone**: Product Hunt Launch
**Assignee**: @jmoyson
**Due Date**: Tomorrow before 1pm

---

## 📋 Overview

V0.1 MVP launching on Product Hunt tomorrow at 1-2pm. This issue tracks all essential items to finalize before going live.

**Philosophy**: Ship the essential, not the perfect. Built in 48h, app works, landing page ready. Focus on what would make users bounce immediately.

**Total Estimated Time**: ~2.5 hours for critical items

---

## 🔴 CRITICAL LAUNCH BLOCKERS (Must Fix - ~1.5h)

### Assets & Social Sharing

- [x] **Add favicon** (15 min)

  - [x] Create favicon.ico (simple purple stock icon)
  - [x] Place in `/public/favicon.ico`
  - [x] Optionally add `icon.png` and `apple-icon.png` for better mobile experience
  - **Tools**: Figma, Canva, or AI image generator
  - **Status**: `/public` folder is currently EMPTY

- [ ] **Create OG image for social sharing** (30 min)

  - [x] Design 1200x630px image with purple gradient background
  - [x] Include text: "Mon Petit Stock" + tagline "Gérez votre stock en 2 clics"
  - [x] Save as `/public/og-image.png`
  - [ ] Test preview on https://www.opengraph.xyz/
  - **Why critical**: No preview image when shared on Twitter/LinkedIn/Product Hunt

- [ ] **Add enhanced meta tags** (10 min)
  - [x] Update `app/layout.tsx` with OpenGraph tags
  - [x] Add Twitter Card meta tags
  - [x] Add metadataBase URL
  - [x] See implementation details in "Meta Tags Code" section below

### Production Configuration

- [x] **Configure production environment variables in Vercel** (10 min)

  - [x] `NEXT_PUBLIC_SUPABASE_URL`
  - [x] `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
  - [x] `SUPABASE_SECRET_KEY`
  - [x] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (pk*live*... - NOT test key!)
  - [x] `STRIPE_SECRET_KEY` (sk*live*... - NOT test key!)
  - [x] `STRIPE_PRICE_ID` (production product ID)
  - [x] `STRIPE_WEBHOOK_SECRET` (production webhook secret)
  - **Current status**: Using TEST Stripe keys locally

- [x] **Stripe production setup** (included in 10 min above)

  - [x] Switch to Live mode in Stripe Dashboard
  - [x] Create new Product + Price (9.99€/year)
  - [x] Copy live publishable key
  - [x] Copy live secret key
  - [x] Configure webhook endpoint: `https://monpetitstock.fr/api/stripe/webhook`
  - [x] Select events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.paid`, `invoice.payment_failed`
  - [x] Copy webhook signing secret

- [x] **Update Supabase redirect URLs** (5 min)
  - [x] Go to Supabase Dashboard → Authentication → URL Configuration
  - [x] Add to Redirect URLs: `https://monpetitstock.fr/auth/confirm`
  - [] Add to Redirect URLs: `https://monpetitstock.fr/**`
  - [] Set Site URL: `https://monpetitstock.fr`
  - **Why critical**: Magic link auth won't work without this

### Build & Error Check

- [x] **Run production build and check for errors** (10 min)
  ```bash
  npm run build
  npm run start
  ```
  - [x] No TypeScript errors
  - [x] No build warnings
  - [x] No runtime console errors (check DevTools)
  - [x] Test landing page: `http://localhost:3000`
  - [x] Test login: `http://localhost:3000/login`
  - [x] Test stock page (after login): `http://localhost:3000/stock`

---

## 🟡 BASIC SOCIAL/SEO (The Minimum - ~15 min)

- [x] **Create 404 page in French** (15 min)

  - [x] Create `app/not-found.tsx`
  - [x] French message: "Page introuvable"
  - [x] Link back to homepage
  - **Current status**: MISSING - shows default Next.js 404
  - See implementation in "404 Page Code" section below

- [x] **Verify meta description** (already done ✅)
  - Current: "Le moyen le plus simple de gérer votre stock"
  - Good enough for V0.1

---

## 🟢 ESSENTIAL TESTING (Must Do - ~30 min)

### Authentication Flow

- [ ] **Test auth flow end-to-end on production** (10 min)
  1. [x] Go to https://monpetitstock.fr
  2. [x] Click "Commencer gratuitement"
  3. [x] Enter email address
  4. [x] Check email inbox for magic link (Supabase)
  5. [x] Verify email not in spam
  6. [x] Click magic link
  7. [x] Confirm redirect to `/stock`
  8. [x] Verify user is logged in
  9. [x] Check browser console for errors

### Payment Flow

- [ ] **Test Stripe checkout flow on production** (15 min)
  1. [ ] Login to app
  2. [ ] Navigate to settings
  3. [ ] Click upgrade to Pro
  4. [ ] Stripe checkout opens
  5. [ ] Use test card: `4242 4242 4242 4242` (any future date, any CVC)
  6. [ ] Complete payment
  7. [ ] Check Stripe Dashboard → Developers → Webhooks for event
  8. [ ] Verify webhook received checkout.session.completed
  9. [ ] Check Supabase `subscriptions` table for new record
  10. [ ] Confirm subscription status shows in app

### Mobile Responsiveness

- [ ] **Test mobile responsiveness on key pages** (5 min)
  - [ ] Open Chrome DevTools (F12)
  - [ ] Toggle device toolbar (Ctrl+Shift+M / Cmd+Shift+M)
  - [ ] Test iPhone SE (375px)
  - [ ] Test iPhone 12 Pro (390px)
  - [ ] Test iPad (768px)
  - [ ] Check landing page
  - [ ] Check login page
  - [ ] Check stock page (after login)

---

## 💎 QUICK WINS (If Time Permits - ~1h)

- [ ] **Add loading states to buttons** (30 min)

  - [ ] Login form submission button
  - [ ] Stripe checkout button
  - [ ] Product creation/update buttons
  - [ ] Add `disabled={isLoading}` where needed

- [x] **Add error boundary** (30 min)
  - [x] Create `app/error.tsx`
  - [x] Catch unexpected crashes
  - [x] Show French error message
  - [x] Add retry button
  - See implementation in "Error Boundary Code" section below

---

## 📝 Implementation Details

### Meta Tags Code

Update `app/layout.tsx` (lines 7-10):

```typescript
export const metadata: Metadata = {
  title: "Mon Petit Stock",
  description: "Le moyen le plus simple de gérer votre stock",
  metadataBase: new URL("https://monpetitstock.fr"),
  openGraph: {
    title: "Mon Petit Stock - Gérez votre stock en 2 clics",
    description:
      "La solution la plus simple pour suivre votre inventaire. Gratuit, sans CB, prêt en 30 secondes.",
    url: "https://monpetitstock.fr",
    siteName: "Mon Petit Stock",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Mon Petit Stock - Gestion de stock simplifiée",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mon Petit Stock - Gérez votre stock en 2 clics",
    description:
      "La solution la plus simple pour suivre votre inventaire. Gratuit, sans CB, prêt en 30 secondes.",
    images: ["/og-image.png"],
  },
};
```

### 404 Page Code

Create `app/not-found.tsx`:

```typescript
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">Page introuvable</h1>
      <p className="text-zinc-600 dark:text-zinc-400 mb-8">
        La page que vous recherchez n'existe pas.
      </p>
      <Button asChild>
        <Link href="/">Retour à l'accueil</Link>
      </Button>
    </div>
  );
}
```

### Error Boundary Code

Create `app/error.tsx`:

```typescript
"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h2 className="text-2xl font-bold mb-4">Une erreur est survenue</h2>
      <p className="text-zinc-600 dark:text-zinc-400 mb-8">
        Quelque chose s'est mal passé. Veuillez réessayer.
      </p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
      >
        Réessayer
      </button>
    </div>
  );
}
```

---

## 🧪 Testing Commands

```bash
# Local build test
npm run build
npm run start

# TypeScript check
npx tsc --noEmit

# Check for hardcoded localhost URLs
grep -r "localhost" app/ --include="*.ts" --include="*.tsx"

# After deployment to production:
# 1. Push to main branch
# 2. Wait for Vercel deployment to complete
# 3. Visit https://monpetitstock.fr
# 4. Open browser console (F12) and check for errors
# 5. Test auth flow (see checklist above)
# 6. Test Stripe checkout (see checklist above)
```

---

## ✅ What's Already Good

- ✅ Landing page is polished and accessible
- ✅ Authentication with magic links implemented
- ✅ Stripe integration code looks solid
- ✅ Webhook handling is comprehensive (see `app/api/stripe/webhook/route.ts`)
- ✅ Dashboard pages exist (`/stock`, `/history`, `/settings`)
- ✅ Umami analytics configured
- ✅ Mobile-first design principles
- ✅ Dark mode support
- ✅ French language throughout
- ✅ Clean git status (no uncommitted changes)

---

## 🚫 What NOT to Do

- ❌ Don't add new features
- ❌ Don't over-optimize
- ❌ Don't perfect the copy
- ❌ Don't obsess over design details
- ❌ Don't add analytics beyond Umami
- ❌ Don't add email marketing integrations yet
- ❌ Don't create legal pages yet (Mentions Légales, CGV) - V0.2 priority

**Remember**: We're launching V0.1. It needs to WORK, not be PERFECT.

---

## 📊 Timeline Breakdown

| Priority    | Task                  | Time   | Running Total |
| ----------- | --------------------- | ------ | ------------- |
| 🔴 CRITICAL | Favicon               | 15 min | 15 min        |
| 🔴 CRITICAL | OG image design       | 20 min | 35 min        |
| 🔴 CRITICAL | Meta tags code        | 10 min | 45 min        |
| 🔴 CRITICAL | Vercel env vars       | 10 min | 55 min        |
| 🔴 CRITICAL | Supabase URLs         | 5 min  | 1h 00 min     |
| 🔴 CRITICAL | Build + console check | 10 min | 1h 10 min     |
| 🟡 BASIC    | 404 page              | 15 min | 1h 25 min     |
| 🟢 TESTING  | Auth flow test        | 10 min | 1h 35 min     |
| 🟢 TESTING  | Stripe test           | 15 min | 1h 50 min     |
| 🟢 TESTING  | Mobile check          | 5 min  | 1h 55 min     |
| 💎 OPTIONAL | Loading states        | 30 min | 2h 25 min     |
| 💎 OPTIONAL | Error boundary        | 30 min | 2h 55 min     |

**Core essentials**: ~2 hours
**With optional improvements**: ~3 hours

---

## 🎯 Final Pre-Launch Checklist

**Before going live tomorrow at 1-2pm:**

- [ ] Favicon in `/public`
- [ ] OG image in `/public` (1200x630px)
- [ ] Meta tags updated in `app/layout.tsx`
- [ ] 404 page created (`app/not-found.tsx`)
- [ ] Vercel environment variables configured (PRODUCTION Stripe keys)
- [ ] Supabase redirect URLs include `monpetitstock.fr`
- [ ] `npm run build` completes without errors
- [ ] Auth flow tested on production
- [ ] Stripe checkout tested on production
- [ ] Mobile responsiveness verified
- [ ] Browser console has no critical errors
- [ ] Product Hunt listing prepared
- [ ] Coffee ready ☕
- [ ] Kids duties scheduled around launch 👶

---

## 🆘 Known Issues (Non-Blocking)

**Current findings from audit:**

- Public folder is empty (needs favicon + OG image)
- No 404 page (shows default Next.js page)
- Using test Stripe keys locally (need production keys in Vercel)
- Stripe routes use localhost fallback (but correctly get origin from headers - OK)
- No error boundary (would be nice to have)
- Legal pages linked in footer go to `#` (acceptable for V0.1)

---

**Questions or blockers?** Comment below.

**Ready to ship?** Check all boxes and close this issue when done! 🚢
