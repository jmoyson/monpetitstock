# Database Setup

## Apply Migration via Dashboard

1. Go to Supabase Dashboard → **SQL Editor**
2. Copy/paste `migrations/20250113000000_init.sql`
3. Click **Run**

## Apply Migration via CLI (Alternative)

```bash
supabase db push
```

## Schema

**products**
- name, current_stock, alert_threshold, category

**stock_activities**
- product_id, activity_type (in/out/adjustment), quantity

RLS enabled - users can only access their own data.
