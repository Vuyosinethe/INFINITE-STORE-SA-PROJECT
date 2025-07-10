"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useCart } from "@/components/cart-provider"
import { Minus, Plus, Trash2, Tag, X, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface CartSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CartSheet({ open, onOpenChange }: CartSheetProps) {
  const {
    items,
    promoCode,
    promoCodeInput,
    discount,
    updateQuantity,
    removeItem,
    applyPromoCodeToCart,
    removePromoCode,
    setPromoCodeInput,
    getSubtotal,
    getTotal,
  } = useCart()

  const [promoError, setPromoError] = useState<string>("")
  const [promoSuccess, setPromoSuccess] = useState<string>("")

  const handleApplyPromoCode = () => {
    if (!promoCodeInput.trim()) {
      setPromoError("Please enter a promo code")
      return
    }

    const result = applyPromoCodeToCart(promoCodeInput.trim())

    if (result.success) {
      setPromoError("")
      setPromoSuccess("Promo code applied successfully!")
      setTimeout(() => setPromoSuccess(""), 3000)
    } else {
      setPromoError(result.error || "Invalid promo code")
      setPromoSuccess("")
    }
  }

  const handleRemovePromoCode = () => {
    removePromoCode()
    setPromoError("")
    setPromoSuccess("")
  }

  const handleCheckout = () => {
    // Redirect to checkout page instead of alert
    window.location.href = "/checkout"
    onOpenChange(false)
  }

  const subtotal = getSubtotal()
  const total = getTotal()

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
          <SheetDescription>
            {items.length === 0 ? "Your cart is empty" : `${items.length} item(s) in your cart`}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-auto py-4">
          {items.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No items in your cart yet.</p>
              <Button variant="outline" className="mt-4 bg-transparent" onClick={() => onOpenChange(false)}>
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex items-center gap-3 p-3 border rounded-lg">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{item.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Size: {item.size}</span>
                      <Badge variant="outline">R{item.price}</Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.size, Math.max(0, item.quantity - 1))}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeItem(item.id, item.size)}
                        className="ml-auto text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Promo Code Section */}
              <div className="border-t pt-4 space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Promo Code
                </h4>

                {!promoCode ? (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter promo code"
                        value={promoCodeInput}
                        onChange={(e) => {
                          setPromoCodeInput(e.target.value.toUpperCase())
                          setPromoError("")
                        }}
                        className="flex-1"
                      />
                      <Button onClick={handleApplyPromoCode} variant="outline" size="sm">
                        Apply
                      </Button>
                    </div>

                    {promoError && (
                      <Alert variant="destructive">
                        <AlertDescription>{promoError}</AlertDescription>
                      </Alert>
                    )}

                    {promoSuccess && (
                      <Alert className="border-green-200 bg-green-50">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">{promoSuccess}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            {promoCode.code}
                          </Badge>
                          <span className="text-sm font-medium text-green-800">
                            -
                            {promoCode.discountType === "percentage"
                              ? `${promoCode.discount}%`
                              : `R${promoCode.discount}`}
                          </span>
                        </div>
                        <p className="text-xs text-green-600 mt-1">{promoCode.description}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRemovePromoCode}
                        className="text-green-700 hover:text-green-800"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <SheetFooter className="border-t pt-4">
            <div className="w-full space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Subtotal:</span>
                  <span>R{subtotal.toFixed(2)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between items-center text-green-600">
                    <span>Discount:</span>
                    <span>-R{discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between items-center text-lg font-semibold border-t pt-2">
                  <span>Total:</span>
                  <span>R{total.toFixed(2)}</span>
                </div>
              </div>

              <Button className="w-full" size="lg" onClick={handleCheckout}>
                Proceed to Checkout
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}
