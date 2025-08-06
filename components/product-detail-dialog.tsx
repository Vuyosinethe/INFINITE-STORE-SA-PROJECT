"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AddToCartDialog } from "@/components/add-to-cart-dialog"
import type { Product, ColorVariant } from "@/lib/products"

interface ProductDetailDialogProps {
  product: Product
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductDetailDialog({ product, open, onOpenChange }: ProductDetailDialogProps) {
  const [showAddToCart, setShowAddToCart] = useState(false)
  const [selectedColor, setSelectedColor] = useState<ColorVariant | null>(
    product.colorVariants ? product.colorVariants[0] : null,
  )

  const currentImage = selectedColor?.image || product.image
  const currentBackImage = product.backImage
  const additionalImages = selectedColor?.additionalImages || []

  const hasMultipleViews = currentBackImage || additionalImages.length > 0

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{product.name}</DialogTitle>
            <DialogDescription>
              {product.category === "football-tees"
                ? "24/25 Season - Premium Quality Jersey"
                : "Premium Quality Sneaker"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Image Section */}
            <div className="space-y-4">
              {hasMultipleViews ? (
                <Tabs defaultValue="main" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 md:grid-cols-3">
                    <TabsTrigger value="main">Main View</TabsTrigger>
                    {currentBackImage && <TabsTrigger value="back">Back View</TabsTrigger>}
                    {additionalImages.map((_, index) => (
                      <TabsTrigger key={index} value={`additional-${index}`}>
                        View {index + 2}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  <TabsContent value="main" className="mt-4">
                    <div className="relative aspect-square overflow-hidden rounded-lg border bg-gray-50">
                      <div className="absolute inset-0 overflow-hidden">
                        <Image
                          src={currentImage || "/placeholder.svg"}
                          alt={`${product.name} - Main`}
                          fill
                          className="object-contain"
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
                                    objectPosition: "center center",
                                    transform: "scale(1)", // Adjust scale as needed, but remove translateY
                                  }
                          }
                        />
                      </div>
                    </div>
                  </TabsContent>
                  {currentBackImage && (
                    <TabsContent value="back" className="mt-4">
                      <div className="relative aspect-square overflow-hidden rounded-lg border bg-gray-50">
                        <div className="absolute inset-0 overflow-hidden">
                          <Image
                            src={currentBackImage || "/placeholder.svg"}
                            alt={`${product.name} - Back`}
                            fill
                            className="object-contain"
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
                                      objectPosition: "center center",
                                      transform: "scale(1)", // Adjust scale as needed, but remove translateY
                                    }
                            }
                          />
                        </div>
                      </div>
                    </TabsContent>
                  )}
                  {additionalImages.map((image, index) => (
                    <TabsContent key={index} value={`additional-${index}`} className="mt-4">
                      <div className="relative aspect-square overflow-hidden rounded-lg border bg-gray-50">
                        <div className="absolute inset-0 overflow-hidden">
                          <Image
                            src={image || "/placeholder.svg"}
                            alt={`${product.name} - View ${index + 2}`}
                            fill
                            className="object-contain"
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
                                      objectPosition: "center center",
                                      transform: "scale(1)", // Adjust scale as needed, but remove translateY
                                    }
                            }
                          />
                        </div>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              ) : (
                <div className="relative aspect-square overflow-hidden rounded-lg border bg-gray-50">
                  <div className="absolute inset-0 overflow-hidden">
                    <Image
                      src={currentImage || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-contain"
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
                                objectPosition: "center center",
                                transform: "scale(1)", // Adjust scale as needed, but remove translateY
                              }
                      }
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Product Info Section */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  {product.isNewRelease && (
                    <Badge className="bg-primary text-black">
                      {product.category === "football-tees" ? "New 24/25" : "New Release"}
                    </Badge>
                  )}
                  {product.isHotDeal && <Badge className="bg-black text-white">Hot Deal</Badge>}
                  {product.isFeatured && (
                    <Badge variant="outline" className="border-primary text-primary">
                      Featured
                    </Badge>
                  )}
                </div>

                <div className="mb-4">
                  <span className="text-3xl font-bold text-primary">R1500</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    {product.category === "football-tees" ? "Premium authentic jersey" : "Premium quality sneaker"}
                  </p>
                </div>
              </div>

              {/* Color Selection */}
              {product.colorVariants && product.colorVariants.length > 1 && (
                <div>
                  <h3 className="font-semibold mb-3">Available Colors</h3>
                  <div className="flex flex-wrap gap-3">
                    {product.colorVariants.map((variant, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedColor(variant)}
                        className={`flex items-center gap-2 p-2 rounded-lg border transition-all ${
                          selectedColor === variant
                            ? "border-primary bg-primary/10"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div
                          className="w-6 h-6 rounded-full border-2 border-gray-300"
                          style={{ backgroundColor: variant.color }}
                        />
                        <span className="text-sm font-medium">{variant.colorName}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-semibold mb-2">Available Sizes</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <Badge key={size} variant="outline" className="px-3 py-1">
                      {size}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Product Features</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {product.category === "football-tees" ? (
                    <>
                      <li>• Official 24/25 season design</li>
                      <li>• Premium quality fabric</li>
                      <li>• Authentic team colors and logos</li>
                      <li>• Comfortable fit for all-day wear</li>
                      <li>• Machine washable</li>
                    </>
                  ) : (
                    <>
                      <li>• Premium quality materials</li>
                      <li>• Comfortable cushioning</li>
                      <li>• Durable construction</li>
                      <li>• Authentic Nike design</li>
                      <li>• Available in multiple sizes</li>
                    </>
                  )}
                </ul>
              </div>

              <div className="space-y-3">
                <Button
                  className="w-full bg-primary text-black hover:bg-primary/90"
                  size="lg"
                  onClick={() => setShowAddToCart(true)}
                >
                  Add to Cart - R1500
                </Button>
                <p className="text-xs text-center text-muted-foreground">Free delivery nationwide • 30-day returns</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AddToCartDialog product={product} open={showAddToCart} onOpenChange={setShowAddToCart} />
    </>
  )
}
