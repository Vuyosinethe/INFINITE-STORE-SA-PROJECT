'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { MinusIcon, PlusIcon, XIcon } from 'lucide-react'
import { Product, ColorVariant } from '@/lib/products'
import { useCart } from '@/components/cart-provider'
import { useToast } from '@/components/ui/use-toast'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

interface ProductDetailDialogProps {
  product: Product
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductDetailDialog({ product, open, onOpenChange }: ProductDetailDialogProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<ColorVariant | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [mainImage, setMainImage] = useState(product.image)
  const { addItem } = useCart()
  const { toast } = useToast()

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0])
      setQuantity(1)
      setMainImage(product.image)
      if (product.colorVariants && product.colorVariants.length > 0) {
        setSelectedColor(product.colorVariants[0])
      } else {
        setSelectedColor(null)
      }
    }
  }, [product])

  useEffect(() => {
    if (selectedColor) {
      setMainImage(selectedColor.image)
    } else if (product) {
      setMainImage(product.image)
    }
  }, [selectedColor, product])

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({
        title: 'Please select a size.',
        variant: 'destructive',
      })
      return
    }

    const itemToAdd = {
      ...product,
      selectedSize,
      selectedColor: selectedColor ? selectedColor.colorName : undefined,
      quantity,
      image: selectedColor ? selectedColor.image : product.image,
    }
    addItem(itemToAdd)
    toast({
      title: `${quantity} x ${product.name} (${selectedSize}) added to cart!`,
      description: 'You can view your cart by clicking the cart icon in the top right.',
    })
    onOpenChange(false)
  }

  const handleImageClick = (imagePath: string) => {
    setMainImage(imagePath)
  }

  const currentImages = selectedColor?.additionalImages || []
  if (selectedColor) {
    currentImages.unshift(selectedColor.image)
  } else {
    if (product.image) currentImages.unshift(product.image)
    if (product.backImage) currentImages.push(product.backImage)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 sm:p-6">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 rounded-full"
          onClick={() => onOpenChange(false)}
        >
          <XIcon className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </Button>
        <div className="grid md:grid-cols-2 gap-6 p-4 md:p-0">
          <div className="flex flex-col items-center">
            <div className="relative w-full max-w-md aspect-[4/3] mb-4">
              <Image
                src={mainImage || "/placeholder.svg"}
                alt={product.name}
                fill
                style={{ objectFit: 'contain' }}
                className="rounded-lg"
              />
            </div>
            <div className="grid grid-cols-4 gap-2 w-full max-w-md">
              {currentImages.map((img, index) => (
                <div
                  key={index}
                  className={cn(
                    'relative w-full aspect-square cursor-pointer rounded-lg overflow-hidden border-2',
                    mainImage === img ? 'border-primary' : 'border-transparent'
                  )}
                  onClick={() => handleImageClick(img)}
                >
                  <Image
                    src={img || "/placeholder.svg"}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4 p-4">
            <h2 className="text-3xl font-bold">{product.name}</h2>
            <p className="text-2xl font-semibold">R{product.price}</p>
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-3 h-auto">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="delivery">Delivery</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="pt-4 text-gray-600">
                <p>
                  Experience unparalleled comfort and style with the {product.name}. Crafted with
                  premium materials and designed for optimal performance, this product is perfect
                  for both casual wear and athletic activities.
                </p>
              </TabsContent>
              <TabsContent value="details" className="pt-4 text-gray-600">
                <ul className="list-disc pl-5">
                  <li>Material: High-quality breathable fabric</li>
                  <li>Sole: Durable rubber for excellent grip</li>
                  <li>Cushioning: Advanced air sole technology for superior comfort</li>
                  <li>Fit: True to size, available in various sizes</li>
                </ul>
              </TabsContent>
              <TabsContent value="delivery" className="pt-4 text-gray-600">
                <p>
                  Enjoy fast and reliable delivery straight to your doorstep. Orders are typically
                  processed within 1-2 business days and delivered within 3-7 business days
                  depending on your location.
                </p>
              </TabsContent>
            </Tabs>
            {product.colorVariants && product.colorVariants.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Colors</h3>
                <div className="flex gap-2">
                  {product.colorVariants.map((variant) => (
                    <Button
                      key={variant.color}
                      variant="outline"
                      className={cn(
                        'w-8 h-8 rounded-full p-0 border-2',
                        selectedColor?.color === variant.color ? 'border-primary' : 'border-gray-300'
                      )}
                      style={{ backgroundColor: variant.color }}
                      onClick={() => setSelectedColor(variant)}
                      aria-label={`Select color ${variant.colorName}`}
                    >
                      <span className="sr-only">{variant.colorName}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold mb-2">Size</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? 'default' : 'outline'}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Quantity</h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <MinusIcon className="h-4 w-4" />
                  <span className="sr-only">Decrease quantity</span>
                </Button>
                <span className="text-lg font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <PlusIcon className="h-4 w-4" />
                  <span className="sr-only">Increase quantity</span>
                </Button>
              </div>
            </div>
            <Button size="lg" onClick={handleAddToCart}>
              Add to Cart
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
