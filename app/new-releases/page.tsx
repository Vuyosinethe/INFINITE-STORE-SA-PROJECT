import { ProductCarousel } from "@/components/product-carousel"
import { products } from "@/lib/products"

export default function NewReleasesPage() {
  const newReleases = products.filter((product) => product.isNewRelease)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">New Releases</h1>
        <p className="text-muted-foreground">Discover our latest arrivals across all categories</p>
      </div>
      <ProductCarousel products={newReleases} />
    </div>
  )
}
