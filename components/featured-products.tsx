import { ProductGrid } from "@/components/product-grid"
import { products } from "@/lib/products"

export function FeaturedProducts() {
  const hotItems = products.filter((product) => product.isFeatured).slice(0, 6)
  const newArrivals = products.filter((product) => product.isNewRelease).slice(0, 6)

  return (
    <div className="space-y-12 py-8">
      <section>
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-2xl font-bold text-black">🔥 Hot Items</h2>
          <span className="text-sm text-gray-600">All R1500</span>
        </div>
        <ProductGrid products={hotItems} />
      </section>

      <section>
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-2xl font-bold text-black">✨ New Arrivals</h2>
          <span className="text-sm text-gray-600">UK 3-9 Available</span>
        </div>
        <ProductGrid products={newArrivals} />
      </section>
    </div>
  )
}
