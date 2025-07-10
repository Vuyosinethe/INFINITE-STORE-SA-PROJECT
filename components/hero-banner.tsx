import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HeroBanner() {
  return (
    <div className="relative bg-gradient-to-r from-black via-orange-500 to-black text-white">
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl">
          <div className="mb-6">
            <Badge variant="secondary" className="mb-4 bg-orange-500 text-black border-orange-500">
              🔥 Special Combo Offer
            </Badge>
            <div className="bg-orange-500 text-black px-6 py-3 rounded-lg inline-block transform -rotate-2 shadow-lg font-bold">
              <span className="text-lg">1 Air Force + Any Sneaker = R2200!</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Step Into Style with <span className="text-black">i</span>
            <span className="text-orange-500">Nfinite</span>
          </h1>

          <p className="text-xl md:text-2xl mb-8 text-white/90">
            Discover premium sneakers, comfortable socks, and authentic football tees. Quality meets style in every
            product.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="bg-orange-500 text-black hover:bg-orange-600">
              <Link href="/hot-deals">Shop Combo Deal</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-black"
            >
              <Link href="/new-releases">New Arrivals</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
