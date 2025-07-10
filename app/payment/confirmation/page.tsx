"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock, Package, ArrowRight } from "lucide-react"
import Link from "next/link"

interface PaymentStatus {
  id: string
  status: "completed" | "failed" | "pending" | "cancelled"
  amount: number
  currency: string
  reference: string
  customer: {
    email: string
    name: string
  }
  created_at: string
}

export default function PaymentConfirmationPage() {
  const searchParams = useSearchParams()
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const paymentId = searchParams.get("payment_id")
  const reference = searchParams.get("reference")
  const status = searchParams.get("status")

  useEffect(() => {
    const verifyPayment = async () => {
      if (!paymentId && !reference) {
        setError("No payment information found")
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/payment/verify?payment_id=${paymentId}&reference=${reference}`)
        const data = await response.json()

        if (data.success) {
          setPaymentStatus(data.payment)
        } else {
          setError(data.error || "Payment verification failed")
        }
      } catch (err) {
        setError("Failed to verify payment status")
        console.error("Payment verification error:", err)
      } finally {
        setLoading(false)
      }
    }

    verifyPayment()
  }, [paymentId, reference])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-16 w-16 text-green-500" />
      case "failed":
        return <XCircle className="h-16 w-16 text-red-500" />
      case "pending":
        return <Clock className="h-16 w-16 text-yellow-500" />
      case "cancelled":
        return <XCircle className="h-16 w-16 text-gray-500" />
      default:
        return <Clock className="h-16 w-16 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "failed":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusMessage = (status: string) => {
    switch (status) {
      case "completed":
        return {
          title: "Payment Successful!",
          description: "Your payment has been processed successfully. You will receive a confirmation email shortly.",
        }
      case "failed":
        return {
          title: "Payment Failed",
          description: "Your payment could not be processed. Please try again or contact support.",
        }
      case "pending":
        return {
          title: "Payment Pending",
          description: "Your payment is being processed. This may take a few minutes.",
        }
      case "cancelled":
        return {
          title: "Payment Cancelled",
          description: "Your payment was cancelled. You can try again when ready.",
        }
      default:
        return {
          title: "Payment Status Unknown",
          description: "We are checking your payment status. Please wait.",
        }
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold mb-2">Verifying Payment...</h1>
          <p className="text-muted-foreground">Please wait while we confirm your payment status.</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Error</h1>
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

  const statusInfo = getStatusMessage(paymentStatus?.status || status || "unknown")

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          {getStatusIcon(paymentStatus?.status || status || "unknown")}
          <h1 className="text-3xl font-bold mt-4 mb-2">{statusInfo.title}</h1>
          <p className="text-muted-foreground">{statusInfo.description}</p>
        </div>

        {paymentStatus && (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Payment Details</CardTitle>
                <Badge className={getStatusColor(paymentStatus.status)}>{paymentStatus.status.toUpperCase()}</Badge>
              </div>
              <CardDescription>Transaction information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Payment ID</p>
                  <p className="font-mono text-sm">{paymentStatus.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Order Reference</p>
                  <p className="font-mono text-sm">{paymentStatus.reference}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Amount</p>
                  <p className="text-lg font-bold">
                    {paymentStatus.currency} {(paymentStatus.amount / 100).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date</p>
                  <p className="text-sm">{new Date(paymentStatus.created_at).toLocaleString()}</p>
                </div>
              </div>

              {paymentStatus.customer && (
                <div className="border-t pt-4">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Customer Information</p>
                  <p className="text-sm">{paymentStatus.customer.name}</p>
                  <p className="text-sm text-muted-foreground">{paymentStatus.customer.email}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="text-center space-y-4">
          {paymentStatus?.status === "completed" && (
            <>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 text-green-800 mb-2">
                  <Package className="h-5 w-5" />
                  <span className="font-medium">What's Next?</span>
                </div>
                <p className="text-sm text-green-700">
                  Your order is being processed and will be shipped within 1-2 business days. You can track your order
                  using the reference number above.
                </p>
              </div>

              <div className="flex gap-4 justify-center">
                <Button asChild>
                  <Link href="/track-order" className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Track Your Order
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/">Continue Shopping</Link>
                </Button>
              </div>
            </>
          )}

          {paymentStatus?.status === "failed" && (
            <div className="flex gap-4 justify-center">
              <Button asChild>
                <Link href="/" className="flex items-center gap-2">
                  Try Again
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/about">Contact Support</Link>
              </Button>
            </div>
          )}

          {(paymentStatus?.status === "cancelled" || paymentStatus?.status === "pending") && (
            <div className="flex gap-4 justify-center">
              <Button asChild>
                <Link href="/">Return to Store</Link>
              </Button>
              {paymentStatus?.status === "pending" && (
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Refresh Status
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
