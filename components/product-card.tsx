"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ProductDetailDialog } from "@/components/product-detail-dialog"
import { useState } from "react"
import type { Product } from "@/lib/products"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [showProductDetail, setShowProductDetail] = useState(false)

  const hasMultipleColors = product.colorVariants && product.colorVariants.length > 1

  return (
    <>
      <Card className="group overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
        <div className="relative aspect-[5/4] overflow-hidden bg-gray-50" onClick={() => setShowProductDetail(true)}>
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-contain group-hover:scale-105 transition-transform duration-300"
              style={
                product.category === "football-tees"
                  ? {
                      objectPosition: "center center",
                      transform: "scale(0.9)",
                    }
                  : product.category === "socks"
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
          {product.isHotDeal && (
            <Badge className="absolute top-1 left-1 bg-black text-white text-xs px-1 py-0.5">Hot Deal</Badge>
          )}
          {product.isNewRelease && (
            <Badge className="absolute top-1 right-1 bg-primary text-black text-xs px-1 py-0.5">
              {product.category === "football-tees" ? "New Season" : "New"}
            </Badge>
          )}
          {product.backImage && (
            <Badge className="absolute bottom-1 right-1 bg-white/90 text-black text-xs px-1 py-0.5">Front & Back</Badge>
          )}
          {hasMultipleColors && (
            <Badge className="absolute bottom-1 left-1 bg-white/90 text-black text-xs px-1 py-0.5">
              {product.colorVariants!.length} Colors
            </Badge>
          )}
        </div>

        <CardContent className="p-2">
          <h3 className="font-semibold mb-1 line-clamp-2 text-sm">{product.name}</h3>
          <div className="flex items-center gap-1 mb-1">
            <span className="font-bold text-lg text-primary">R{product.price}</span>
          </div>
          <Badge variant="outline" className="text-xs border-primary text-primary mb-1">
            {product.category === "football-tees" ? "24/25 Season" : "Premium Quality"}
          </Badge>
          <p className="text-xs text-muted-foreground">
            Sizes: {product.sizes.slice(0, 3).join(", ")}
            {product.sizes.length > 3 ? "..." : ""}
          </p>
          {hasMultipleColors && (
            <div className="flex items-center gap-1 mt-1">
              {product.colorVariants!.slice(0, 3).map((variant, index) => (
                <div
                  key={index}
                  className="w-3 h-3 rounded-full border border-gray-300"
                  style={{ backgroundColor: variant.color }}
                  title={variant.colorName}
                />
              ))}
              {product.colorVariants!.length > 3 && (
                <span className="text-xs text-muted-foreground">+{product.colorVariants!.length - 3}</span>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="p-2 pt-0">
          <Button
            className="w-full bg-primary text-black hover:bg-primary/90 text-xs py-1 h-8"
            onClick={() => setShowProductDetail(true)}
          >
            View Details
          </Button>
        </CardFooter>
      </Card>

      <ProductDetailDialog product={product} open={showProductDetail} onOpenChange={setShowProductDetail} />
    </>
  )
}
