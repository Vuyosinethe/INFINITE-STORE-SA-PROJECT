"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  CheckCircle,
  XCircle,
  Loader2,
  ExternalLink,
  CreditCard,
  Settings,
  TestTube,
  AlertTriangle,
  Info,
} from "lucide-react"

interface TestResult {
  name: string
  status: "success" | "error" | "pending"
  message: string
  details?: string
}

export default function PaymentTestPage() {
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const runIntegrationTests = async () => {
    setIsRunning(true)
    setTestResults([])

    const tests = [
      {
        name: "Environment Variables",
        test: async () => {
          const response = await fetch("/api/payfast/test-config")
          const result = await response.json()
          return {
            success: result.success,
            message: result.success ? "All environment variables configured" : result.error,
            details: result.details,
          }
        },
      },
      {
        name: "IPN Endpoint Accessibility",
        test: async () => {
          try {
            // Test with proper form data that PayFast would send
            const formData = new FormData()
            formData.append("m_payment_id", "test123")
            formData.append("pf_payment_id", "test456")
            formData.append("payment_status", "COMPLETE")
            formData.append("custom_str1", "TEST_ORDER_REF")
            formData.append("amount_gross", "100.00")
            formData.append("email_address", "test@example.com")
            formData.append("name_first", "Test")
            formData.append("name_last", "User")
            formData.append("merchant_id", "10004002")

            const response = await fetch("/api/payfast/notify", {
              method: "POST",
              body: formData,
            })

            const result = await response.json()
            return {
              success: response.ok,
              message: response.ok ? "IPN endpoint accessible and responding" : "IPN endpoint error",
              details: result.message || result.error || `Status: ${response.status}`,
            }
          } catch (error) {
            return {
              success: false,
              message: "IPN endpoint not accessible",
              details: error instanceof Error ? error.message : "Network error",
            }
          }
        },
      },
      {
        name: "Payment Initiation",
        test: async () => {
          try {
            const testPayment = {
              amount: 100,
              description: "Test Payment",
              customerName: "Test User",
              customerEmail: "test@example.com",
              customerPhone: "+27123456789",
              reference: `TEST${Date.now()}`,
              items: [{ name: "Test Item", quantity: 1, price: 100 }],
            }

            const response = await fetch("/api/payfast/initiate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(testPayment),
            })

            const result = await response.json()
            return {
              success: result.success,
              message: result.success ? "Payment initiation working" : "Payment initiation failed",
              details: result.success ? `Reference: ${testPayment.reference}` : result.error,
            }
          } catch (error) {
            return {
              success: false,
              message: "Payment initiation failed",
              details: error instanceof Error ? error.message : "Network error",
            }
          }
        },
      },
    ]

    for (const test of tests) {
      setTestResults((prev) => [...prev, { name: test.name, status: "pending", message: "Running test..." }])

      try {
        const result = await test.test()
        setTestResults((prev) =>
          prev.map((t) =>
            t.name === test.name
              ? {
                  name: test.name,
                  status: result.success ? "success" : "error",
                  message: result.message,
                  details: result.details,
                }
              : t,
          ),
        )
      } catch (error) {
        setTestResults((prev) =>
          prev.map((t) =>
            t.name === test.name
              ? {
                  name: test.name,
                  status: "error",
                  message: "Test failed",
                  details: error instanceof Error ? error.message : "Unknown error",
                }
              : t,
          ),
        )
      }

      // Small delay between tests
      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    setIsRunning(false)
  }

  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-600" />
      case "pending":
        return <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
    }
  }

  const getStatusBadge = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">SUCCESS</Badge>
      case "error":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">ERROR</Badge>
      case "pending":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">RUNNING</Badge>
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">PayFast Integration Testing</h1>
          <p className="text-muted-foreground">Comprehensive testing suite for your PayFast payment integration</p>
        </div>

        {/* Test Runner */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="h-5 w-5" />
              Automated Integration Tests
            </CardTitle>
            <CardDescription>Run automated tests to verify your PayFast configuration and integration</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={runIntegrationTests}
              disabled={isRunning}
              className="w-full bg-orange-600 hover:bg-orange-700"
              size="lg"
            >
              {isRunning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Running Tests...
                </>
              ) : (
                <>
                  <TestTube className="mr-2 h-4 w-4" />
                  Run Integration Tests
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Test Results */}
        {testResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {testResults.map((result, index) => (
                <div key={index} className="flex items-start gap-3 p-4 border rounded-lg">
                  {getStatusIcon(result.status)}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{result.name}</h3>
                      {getStatusBadge(result.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">{result.message}</p>
                    {result.details && (
                      <p className="text-xs text-muted-foreground bg-muted p-2 rounded">{result.details}</p>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* PayFast Test Cards */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              PayFast Sandbox Test Cards
            </CardTitle>
            <CardDescription>Use these test card numbers in the PayFast sandbox environment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-green-700">✅ Successful Payments</h4>
                <div className="space-y-1 text-sm">
                  <div className="font-mono bg-green-50 p-2 rounded">4000000000000002</div>
                  <div className="font-mono bg-green-50 p-2 rounded">5200000000000015</div>
                  <div className="font-mono bg-green-50 p-2 rounded">4242424242424242</div>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-red-700">❌ Failed Payments</h4>
                <div className="space-y-1 text-sm">
                  <div className="font-mono bg-red-50 p-2 rounded">4000000000000010</div>
                  <div className="font-mono bg-red-50 p-2 rounded">4000000000000028</div>
                  <div className="font-mono bg-red-50 p-2 rounded">4000000000000036</div>
                </div>
              </div>
            </div>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>Use any future expiry date (MM/YY) and any 3-digit CVV for testing.</AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Manual Testing Checklist */}
        <Card>
          <CardHeader>
            <CardTitle>Manual Testing Checklist</CardTitle>
            <CardDescription>Complete these steps to fully test your payment integration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="test1" className="rounded" />
                <label htmlFor="test1" className="text-sm">
                  Add items to cart and proceed to checkout
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="test2" className="rounded" />
                <label htmlFor="test2" className="text-sm">
                  Complete payment form with test card 4000000000000002
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="test3" className="rounded" />
                <label htmlFor="test3" className="text-sm">
                  Verify successful payment redirect and confirmation page
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="test4" className="rounded" />
                <label htmlFor="test4" className="text-sm">
                  Test failed payment with card 4000000000000010
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="test5" className="rounded" />
                <label htmlFor="test5" className="text-sm">
                  Test cancelled payment (click cancel on PayFast page)
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="test6" className="rounded" />
                <label htmlFor="test6" className="text-sm">
                  Check Vercel function logs for IPN notifications
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="test7" className="rounded" />
                <label htmlFor="test7" className="text-sm">
                  Test order tracking with generated reference number
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Direct links to test different parts of your application</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="outline" asChild className="h-auto p-4 bg-transparent">
                <a href="/checkout" className="flex flex-col items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Test Checkout</span>
                </a>
              </Button>
              <Button variant="outline" asChild className="h-auto p-4 bg-transparent">
                <a href="/track-order" className="flex flex-col items-center gap-2">
                  <Settings className="h-5 w-5" />
                  <span>Order Tracking</span>
                </a>
              </Button>
              <Button variant="outline" asChild className="h-auto p-4 bg-transparent">
                <a
                  href="https://vercel.com/dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2"
                >
                  <ExternalLink className="h-5 w-5" />
                  <span>Vercel Logs</span>
                </a>
              </Button>
              <Button variant="outline" asChild className="h-auto p-4 bg-transparent">
                <a
                  href="https://sandbox.payfast.co.za"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2"
                >
                  <ExternalLink className="h-5 w-5" />
                  <span>PayFast Sandbox</span>
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Important Notes */}
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Important:</strong> This is a testing environment. All transactions are simulated and no real money
            is processed. Make sure to switch to production credentials before going live.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}
