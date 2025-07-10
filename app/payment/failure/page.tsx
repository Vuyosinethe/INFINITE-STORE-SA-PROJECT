"use client"

import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { XCircle, ArrowLeft, MessageCircle, RefreshCw } from "lucide-react"
import Link from "next/link"

export default function PaymentFailurePage() {
  const searchParams = useSearchParams()
  const reference = searchParams.get("reference")
  const reason = searchParams.get("reason")

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        {/* Failure Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-red-600 mb-2">Payment Failed</h1>
          <p className="text-lg text-muted-foreground">Unfortunately, your payment could not be processed.</p>
        </div>

        {/* Failure Details */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>What Happened?</CardTitle>
            <CardDescription>Your payment was not completed successfully</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {reference && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Order Reference</p>
                <p className="font-mono text-sm">{reference}</p>
              </div>
            )}

            {reason && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Failure Reason</p>
                <p className="text-sm">{reason}</p>
              </div>
            )}

            <div className="space-y-2">
              <h4 className="font-medium">Common reasons for payment failure:</h4>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Insufficient funds in your account</li>
                <li>• Card declined by your bank</li>
                <li>• Incorrect card details entered</li>
                <li>• Network connection issues</li>
                <li>• Card expired or blocked</li>
                <li>• Transaction limit exceeded</li>
              </ul>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Don't worry!</h4>
              <p className="text-sm text-blue-700">
                No charges have been made to your account. Your cart items are still saved and you can try again with a
                different payment method.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild className="bg-primary text-black hover:bg-primary/90 flex-1">
              <Link href="/checkout" className="flex items-center justify-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Try Payment Again
              </Link>
            </Button>

            <Button asChild variant="outline" className="flex-1 bg-transparent">
              <Link href="/" className="flex items-center justify-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Continue Shopping
              </Link>
            </Button>
          </div>

          <div className="text-center">
            <Button asChild variant="ghost">
              <a
                href="https://wa.me/27737624156"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                Need Help? Contact Support
              </a>
            </Button>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium mb-2">Payment Issues?</h4>
          <p className="text-sm text-muted-foreground mb-3">
            If you continue to experience payment problems, please try:
          </p>
          <ul className="text-sm text-muted-foreground space-y-1 ml-4 mb-3">
            <li>• Using a different payment method</li>
            <li>• Checking with your bank about the transaction</li>
            <li>• Ensuring your card details are correct</li>
            <li>• Trying again in a few minutes</li>
          </ul>
          <div className="flex flex-col sm:flex-row gap-2 text-sm">
            <span className="text-muted-foreground">Contact us:</span>
            <div className="space-x-4">
              <a href="https://wa.me/27737624156" className="text-primary hover:underline">
                WhatsApp: +27 73 762 4156
              </a>
              <a href="mailto:info@infinitestore.co.za" className="text-primary hover:underline">
                Email: info@infinitestore.co.za
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
