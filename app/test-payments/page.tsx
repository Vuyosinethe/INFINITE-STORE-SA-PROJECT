"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, XCircle, AlertCircle, CreditCard, TestTube } from "lucide-react"

interface TestScenario {
  name: string
  description: string
  amount: number
  expectedResult: "success" | "failure" | "cancel"
  testCard?: string
  icon: React.ReactNode
  color: string
}

const testScenarios: TestScenario[] = [
  {
    name: "Successful Payment",
    description: "Test a successful payment transaction",
    amount: 100.0,
    expectedResult: "success",
    testCard: "4000000000000002",
    icon: <CheckCircle className="h-5 w-5" />,
    color: "bg-green-100 text-green-800",
  },
  {
    name: "Failed Payment - Insufficient Funds",
    description: "Test payment failure due to insufficient funds",
    amount: 100.01,
    expectedResult: "failure",
    testCard: "4000000000000010",
    icon: <XCircle className="h-5 w-5" />,
    color: "bg-red-100 text-red-800",
  },
  {
    name: "Failed Payment - Declined Card",
    description: "Test payment failure due to card decline",
    amount: 100.02,
    expectedResult: "failure",
    testCard: "4000000000000028",
    icon: <XCircle className="h-5 w-5" />,
    color: "bg-red-100 text-red-800",
  },
  {
    name: "Cancelled Payment",
    description: "Test payment cancellation by user",
    amount: 100.03,
    expectedResult: "cancel",
    icon: <AlertCircle className="h-5 w-5" />,
    color: "bg-orange-100 text-orange-800",
  },
  {
    name: "Large Amount Success",
    description: "Test successful payment with larger amount",
    amount: 1500.0,
    expectedResult: "success",
    testCard: "4000000000000002",
    icon: <CheckCircle className="h-5 w-5" />,
    color: "bg-green-100 text-green-800",
  },
  {
    name: "Small Amount Success",
    description: "Test successful payment with small amount",
    amount: 25.5,
    expectedResult: "success",
    testCard: "4000000000000002",
    icon: <CheckCircle className="h-5 w-5" />,
    color: "bg-green-100 text-green-800",
  },
]

export default function TestPaymentsPage() {
  const [customAmount, setCustomAmount] = useState<string>("100.00")
  const [customerName, setCustomerName] = useState("Test Customer")
  const [customerEmail, setCustomerEmail] = useState("test@example.com")
  const [customerPhone, setCustomerPhone] = useState("+27123456789")
  const [loading, setLoading] = useState<string | null>(null)

  const initiateTestPayment = async (scenario: TestScenario, customData?: any) => {
    const testReference = `TEST-${Date.now()}-${scenario.name.replace(/\s+/g, "-").toUpperCase()}`
    setLoading(testReference)

    try {
      const paymentData = {
        amount: customData?.amount || scenario.amount,
        description: `Test Payment: ${scenario.name}`,
        customerName: customData?.customerName || customerName,
        customerEmail: customData?.customerEmail || customerEmail,
        customerPhone: customData?.customerPhone || customerPhone,
        reference: testReference,
        items: [
          {
            name: `Test Item - ${scenario.name}`,
            quantity: 1,
            price: customData?.amount || scenario.amount,
            size: "Test Size",
          },
        ],
      }

      console.log("Initiating test payment:", paymentData)

      const response = await fetch("/api/payfast/initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      })

      const result = await response.json()

      if (result.success) {
        // Create and submit PayFast form
        const form = document.createElement("form")
        form.method = "POST"
        form.action = result.paymentUrl
        form.target = "_blank" // Open in new tab for testing

        // Add all payment data as hidden fields
        Object.entries(result.paymentData).forEach(([key, value]) => {
          const input = document.createElement("input")
          input.type = "hidden"
          input.name = key
          input.value = String(value)
          form.appendChild(input)
        })

        document.body.appendChild(form)
        form.submit()
        document.body.removeChild(form)

        console.log("Payment form submitted successfully")
      } else {
        console.error("Payment initiation failed:", result)
        alert(`Payment initiation failed: ${result.error}`)
      }
    } catch (error) {
      console.error("Error initiating payment:", error)
      alert("Error initiating payment. Check console for details.")
    } finally {
      setLoading(null)
    }
  }

  const initiateCustomPayment = () => {
    const amount = Number.parseFloat(customAmount)
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount")
      return
    }

    const customScenario: TestScenario = {
      name: "Custom Test",
      description: "Custom test payment",
      amount,
      expectedResult: "success",
      icon: <CreditCard className="h-5 w-5" />,
      color: "bg-blue-100 text-blue-800",
    }

    initiateTestPayment(customScenario, {
      amount,
      customerName,
      customerEmail,
      customerPhone,
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <TestTube className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">PayFast Payment Testing</h1>
          <p className="text-muted-foreground">Test all payment scenarios with PayFast sandbox</p>
          <Badge variant="outline" className="mt-2">
            Sandbox Environment
          </Badge>
        </div>

        {/* Test Card Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              PayFast Sandbox Test Cards
            </CardTitle>
            <CardDescription>Use these test card numbers in PayFast sandbox</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-green-600">✅ Successful Payments</h4>
                <div className="text-sm space-y-1">
                  <p>
                    <code className="bg-muted px-2 py-1 rounded">4000000000000002</code> - Visa Success
                  </p>
                  <p>
                    <code className="bg-muted px-2 py-1 rounded">5200000000000015</code> - Mastercard Success
                  </p>
                  <p>
                    <code className="bg-muted px-2 py-1 rounded">4000000000000044</code> - Visa Success (3D Secure)
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-red-600">❌ Failed Payments</h4>
                <div className="text-sm space-y-1">
                  <p>
                    <code className="bg-muted px-2 py-1 rounded">4000000000000010</code> - Insufficient Funds
                  </p>
                  <p>
                    <code className="bg-muted px-2 py-1 rounded">4000000000000028</code> - Card Declined
                  </p>
                  <p>
                    <code className="bg-muted px-2 py-1 rounded">4000000000000036</code> - Expired Card
                  </p>
                </div>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="text-sm text-muted-foreground">
              <p>
                <strong>CVV:</strong> Use any 3-digit number (e.g., 123)
              </p>
              <p>
                <strong>Expiry:</strong> Use any future date (e.g., 12/25)
              </p>
              <p>
                <strong>Name:</strong> Use any name
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Custom Test Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Custom Test Payment</CardTitle>
            <CardDescription>Create a custom test payment with your own parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amount">Amount (R)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="100.00"
                />
              </div>
              <div>
                <Label htmlFor="name">Customer Name</Label>
                <Input
                  id="name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Test Customer"
                />
              </div>
              <div>
                <Label htmlFor="email">Customer Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="test@example.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Customer Phone</Label>
                <Input
                  id="phone"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+27123456789"
                />
              </div>
            </div>
            <Button onClick={initiateCustomPayment} disabled={loading !== null} className="w-full">
              {loading === "CUSTOM" ? "Processing..." : "Test Custom Payment"}
            </Button>
          </CardContent>
        </Card>

        {/* Predefined Test Scenarios */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testScenarios.map((scenario, index) => (
            <Card key={index} className="relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    {scenario.icon}
                    {scenario.name}
                  </CardTitle>
                  <Badge className={scenario.color}>{scenario.expectedResult.toUpperCase()}</Badge>
                </div>
                <CardDescription>{scenario.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-medium">R{scenario.amount.toFixed(2)}</span>
                  </div>
                  {scenario.testCard && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Test Card:</span>
                      <code className="bg-muted px-2 py-1 rounded text-xs">{scenario.testCard}</code>
                    </div>
                  )}
                  <Button
                    onClick={() => initiateTestPayment(scenario)}
                    disabled={loading !== null}
                    className="w-full"
                    variant={scenario.expectedResult === "success" ? "default" : "outline"}
                  >
                    {loading ===
                    `TEST-${Date.now()}-${scenario.name.replace(/\s+/g, "-").toUpperCase()}`.substring(0, 20)
                      ? "Processing..."
                      : `Test ${scenario.name}`}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Testing Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Testing Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">How to Test:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                <li>Click on any test scenario button above</li>
                <li>A new tab will open with the PayFast payment form</li>
                <li>Use the provided test card numbers</li>
                <li>Fill in any CVV (e.g., 123) and future expiry date (e.g., 12/25)</li>
                <li>Complete the payment process</li>
                <li>Verify you're redirected to the correct success/failure/cancel page</li>
                <li>Check the browser console and Vercel logs for IPN notifications</li>
              </ol>
            </div>
            <Separator />
            <div className="space-y-2">
              <h4 className="font-medium">What to Verify:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Payment form loads correctly with all data</li>
                <li>Successful payments redirect to success page</li>
                <li>Failed payments redirect to failure page</li>
                <li>Cancelled payments redirect to cancel page</li>
                <li>IPN notifications are received and processed</li>
                <li>Order tracking works with payment reference</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
