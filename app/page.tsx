import { HeroBanner } from "@/components/hero-banner"
import { FeaturedProducts } from "@/components/featured-products"
import { NavigationTabs } from "@/components/navigation-tabs"

export default function HomePage() {
  return (
    <div className="space-y-8">
      <HeroBanner />
      <div className="container mx-auto px-4">
        <NavigationTabs />
        <FeaturedProducts />
      </div>
    </div>
  )
}
