import { getProducts } from './actions'
import { ProductsClient } from '@/components/products/products-client'
import { Navbar } from '@/components/dashboard/navbar'

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <>
      <Navbar />
      <ProductsClient initialProducts={products} />
    </>
  )
}
