"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { ProductGrid } from "@/components/product-grid"
import { SearchBar } from "@/components/search-bar"
import { products } from "@/lib/products"
import type { Product } from "@/lib/products"
import { Badge } from "@/components/ui/badge"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredProducts(filtered)
    } else {
      setFilteredProducts([])
    }
  }, [searchQuery])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Search Products</h1>
        <div className="max-w-md">
          <SearchBar onSearch={handleSearch} placeholder="Search for sneakers, jerseys, socks..." />
        </div>
      </div>

      {searchQuery && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg font-semibold">Search results for:</span>
            <Badge variant="outline" className="text-base px-3 py-1">
              "{searchQuery}"
            </Badge>
          </div>
          <p className="text-muted-foreground">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} found
          </p>
        </div>
      )}

      {searchQuery && filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground mb-4">
              We couldn't find any products matching "{searchQuery}". Try searching for:
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge variant="outline">Sneakers</Badge>
              <Badge variant="outline">Air Jordan</Badge>
              <Badge variant="outline">Nike</Badge>
              <Badge variant="outline">Football Jerseys</Badge>
              <Badge variant="outline">Socks</Badge>
              <Badge variant="outline">Adidas</Badge>
            </div>
          </div>
        </div>
      )}

      {filteredProducts.length > 0 && <ProductGrid products={filteredProducts} />}

      {!searchQuery && (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">Start searching</h3>
          <p className="text-muted-foreground">
            Use the search bar above to find your favorite sneakers, jerseys, and socks
          </p>
        </div>
      )}
    </div>
  )
}
