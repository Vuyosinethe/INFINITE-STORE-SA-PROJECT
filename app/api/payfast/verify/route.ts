import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const paymentId = searchParams.get("payment_id")
    const reference = searchParams.get("reference")

    if (!paymentId && !reference) {
      return NextResponse.json({ error: "Payment ID or reference is required" }, { status: 400 })
    }

    const merchantId = process.env.PAYFAST_MERCHANT_ID
    const merchantKey = process.env.PAYFAST_MERCHANT_KEY

    if (!merchantId || !merchantKey) {
      return NextResponse.json({ error: "Missing PayFast configuration" }, { status: 500 })
    }

    // Determine PayFast URL based on environment
    const isProduction = process.env.NODE_ENV === "production"
    const validateUrl = isProduction
      ? "https://www.payfast.co.za/eng/query/validate"
      : "https://sandbox.payfast.co.za/eng/query/validate"

    console.log("Verifying payment with PayFast:", { paymentId, reference })

    // Verify payment with PayFast
    const response = await fetch(validateUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: paymentId ? `pfParamString=pf_payment_id=${paymentId}` : `pfParamString=custom_str1=${reference}`,
    })

    const result = await response.text()

    if (!response.ok) {
      console.error("PayFast verification failed:", result)
      return NextResponse.json({ error: "Payment verification failed", details: result }, { status: response.status })
    }

    const isValid = result.trim() === "VALID"

    // For demo purposes, return mock data structure
    // In a real application, you would query your database for the payment details
    const mockPaymentData = {
      id: paymentId || `pf_${Date.now()}`,
      reference: reference || "N/A",
      status: isValid ? "completed" : "failed",
      amount: 0, // You would get this from your database
      description: "Order payment",
      created_at: new Date().toISOString(),
      customer: {
        name: "Customer Name", // From your database
        email: "customer@email.com", // From your database
      },
    }

    return NextResponse.json({
      success: true,
      valid: isValid,
      payment: mockPaymentData,
    })
  } catch (error) {
    console.error("PayFast verification error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
