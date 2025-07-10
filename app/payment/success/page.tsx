"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Package, Home } from "lucide-react"
import Link from "next/link"

interface PaymentDetails {
  id: string
  reference: string
  status: string
  amount: number
  description: string
  created_at: string
  customer: {
    name: string
    email: string
  }
}

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reference = searchParams.get("reference")
  const paymentId = searchParams.get("payment_id")

  useEffect(() => {
    const verifyPayment = async () => {
      if (!reference && !paymentId) {
        setError("No payment reference found")
        setLoading(false)
        return
      }

      try {
        const params = new URLSearchParams()
        if (paymentId) params.append("payment_id", paymentId)
        if (reference) params.append("reference", reference)

        const response = await fetch(`/api/payfast/verify?${params}`)
        const data = await response.json()

        if (data.success && data.valid) {
          setPaymentDetails(data.payment)
        } else {
          setError(data.error || "Payment verification failed")
        }
      } catch (err) {
        setError("Failed to verify payment")
        console.error("Payment verification error:", err)
      } finally {
        setLoading(false)
      }
    }

    verifyPayment()
  }, [reference, paymentId])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold mb-2">Verifying Payment...</h1>
          <p className="text-muted-foreground">Please wait while we confirm your payment.</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Verification Error</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <Button asChild variant="outline">
              <Link href="/">Return Home</Link>
            </Button>
            <Button asChild>
              <Link href="/about">Contact Support</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-green-600 mb-2">Payment Successful!</h1>
          <p className="text-lg text-muted-foreground">
            Thank you for your purchase. Your payment has been processed successfully.
          </p>
        </div>

        {/* Payment Details */}
        {paymentDetails && (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Payment Confirmation</CardTitle>
                <Badge className="bg-green-100 text-green-800">PAYMENT SUCCESSFUL</Badge>
              </div>
              <CardDescription>Your transaction has been completed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Payment ID</p>
                  <p className="font-mono text-sm">{paymentDetails.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Order Reference</p>
                  <p className="font-mono text-sm">{paymentDetails.reference}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Amount Paid</p>
                  <p className="text-lg font-bold">R{paymentDetails.amount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Payment Date</p>
                  <p className="text-sm">{new Date(paymentDetails.created_at).toLocaleString()}</p>
                </div>
              </div>

              {paymentDetails.description && (
                <div className="border-t pt-4">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Order Description</p>
                  <p className="text-sm">{paymentDetails.description}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Next Steps */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              What's Next?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-semibold text-blue-600">1</span>
                </div>
                <div>
                  <h4 className="font-medium">Order Processing</h4>
                  <p className="text-sm text-muted-foreground">
                    We'll prepare your items for shipment within 24 hours.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-semibold text-orange-600">2</span>
                </div>
                <div>
                  <h4 className="font-medium">Shipping Notification</h4>
                  <p className="text-sm text-muted-foreground">
                    You'll receive an email with tracking information once your order ships.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-semibold text-green-600">3</span>
                </div>
                <div>
                  <h4 className="font-medium">Delivery</h4>
                  <p className="text-sm text-muted-foreground">
                    Your order will be delivered within 3-5 business days.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-primary text-black hover:bg-primary/90">
            <Link href="/track-order" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Track Your Order
            </Link>
          </Button>

          <Button asChild variant="outline">
            <Link href="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Continue Shopping
            </Link>
          </Button>
        </div>

        {/* Email Confirmation Notice */}
        <div className="mt-8 p-4 bg-muted/50 rounded-lg text-center">
          <p className="text-sm text-muted-foreground">A confirmation email will be sent to you shortly.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Need help? Contact us on WhatsApp at{" "}
            <a href="https://wa.me/27737624156" className="text-primary hover:underline">
              +27 73 762 4156
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
