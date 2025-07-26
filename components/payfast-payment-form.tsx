"use client"

import type React from "react" // Changed from 'import type React from "react"'
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "@/components/cart-provider"
import { Loader2, CheckCircle, XCircle } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export default function PayFastPaymentForm() {
  const { cartItems, getTotalPrice, clearCart } = useCart()
  const [customerName, setCustomerName] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "success" | "failure">("idle")
  const [paymentMessage, setPaymentMessage] = useState("")

  const totalPrice = getTotalPrice()

  const generateReference = () => {
    const timestamp = Date.now()
    const random = Math.floor(Math.random() * 1000000000)
    return `INF${timestamp}${random}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setPaymentStatus("idle")
    setPaymentMessage("")

    if (!customerName || !customerEmail || !customerPhone || totalPrice <= 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all customer details and ensure your cart is not empty.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    const paymentReference = generateReference()

    const paymentData = {
      amount: totalPrice,
      description: `Order from iNfinite store.SA`,
      customerName,
      customerEmail,
      customerPhone,
      reference: paymentReference,
      items: cartItems.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        size: item.selectedSize,
      })),
    }

    console.log("=== Frontend Payment Request ===")
    console.log("Payment request:", paymentData)
    console.log("Current URL:", window.location.href)
    console.log("API URL: /api/payfast/initiate")

    try {
      const response = await fetch("/api/payfast/initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("API Error Response:", errorData)
        throw new Error(errorData.message || "Failed to initiate payment")
      }

      const data = await response.json()
      console.log("API Success Response:", data)

      if (data.success && data.paymentUrl && data.paymentData) {
        // Create a form dynamically and submit it to PayFast
        const form = document.createElement("form")
        form.method = "POST"
        form.action = data.paymentUrl
        form.target = "_self" // Open in the same tab

        for (const key in data.paymentData) {
          if (Object.prototype.hasOwnProperty.call(data.paymentData, key)) {
            const input = document.createElement("input")
            input.type = "hidden"
            input.name = key
            input.value = data.paymentData[key]
            form.appendChild(input)
          }
        }

        document.body.appendChild(form)
        form.submit()
        // The page will redirect, so no need to set loading/status here
      } else {
        setPaymentStatus("failure")
        setPaymentMessage(data.message || "Payment initiation failed.")
        toast({
          title: "Payment Failed",
          description: data.message || "Could not initiate payment with PayFast.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("=== Payment Error ===")
      console.error("Error:", error)
      console.error("Error message:", error instanceof Error ? error.message : "Unknown error")

      setPaymentStatus("failure")
      setPaymentMessage(
        error instanceof Error
          ? `Payment initiation failed: ${error.message}. Please check your network and try again.`
          : "An unexpected error occurred during payment initiation.",
      )
      toast({
        title: "Payment Error",
        description:
          error instanceof Error
            ? `Payment initiation failed: ${error.message}. Please check your network and try again.`
            : "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Customer Information</CardTitle>
        <CardDescription>Enter your details to proceed with the payment.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john.doe@example.com"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+27 12 345 6789"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label>Order Summary</Label>
            <div className="border rounded-md p-4">
              {cartItems.length === 0 ? (
                <p className="text-muted-foreground">Your cart is empty.</p>
              ) : (
                <ul className="space-y-2">
                  {cartItems.map((item) => (
                    <li key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.name} ({item.selectedSize}) x {item.quantity}
                      </span>
                      <span>R{(item.price * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex justify-between font-bold mt-4">
                <span>Total:</span>
                <span>R{totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading || cartItems.length === 0}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Processing Payment..." : `Pay Now R${totalPrice.toFixed(2)}`}
          </Button>

          {paymentStatus === "success" && (
            <div className="flex items-center gap-2 text-green-500">
              <CheckCircle className="h-5 w-5" />
              <span>{paymentMessage}</span>
            </div>
          )}
          {paymentStatus === "failure" && (
            <div className="flex items-center gap-2 text-red-500">
              <XCircle className="h-5 w-5" />
              <span>{paymentMessage}</span>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
