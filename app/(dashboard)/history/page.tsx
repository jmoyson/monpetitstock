import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { HistoryTable } from "@/components/history/history-table";
import { getStockActivities } from "./actions";

export default async function HistoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { activities, isFreePlan, historyLimitDays } =
    await getStockActivities();

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <HistoryTable
          activities={activities}
          isFreePlan={isFreePlan}
          historyLimitDays={historyLimitDays}
        />
      </main>
    </div>
  );
}
