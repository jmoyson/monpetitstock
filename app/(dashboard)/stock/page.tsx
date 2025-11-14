import { getProducts } from "./actions";
import { StockManagementClient } from "@/components/stock/stock-management-client";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { isUserPro } from "@/lib/subscription";

export default async function StockPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const products = await getProducts();
  const isPro = await isUserPro(user.id);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4">
        <StockManagementClient initialProducts={products} isPro={isPro} />
      </main>
    </div>
  );
}
