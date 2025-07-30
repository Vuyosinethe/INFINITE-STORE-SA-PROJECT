import { products } from "@/lib/products"
import { ProductGrid } from "@/components/product-grid"
import { Badge } from "@/components/ui/badge" // Ensure Badge is imported

export default function FootballTeesPage() {
  const footballTees = products.filter((product) => product.category === "football-tees")

  return (
    <main className="flex-1">
      <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
        <div className="mb-8 space-y-2">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Football Jerseys</h1>
            <Badge className="bg-primary text-black">24/25 Season</Badge>
          </div>
          <p className="text-gray-500 dark:text-gray-400">Authentic team jerseys from the latest season</p>
        </div>

        <div className="mb-8 p-6 bg-gradient-to-r from-primary/10 to-primary/20 rounded-lg border border-primary/30">
          <h2 className="text-xl font-semibold mb-2 text-black">🏆 Authentic 24/25 Season Jerseys</h2>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-primary text-primary">
                Premium Quality
              </Badge>
              <span>Official team designs</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-primary text-primary">
                Front & Back
              </Badge>
              <span>Complete jersey views</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-primary text-primary">
                All Sizes
              </Badge>
              <span>XS to XXL available</span>
            </div>
          </div>
        </div>

        <ProductGrid products={footballTees} />
      </div>
    </main>
  )
}
