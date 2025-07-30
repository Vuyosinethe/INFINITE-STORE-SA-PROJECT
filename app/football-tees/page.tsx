import { products } from "@/lib/products"
import { ProductGrid } from "@/components/product-grid"

export default function FootballTeesPage() {
  const footballTees = products.filter((product) => product.category === "football-tees")

  return (
    <main className="flex-1">
      <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Football Tees</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Explore our collection of football jerseys from top clubs and national teams.
          </p>
        </div>
        <ProductGrid products={footballTees} />
      </div>
    </main>
  )
}
