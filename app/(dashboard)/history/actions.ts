"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { isUserPro } from "@/lib/subscription";

export type StockActivity = {
  id: string;
  product_id: string;
  activity_type: "in" | "out" | "adjustment";
  quantity: number;
  created_at: string;
  products: {
    name: string;
  } | null;
};

const FREE_PLAN_HISTORY_DAYS = 30;

export async function getStockActivities(): Promise<{
  activities: StockActivity[];
  isFreePlan: boolean;
  historyLimitDays: number;
}> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  // Check if user has Pro plan
  const isPro = await isUserPro(user.id);
  const isFreePlan = !isPro;

  // Calculate the date limit for free plan (30 days ago)
  const limitDate = new Date();
  limitDate.setDate(limitDate.getDate() - FREE_PLAN_HISTORY_DAYS);

  let query = supabase
    .from("stock_activities")
    .select(
      `
      id,
      product_id,
      activity_type,
      quantity,
      created_at,
      products!inner (
        name
      )
    `
    )
    .order("created_at", { ascending: false })
    .limit(100);

  // Apply date filter for free plan users
  if (isFreePlan) {
    query = query.gte("created_at", limitDate.toISOString());
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching stock activities:", error);
    return {
      activities: [],
      isFreePlan,
      historyLimitDays: FREE_PLAN_HISTORY_DAYS,
    };
  }

  return {
    activities: (data || []).map((item) => ({
      ...item,
      products: Array.isArray(item.products) ? item.products[0] : item.products,
    })) as StockActivity[],
    isFreePlan,
    historyLimitDays: FREE_PLAN_HISTORY_DAYS,
  };
}
