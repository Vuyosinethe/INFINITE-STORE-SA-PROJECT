import { ProductGrid } from "@/components/product-grid"
import { products } from "@/lib/products"
import { Badge } from "@/components/ui/badge"

export default function HotDealsPage() {
  const hotDeals = products.filter((product) => product.isHotDeal)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold">Hot Deals</h1>
          <Badge variant="destructive" className="text-sm">
            Limited Time
          </Badge>
        </div>
        <p className="text-muted-foreground">Don't miss out on these amazing combo specials and promotions</p>
      </div>

      <div className="mb-8 p-6 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-200">
        <h2 className="text-xl font-semibold mb-2 text-red-800">Special Combo Offers</h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Badge variant="outline">Combo 1</Badge>
            <span>Buy 2 Sneakers for R899</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">Combo 2</Badge>
            <span>Sneaker + Socks Bundle - Save 25%</span>
          </div>
        </div>
      </div>

      <ProductGrid products={hotDeals} />
    </div>
  )
}
