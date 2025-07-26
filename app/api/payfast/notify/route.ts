import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

interface PayFastIPN {
  m_payment_id: string
  pf_payment_id: string
  payment_status: "COMPLETE" | "FAILED" | "CANCELLED"
  item_name: string
  item_description: string
  amount_gross: string
  amount_fee: string
  amount_net: string
  custom_str1: string // Order reference
  custom_str2: string // Source identifier
  custom_str3: string // Customer phone
  name_first: string
  name_last: string
  email_address: string
  merchant_id: string
  signature: string
}

function generateSignature(data: Record<string, string>, passphrase?: string): string {
  // Remove signature from data for verification
  const { signature, ...dataToSign } = data

  // Create parameter string
  const paramString = Object.keys(dataToSign)
    .sort()
    .map((key) => `${key}=${encodeURIComponent(dataToSign[key])}`)
    .join("&")

  // Add passphrase if provided
  const stringToHash = passphrase ? `${paramString}&passphrase=${encodeURIComponent(passphrase)}` : paramString

  // Generate MD5 hash
  return crypto.createHash("md5").update(stringToHash).digest("hex")
}

async function verifyPaymentWithPayFast(pfPaymentId: string): Promise<boolean> {
  try {
    // Skip validation for test payments
    if (pfPaymentId.startsWith("test") || pfPaymentId.includes("TEST")) {
      console.log("⚠️ Skipping PayFast validation for test payment:", pfPaymentId)
      return true
    }

    // FIXED: Use correct environment based on NODE_ENV
    const isProduction = process.env.NODE_ENV === "production"
    const validateUrl = isProduction
      ? "https://www.payfast.co.za/eng/query/validate"
      : "https://sandbox.payfast.co.za/eng/query/validate"

    console.log("PayFast validation environment:", { isProduction, validateUrl })

    const response = await fetch(validateUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `pfParamString=pf_payment_id=${pfPaymentId}`,
    })

    const result = await response.text()
    console.log("PayFast validation response:", result)
    return result.trim() === "VALID"
  } catch (error) {
    console.error("PayFast validation error:", error)
    return false
  }
}

async function processPaymentStatus(ipnData: PayFastIPN) {
  const orderReference = ipnData.custom_str1
  const paymentId = ipnData.pf_payment_id
  const status = ipnData.payment_status

  console.log("Processing payment status:", {
    orderReference,
    paymentId,
    status,
    amount: ipnData.amount_gross,
    customer: ipnData.email_address,
    environment: process.env.NODE_ENV === "production" ? "PRODUCTION" : "SANDBOX",
  })

  switch (status) {
    case "COMPLETE":
      console.log(`✅ Payment successful for order: ${orderReference}`)
      // TODO: Update order status in database
      // TODO: Send confirmation email to customer
      // TODO: Update inventory
      // TODO: Trigger order fulfillment process

      // Example database update (implement based on your database)
      // await updateOrderStatus(orderReference, 'paid', paymentId)
      // await sendOrderConfirmationEmail(ipnData.email_address, orderReference)
      break

    case "FAILED":
      console.log(`❌ Payment failed for order: ${orderReference}`)
      // TODO: Update order status in database
      // TODO: Send failure notification to customer
      // TODO: Log failure reason for analysis

      // Example database update
      // await updateOrderStatus(orderReference, 'failed', paymentId)
      // await sendPaymentFailureEmail(ipnData.email_address, orderReference)
      break

    case "CANCELLED":
      console.log(`🚫 Payment cancelled for order: ${orderReference}`)
      // TODO: Update order status in database
      // TODO: Send cancellation notification to customer

      // Example database update
      // await updateOrderStatus(orderReference, 'cancelled', paymentId)
      break

    default:
      console.log(`❓ Unknown payment status: ${status} for order: ${orderReference}`)
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("🔔 PayFast IPN received at:", new Date().toISOString())
    console.log("📍 Request URL:", request.url)
    console.log("🌐 Environment:", process.env.NODE_ENV === "production" ? "PRODUCTION" : "SANDBOX")
    console.log("🌐 Request headers:", Object.fromEntries(request.headers.entries()))

    // Check content type
    const contentType = request.headers.get("content-type") || ""
    console.log("📋 Content-Type:", contentType)

    const ipnData: Record<string, string> = {}

    // Handle different content types that PayFast might send
    if (contentType.includes("application/x-www-form-urlencoded")) {
      // Handle URL-encoded form data
      const text = await request.text()
      console.log("📝 Raw form data:", text)

      const params = new URLSearchParams(text)
      for (const [key, value] of params.entries()) {
        ipnData[key] = value
      }
    } else if (contentType.includes("multipart/form-data")) {
      // Handle multipart form data
      const formData = await request.formData()
      for (const [key, value] of formData.entries()) {
        ipnData[key] = value.toString()
      }
    } else {
      // Try to parse as form data anyway (fallback)
      try {
        const formData = await request.formData()
        for (const [key, value] of formData.entries()) {
          ipnData[key] = value.toString()
        }
      } catch {
        // If that fails, try as URL-encoded
        try {
          const text = await request.text()
          const params = new URLSearchParams(text)
          for (const [key, value] of params.entries()) {
            ipnData[key] = value
          }
        } catch {
          console.error("Unable to parse request body")
          return NextResponse.json({ error: "Unable to parse request body" }, { status: 400 })
        }
      }
    }

    console.log("📦 Full IPN Data received:", ipnData)
    console.log("💰 Payment details:", {
      payment_id: ipnData.pf_payment_id,
      status: ipnData.payment_status,
      reference: ipnData.custom_str1,
      amount: ipnData.amount_gross,
      customer: ipnData.email_address,
      timestamp: new Date().toISOString(),
    })

    // Validate required fields
    if (!ipnData.pf_payment_id || !ipnData.payment_status || !ipnData.custom_str1) {
      console.error("Missing required fields in PayFast IPN")
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // FIXED: Use correct passphrase based on environment
    const isProduction = process.env.NODE_ENV === "production"
    const passphrase = isProduction ? process.env.PAYFAST_PASSPHRASE : "jt7NOE43FZPn"

    console.log("Using passphrase for environment:", {
      isProduction,
      hasPassphrase: !!passphrase,
      passphraseLength: passphrase?.length || 0,
    })

    // Verify signature if passphrase is configured
    if (passphrase && ipnData.signature) {
      const expectedSignature = generateSignature(ipnData, passphrase)
      if (expectedSignature !== ipnData.signature) {
        console.error("Invalid PayFast IPN signature")
        console.log("Expected signature:", expectedSignature)
        console.log("Received signature:", ipnData.signature)
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
      }
      console.log("✅ PayFast IPN signature verified")
    } else {
      console.log("⚠️ No signature verification (passphrase not configured or signature not provided)")
    }

    // Verify payment with PayFast (additional security)
    const isValidPayment = await verifyPaymentWithPayFast(ipnData.pf_payment_id)
    if (!isValidPayment) {
      console.error("PayFast payment validation failed")
      return NextResponse.json({ error: "Payment validation failed" }, { status: 400 })
    }

    console.log("✅ PayFast payment validated successfully")

    // Process the payment status
    await processPaymentStatus(ipnData as PayFastIPN)

    // Always respond with 200 OK to acknowledge receipt
    return NextResponse.json({
      success: true,
      message: "IPN processed successfully",
      payment_id: ipnData.pf_payment_id,
      reference: ipnData.custom_str1,
      status: ipnData.payment_status,
      environment: isProduction ? "production" : "sandbox",
    })
  } catch (error) {
    console.error("PayFast IPN processing error:", error)
    return NextResponse.json(
      {
        error: "IPN processing failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

// Handle GET requests for IPN verification (if required by PayFast)
export async function GET(request: NextRequest) {
  const isProduction = process.env.NODE_ENV === "production"
  return NextResponse.json({
    message: "PayFast IPN endpoint is active",
    environment: isProduction ? "production" : "sandbox",
    timestamp: new Date().toISOString(),
    url: request.url,
  })
}
