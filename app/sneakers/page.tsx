import { ProductGrid } from "@/components/product-grid"
import { products } from "@/lib/products"

export default function SneakersPage() {
  const sneakers = products.filter((product) => product.category === "sneakers")

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Sneakers</h1>
        <p className="text-muted-foreground">Step up your game with our premium sneaker collection</p>
      </div>
      <ProductGrid products={sneakers} />
    </div>
  )
}
