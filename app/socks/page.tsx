import { ProductGrid } from "@/components/product-grid"
import { products } from "@/lib/products"

export default function SocksPage() {
  const socks = products.filter((product) => product.category === "socks")

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Socks</h1>
        <p className="text-muted-foreground">Comfort and style for your feet</p>
      </div>
      <ProductGrid products={socks} />
    </div>
  )
}
