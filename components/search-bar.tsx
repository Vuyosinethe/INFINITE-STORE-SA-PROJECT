"use client"

import { useState, useEffect } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { products } from "@/lib/products"
import { ProductDetailDialog } from "@/components/product-detail-dialog"
import type { Product } from "@/lib/products"
import Link from "next/link"
import Image from "next/image"

interface SearchBarProps {
  onSearch?: (query: string) => void
  placeholder?: string
}

export function SearchBar({ onSearch, placeholder = "Search products..." }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showProductDetail, setShowProductDetail] = useState(false)

  useEffect(() => {
    if (query.trim().length > 0) {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase()),
      )
      setSearchResults(filtered.slice(0, 6)) // Show max 6 results
      setIsOpen(true)
    } else {
      setSearchResults([])
      setIsOpen(false)
    }
  }, [query])

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery)
    if (onSearch) {
      onSearch(searchQuery)
    }
  }

  const clearSearch = () => {
    setQuery("")
    setSearchResults([])
    setIsOpen(false)
    if (onSearch) {
      onSearch("")
    }
  }

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product)
    setShowProductDetail(true)
    setIsOpen(false)
    setQuery("")
  }

  return (
    <>
      <div className="relative w-full max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 pr-10"
            onFocus={() => query.length > 0 && setIsOpen(true)}
          />
          {query && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              onClick={clearSearch}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {isOpen && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
            <div className="p-2">
              <div className="text-xs text-muted-foreground mb-2 px-2">
                {searchResults.length} result{searchResults.length !== 1 ? "s" : ""} found
              </div>
              {searchResults.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md transition-colors text-left"
                >
                  <div className="relative w-12 h-12 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-contain"
                      style={
                        product.category === "football-tees" || product.category === "socks"
                          ? {
                              objectPosition: "center center",
                              transform: "scale(0.9)",
                            }
                          : {
                              objectPosition: "center bottom",
                              transform: "translateY(-25%) scale(1.1)",
                            }
                      }
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{product.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-bold text-primary">R{product.price}</span>
                      <Badge variant="outline" className="text-xs">
                        {product.category === "football-tees"
                          ? "Jersey"
                          : product.category === "sneakers"
                            ? "Sneaker"
                            : "Socks"}
                      </Badge>
                    </div>
                  </div>
                </button>
              ))}
              {products.filter(
                (product) =>
                  product.name.toLowerCase().includes(query.toLowerCase()) ||
                  product.category.toLowerCase().includes(query.toLowerCase()),
              ).length > 6 && (
                <div className="text-center p-2 border-t">
                  <Link
                    href={`/search?q=${encodeURIComponent(query)}`}
                    className="text-sm text-primary hover:underline"
                    onClick={() => setIsOpen(false)}
                  >
                    View all results
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* No Results */}
        {isOpen && query.length > 0 && searchResults.length === 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            <div className="p-4 text-center text-muted-foreground">
              <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No products found for "{query}"</p>
              <p className="text-xs mt-1">Try searching for sneakers, jerseys, or socks</p>
            </div>
          </div>
        )}
      </div>

      {/* Product Detail Dialog */}
      {selectedProduct && (
        <ProductDetailDialog product={selectedProduct} open={showProductDetail} onOpenChange={setShowProductDetail} />
      )}
    </>
  )
}
