import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

interface PaymentRequest {
  amount: number
  description: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  reference: string
  items: Array<{
    name: string
    quantity: number
    price: number
    size?: string
  }>
}

function generateSignature(data: Record<string, string | number>, passphrase?: string): string {
  // PayFast requires parameters in SPECIFIC ORDER, not alphabetical!
  // Order as per PayFast documentation
  const orderedKeys = [
    "merchant_id",
    "merchant_key",
    "return_url",
    "cancel_url",
    "notify_url",
    "name_first",
    "name_last",
    "email_address",
    "cell_number",
    "amount",
    "item_name",
    "item_description",
    "custom_int1",
    "custom_int2",
    "custom_int3",
    "custom_int4",
    "custom_int5",
    "custom_str1",
    "custom_str2",
    "custom_str3",
    "custom_str4",
    "custom_str5",
    "email_confirmation",
    "confirmation_address",
    "payment_method",
    "subscription_type",
    "billing_date",
    "recurring_amount",
    "frequency",
    "cycles",
  ]

  // Build parameter string in the correct order
  const paramArray: string[] = []

  for (const key of orderedKeys) {
    if (key in data) {
      const value = data[key]

      // Skip empty values
      if (value === "" || value === null || value === undefined) {
        continue
      }

      // Convert to string and trim
      const stringValue = value.toString().trim()

      // Skip if still empty after trimming
      if (stringValue === "") {
        continue
      }

      // PayFast requires URL encoding with specific format
      // Spaces as '+' and uppercase hex encoding
      const encodedValue = encodeURIComponent(stringValue)
        .replace(/%20/g, "+")
        .replace(/[!'()*]/g, (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase())

      paramArray.push(`${key}=${encodedValue}`)
    }
  }

  // Join with & to create parameter string
  const paramString = paramArray.join("&")

  console.log("Signature generation debug:", {
    paramCount: paramArray.length,
    hasPassphrase: !!passphrase,
    orderedParams: paramArray,
    paramString: paramString,
  })

  // Add passphrase if provided
  let stringToHash = paramString
  if (passphrase && passphrase.trim() !== "") {
    const encodedPassphrase = encodeURIComponent(passphrase.trim())
      .replace(/%20/g, "+")
      .replace(/[!'()*]/g, (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase())
    stringToHash = `${paramString}&passphrase=${encodedPassphrase}`
  }

  console.log("String to hash:", stringToHash)

  // Generate MD5 hash
  const hash = crypto.createHash("md5").update(stringToHash).digest("hex")
  console.log("Generated hash:", hash)

  return hash
}

export async function POST(request: NextRequest) {
  console.log("=== PayFast API Route Called ===")
  console.log("Request method:", request.method)
  console.log("Request URL:", request.url)

  try {
    // Check if request has body
    const contentType = request.headers.get("content-type")
    console.log("Content-Type:", contentType)

    if (!contentType || !contentType.includes("application/json")) {
      console.error("Invalid content type:", contentType)
      return NextResponse.json({ error: "Content-Type must be application/json" }, { status: 400 })
    }

    let body: PaymentRequest
    try {
      body = await request.json()
      console.log("Request body parsed successfully:", JSON.stringify(body, null, 2))
    } catch (parseError) {
      console.error("JSON parse error:", parseError)
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 })
    }

    // Validate required environment variables
    const merchantId = process.env.PAYFAST_MERCHANT_ID
    const merchantKey = process.env.PAYFAST_MERCHANT_KEY
    const passphrase = process.env.PAYFAST_PASSPHRASE
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    const nodeEnv = process.env.NODE_ENV

    console.log("Environment variables check:", {
      merchantId: merchantId ? `${merchantId.substring(0, 4)}***` : "MISSING",
      merchantKey: merchantKey ? `${merchantKey.substring(0, 4)}***` : "MISSING",
      passphrase: passphrase ? "SET" : "MISSING",
      baseUrl,
      nodeEnv,
    })

    if (!baseUrl) {
      console.error("Missing base URL")
      return NextResponse.json({ error: "Missing required base URL configuration" }, { status: 500 })
    }

    // Validate request data
    if (!body.amount || body.amount <= 0) {
      console.error("Invalid amount:", body.amount)
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }
    if (!body.description || body.description.trim() === "") {
      console.error("Missing description")
      return NextResponse.json({ error: "Missing description" }, { status: 400 })
    }
    if (!body.customerName || body.customerName.trim() === "") {
      console.error("Missing customer name")
      return NextResponse.json({ error: "Missing customer name" }, { status: 400 })
    }
    if (!body.customerEmail || body.customerEmail.trim() === "") {
      console.error("Missing customer email")
      return NextResponse.json({ error: "Missing customer email" }, { status: 400 })
    }
    if (!body.reference || body.reference.trim() === "") {
      console.error("Missing reference")
      return NextResponse.json({ error: "Missing reference" }, { status: 400 })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.customerEmail)) {
      console.error("Invalid email format:", body.customerEmail)
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Determine if it's production based on NODE_ENV
    const isProduction = process.env.NODE_ENV === "production"
    const payfastUrl = isProduction
      ? "https://www.payfast.co.za/eng/process"
      : "https://sandbox.payfast.co.za/eng/process"

    // Use production credentials if in production, otherwise use sandbox test credentials
    const finalMerchantId = isProduction ? merchantId : "10000100"
    const finalMerchantKey = isProduction ? merchantKey : "46f0cd694581a"
    const finalPassphrase = isProduction ? passphrase : "jt7NOE43FZPn"

    console.log("PayFast environment:", {
      isProduction,
      payfastUrl,
      merchantId: finalMerchantId,
      usingTestCredentials: !isProduction,
    })

    // Prepare PayFast payment data in the EXACT order required by PayFast
    const paymentData: Record<string, string | number> = {
      // Merchant details (MUST be first)
      merchant_id: finalMerchantId,
      merchant_key: finalMerchantKey,

      // URLs
      return_url: `${baseUrl}/payment/success?reference=${encodeURIComponent(body.reference)}`,
      cancel_url: `${baseUrl}/payment/cancel?reference=${encodeURIComponent(body.reference)}`,
      notify_url: `${baseUrl}/api/payfast/notify`,

      // Customer details
      name_first: body.customerName.split(" ")[0]?.substring(0, 100).trim() || "Customer",
      name_last: body.customerName.split(" ").slice(1).join(" ").substring(0, 100).trim() || "",
      email_address: body.customerEmail.substring(0, 255).trim(),

      // Transaction details
      amount: Number.parseFloat(body.amount.toFixed(2)),
      item_name: body.description.substring(0, 100).trim(),
      item_description: `Order ${body.reference} from iNfinite store.SA`.substring(0, 255).trim(),

      // Custom fields for order tracking
      custom_str1: body.reference.substring(0, 255).trim(),
      custom_str2: "infinite-store-sa",
      custom_str3: body.customerPhone?.substring(0, 255).trim() || "",
      custom_str4: `${body.items.length} items`,
      custom_str5: new Date().toISOString().substring(0, 255),
    }

    console.log("PayFast data before cleanup:", JSON.stringify(paymentData, null, 2))

    // Remove empty values to avoid signature issues
    Object.keys(paymentData).forEach((key) => {
      const value = paymentData[key]
      if (value === "" || value === null || value === undefined) {
        console.log(`Removing empty field: ${key}`)
        delete paymentData[key]
      }
    })

    console.log("PayFast data after cleanup:", JSON.stringify(paymentData, null, 2))

    // Generate signature using the sandbox passphrase with correct ordering
    if (finalPassphrase && finalPassphrase.trim() !== "") {
      paymentData.signature = generateSignature(paymentData, finalPassphrase)
      console.log("Generated signature:", paymentData.signature)
    } else {
      console.log("No passphrase provided, skipping signature generation")
    }

    // Validate URLs are accessible
    try {
      new URL(paymentData.return_url as string)
      new URL(paymentData.cancel_url as string)
      new URL(paymentData.notify_url as string)
      console.log("All URLs validated successfully")
    } catch (urlError) {
      console.error("Invalid URL format:", urlError)
      return NextResponse.json({ error: "Invalid URL configuration" }, { status: 500 })
    }

    console.log("Final PayFast payment data:", {
      merchant_id: paymentData.merchant_id,
      amount: paymentData.amount,
      item_name: paymentData.item_name,
      email_address: paymentData.email_address,
      return_url: paymentData.return_url,
      cancel_url: paymentData.cancel_url,
      notify_url: paymentData.notify_url,
      hasSignature: !!paymentData.signature,
      fieldCount: Object.keys(paymentData).length,
    })

    console.log("=== PayFast Payment Creation Success ===")
    console.log("Reference:", body.reference)
    console.log("Amount:", body.amount)
    console.log("Customer:", body.customerEmail)
    console.log("Environment:", isProduction ? "production" : "sandbox")

    // Return payment form data for frontend to submit
    const response = {
      success: true,
      paymentUrl: payfastUrl,
      paymentData,
      reference: body.reference,
      amount: body.amount,
      environment: isProduction ? "production" : "sandbox",
      debug: {
        merchantId: finalMerchantId.substring(0, 8) + "***",
        hasSignature: !!paymentData.signature,
        fieldCount: Object.keys(paymentData).length,
        usingTestCredentials: !isProduction,
      },
    }

    console.log("Sending response:", JSON.stringify(response, null, 2))
    return NextResponse.json(response)
  } catch (error) {
    console.error("=== PayFast Payment Error ===")
    console.error("Error details:", error)
    console.error("Stack trace:", error instanceof Error ? error.stack : "No stack trace")

    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
        details: process.env.NODE_ENV === "development" ? error : undefined,
      },
      { status: 500 },
    )
  }
}

// Add OPTIONS handler for CORS
export async function OPTIONS(request: NextRequest) {
  console.log("=== OPTIONS Request ===")
  console.log("Origin:", request.headers.get("origin"))

  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}
