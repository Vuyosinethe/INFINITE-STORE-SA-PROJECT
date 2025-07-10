import { Badge } from "@/components/ui/badge"

export default function HotDealsPage() {
  return (
    <div className="container py-8">
      {/* Combo Offer Section */}
      <div className="mb-8 p-8 bg-gradient-to-r from-primary/10 to-primary/20 rounded-lg border-2 border-primary">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4 text-black">🔥 EXCLUSIVE COMBO DEAL 🔥</h2>
          <div className="bg-primary text-black px-8 py-4 rounded-lg inline-block font-bold text-xl mb-4">
            1 Air Force + Any Other Sneaker = R2200
          </div>
          <p className="text-lg text-gray-700 mb-4">Save R800 with this amazing combo!</p>
          <p className="text-sm text-gray-600">
            Mix and match any Air Force 1 with any other sneaker in our collection
          </p>
        </div>
      </div>

      {/* All Products Offer Section */}
      <div className="mb-8 p-6 bg-black text-white rounded-lg">
        <h2 className="text-xl font-semibold mb-2 text-primary">All Products Now R1500</h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-primary text-primary">
              Sizes
            </Badge>
            <span>UK 3 to UK 9 Available</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-primary text-primary">
              Quality
            </Badge>
            <span>Premium Materials & Authentic Designs</span>
          </div>
        </div>
      </div>

      {/* Rest of the page content (e.g., product listings) can go here */}
    </div>
  )
}
