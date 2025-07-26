"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Loader2, CreditCard, Shield, ShoppingCart, AlertCircle, CheckCircle, AlertTriangle, Bug } from "lucide-react"
import { useCart } from "@/components/cart-provider"

interface PaymentFormData {
  customerName: string
  customerEmail: string
  customerPhone: string
  description: string
}

interface PayFastPaymentFormProps {
  amount?: number
  description?: string
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  reference?: string
  items?: Array<{
    name: string
    quantity: number
    price: number
    size?: string
  }>
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function PayFastPaymentForm({
  amount,
  description,
  customerName,
  customerEmail,
  customerPhone,
  reference,
  items,
  onSuccess,
  onError,
}: PayFastPaymentFormProps) {
  const { items: cartItems, promoCode, discount, getSubtotal, getTotal, clearCart } = useCart()

  const [formData, setFormData] = useState<PaymentFormData>({
    customerName: customerName ?? "",
    customerEmail: customerEmail ?? "",
    customerPhone: customerPhone ?? "",
    description: description ?? "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [debugInfo, setDebugInfo] = useState("")
  const [paymentEnvironment, setPaymentEnvironment] = useState<"sandbox" | "production" | null>(null)

  const handleInputChange = (field: keyof PaymentFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  const validateForm = (): boolean => {
    if (!formData.customerName.trim()) {
      setError("Customer name is required")
      return false
    }
    if (!formData.customerEmail.trim()) {
      setError("Customer email is required")
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      setError("Please enter a valid email address")
      return false
    }
    const hasAnyItems = (items ?? cartItems).length > 0
    if (!hasAnyItems) {
      setError("Your cart is empty")
      return false
    }
    return true
  }

  const handlePayment = async () => {
    if (!validateForm()) return

    setLoading(true)
    setError("")
    setDebugInfo("")

    try {
      const orderReference = reference ?? `INF${Date.now()}`
      const total = amount ?? getTotal()
      const itemsForRequest = items ?? cartItems

      // Validate data before sending
      if (total <= 0) {
        throw new Error("Invalid total amount")
      }

      if (itemsForRequest.length === 0) {
        throw new Error("No items in cart")
      }

      const paymentRequest = {
        amount: total,
        description: formData.description || `Order from iNfinite store.SA - ${itemsForRequest.length} item(s)`,
        customerName: formData.customerName.trim(),
        customerEmail: formData.customerEmail.trim(),
        customerPhone: formData.customerPhone.trim(),
        reference: orderReference,
        items: itemsForRequest.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          size: item.size,
        })),
      }

      console.log("=== Frontend Payment Request ===")
      console.log("Payment request:", JSON.stringify(paymentRequest, null, 2))
      console.log("Current URL:", window.location.href)
      console.log("API URL:", "/api/payfast/initiate")

      setDebugInfo(`Sending payment request for ${orderReference} - R${total.toFixed(2)}`)

      const response = await fetch("/api/payfast/initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(paymentRequest),
      })

      console.log("=== Response Details ===")
      console.log("Response status:", response.status)
      console.log("Response statusText:", response.statusText)
      console.log("Response headers:", Object.fromEntries(response.headers.entries()))
      console.log("Response ok:", response.ok)

      // Try to get response text first
      const responseText = await response.text()
      console.log("Raw response text:", responseText)

      let result
      try {
        result = JSON.parse(responseText)
        console.log("Parsed response data:", JSON.stringify(result, null, 2))
      } catch (parseError) {
        console.error("Failed to parse response as JSON:", parseError)
        console.error("Response text was:", responseText)
        throw new Error(`Invalid JSON response: ${responseText.substring(0, 200)}`)
      }

      if (!response.ok) {
        console.error("API Error Response:", result)
        setDebugInfo(`API Error: ${response.status} ${response.statusText} - ${JSON.stringify(result)}`)

        // Handle specific error codes
        if (response.status === 403) {
          throw new Error("Access forbidden. Check your PayFast credentials and permissions.")
        } else if (response.status === 400) {
          throw new Error(result.error || result.message || "Bad request - invalid payment data")
        } else {
          throw new Error(result.error || result.message || `HTTP ${response.status}: ${response.statusText}`)
        }
      }

      if (result.success && result.paymentUrl && result.paymentData) {
        console.log("=== Payment Success ===")
        console.log("Environment:", result.environment)
        console.log("Payment URL:", result.paymentUrl)
        console.log("Has signature:", !!result.paymentData.signature)
        console.log("Field count:", result.debug?.fieldCount)
        console.log("Using production credentials:", result.debug?.usingProductionCredentials)

        setPaymentEnvironment(result.environment)
        setDebugInfo(`Payment initiated successfully. Redirecting to ${result.environment} environment...`)

        // Store order details in localStorage for success page
        localStorage.setItem(
          "pendingOrder",
          JSON.stringify({
            reference: orderReference,
            amount: total,
            items: itemsForRequest,
            customer: {
              name: formData.customerName,
              email: formData.customerEmail,
              phone: formData.customerPhone,
            },
            timestamp: new Date().toISOString(),
          }),
        )

        // Create and submit form to PayFast
        const form = document.createElement("form")
        form.method = "POST"
        form.action = result.paymentUrl
        form.style.display = "none"

        // Add all payment data as hidden inputs
        Object.entries(result.paymentData).forEach(([key, value]) => {
          const input = document.createElement("input")
          input.type = "hidden"
          input.name = key
          input.value = value.toString()
          form.appendChild(input)
        })

        document.body.appendChild(form)

        // Clear cart before redirecting (payment initiated successfully)
        clearCart()

        console.log("Submitting form to PayFast...")
        console.log("Form data being submitted:", Object.fromEntries(new FormData(form)))

        // Submit form to PayFast
        form.submit()

        // Clean up
        setTimeout(() => {
          if (document.body.contains(form)) {
            document.body.removeChild(form)
          }
        }, 1000)

        onSuccess?.()
      } else {
        console.error("Invalid response format:", result)
        setDebugInfo(`Invalid response: ${JSON.stringify(result)}`)
        throw new Error(result.error || "Payment initiation failed - invalid response format")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Payment failed"
      console.error("=== Payment Error ===")
      console.error("Error:", err)
      console.error("Error message:", errorMessage)

      setError(errorMessage)
      setDebugInfo(`Error: ${errorMessage}`)
      onError?.(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const subtotal = getSubtotal()
  const total = getTotal()
  const hasItems = cartItems.length > 0
  const isTestEnvironment = process.env.NODE_ENV !== "production"
  const hasAnyItems = (items ?? cartItems).length > 0

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Debug Information (development only) */}
      {(isTestEnvironment || debugInfo) && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Bug className="h-5 w-5" />
              Debug Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm text-blue-700">
                <strong>Cart Items:</strong> {cartItems.length}
              </div>
              <div className="text-sm text-blue-700">
                <strong>Total:</strong> R{total.toFixed(2)}
              </div>
              <div className="text-sm text-blue-700">
                <strong>Environment:</strong> {process.env.NODE_ENV}
              </div>
              <div className="text-sm text-blue-700">
                <strong>Current URL:</strong> {typeof window !== "undefined" ? window.location.href : "N/A"}
              </div>
              {debugInfo && (
                <div className="text-xs text-blue-600 bg-blue-100 p-2 rounded">
                  <strong>Status:</strong> {debugInfo}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Environment Info */}
      {paymentEnvironment && (
        <Card
          className={
            paymentEnvironment === "production" ? "border-green-200 bg-green-50" : "border-orange-200 bg-orange-50"
          }
        >
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <CheckCircle
                className={`h-5 w-5 ${paymentEnvironment === "production" ? "text-green-600" : "text-orange-600"}`}
              />
              <span
                className={`font-medium ${paymentEnvironment === "production" ? "text-green-800" : "text-orange-800"}`}
              >
                {paymentEnvironment === "production"
                  ? "🔒 LIVE Payment Environment - Real money will be charged!"
                  : "⚠️ Sandbox Testing Environment - Safe for testing"}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Order Summary
          </CardTitle>
          <CardDescription>
            {hasAnyItems
              ? `${(items ?? cartItems).length} item(s) - Total: R${total.toFixed(2)}`
              : "Your cart is empty"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!hasAnyItems ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">Your cart is empty</p>
              <p className="text-sm text-muted-foreground mb-4">
                Add some items to your cart before proceeding to checkout.
              </p>
              <Button variant="outline" onClick={() => (window.location.href = "/")}>
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {(items ?? cartItems).map((item, index) => (
                <div key={`${item.id}-${item.size}-${index}`} className="flex items-center gap-3 p-3 border rounded-lg">
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
                      <span>Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">R{(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                </div>
              ))}

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Subtotal:</span>
                  <span>R{subtotal.toFixed(2)}</span>
                </div>

                {discount > 0 && promoCode && (
                  <div className="flex justify-between items-center text-green-600">
                    <span>Discount ({promoCode.code}):</span>
                    <span>-R{discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between items-center text-lg font-semibold border-t pt-2">
                  <span>Total:</span>
                  <span>R{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Customer Information Form */}
      {hasAnyItems && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Customer Information
            </CardTitle>
            <CardDescription>Enter your details for payment and order confirmation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">Full Name *</Label>
                <Input
                  id="customerName"
                  type="text"
                  placeholder="John Doe"
                  value={formData.customerName}
                  onChange={(e) => handleInputChange("customerName", e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerEmail">Email Address *</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.customerEmail}
                  onChange={(e) => handleInputChange("customerEmail", e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="customerPhone">Phone Number (Optional)</Label>
              <Input
                id="customerPhone"
                type="tel"
                placeholder="+27 12 345 6789"
                value={formData.customerPhone}
                onChange={(e) => handleInputChange("customerPhone", e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Order Notes (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Any special instructions for your order..."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                disabled={loading}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Section */}
      {hasAnyItems && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Complete Payment
              </CardTitle>
              <Badge
                variant="outline"
                className={
                  paymentEnvironment === "production"
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-orange-50 text-orange-700 border-orange-200"
                }
              >
                {paymentEnvironment === "production" ? "Live Mode" : "Test Mode"}
              </Badge>
            </div>
            <CardDescription>
              Secure payment processing powered by PayFast
              {paymentEnvironment === "production" ? " (Live Environment)" : " (Testing Environment)"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Payment Summary */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Amount:</span>
                <span className="text-2xl font-bold">R{total.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Order Reference:</span>
                <span className="text-sm font-mono">{reference ?? `INF${Date.now()}`}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Items:</span>
                <span className="text-sm">
                  {(items ?? cartItems).length} item{(items ?? cartItems).length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            {/* Security Notice */}
            <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
              <Shield className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-green-800">Secure Payment</p>
                <p className="text-xs text-green-700">
                  Your payment is processed securely through PayFast's encrypted payment gateway. We never store your
                  card details.
                </p>
              </div>
            </div>

            {/* Environment Notice */}
            {paymentEnvironment !== "production" && (
              <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
                <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-orange-800">Test Environment</p>
                  <p className="text-xs text-orange-700">
                    This is a test payment using PayFast sandbox. Use test card numbers. No real charges will be made.
                  </p>
                  <div className="text-xs text-orange-600 mt-2">
                    <p>
                      <strong>Test Cards:</strong>
                    </p>
                    <p>• Success: 4000000000000002 (Visa)</p>
                    <p>• Decline: 4000000000000010 (Insufficient funds)</p>
                    <p>• CVV: Any 3 digits • Expiry: Any future date</p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Payment Button */}
            <Button
              onClick={handlePayment}
              disabled={loading || !hasAnyItems}
              className="w-full h-12 text-lg"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-5 w-5" />
                  {paymentEnvironment === "production" ? "Pay" : "Test Pay"} R{total.toFixed(2)} with PayFast
                </>
              )}
            </Button>

            {/* Payment Methods */}
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-2">Accepted payment methods:</p>
              <div className="flex justify-center gap-2 text-xs text-muted-foreground">
                <span>Visa</span> • <span>Mastercard</span> • <span>EFT</span> • <span>Instant EFT</span>
              </div>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              By clicking "{paymentEnvironment === "production" ? "Pay" : "Test Pay"}", you will be redirected to
              PayFast's {paymentEnvironment === "production" ? "secure payment" : "sandbox"} environment to complete
              your {paymentEnvironment === "production" ? "" : "test "}transaction. Your cart will be cleared and order
              details saved for tracking.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
