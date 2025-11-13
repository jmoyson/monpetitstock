import { getProducts } from "./actions";
import { StockManagementClient } from "@/components/stock/stock-management-client";

export default async function StockPage() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4">
        <StockManagementClient initialProducts={products} />
      </main>
    </div>
  );
}
