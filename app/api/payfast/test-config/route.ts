import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const merchantId = process.env.PAYFAST_MERCHANT_ID
    const merchantKey = process.env.PAYFAST_MERCHANT_KEY
    const passphrase = process.env.PAYFAST_PASSPHRASE
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    const nodeEnv = process.env.NODE_ENV

    // FIXED: Determine if we're in production based on NODE_ENV and credentials
    const isProduction = nodeEnv === "production" && merchantId && merchantKey
    const hasProductionCredentials = !!(merchantId && merchantKey)

    const config = {
      success: true,
      merchantId: isProduction ? merchantId : "10000100 (sandbox)",
      merchantKey: isProduction ? `${merchantKey?.substring(0, 8)}***` : "46f0cd694581a (sandbox)",
      passphrase: passphrase ? "******** (Set)" : "Not Set",
      returnUrl: `${baseUrl}/payment/success`,
      cancelUrl: `${baseUrl}/payment/cancel`,
      notifyUrl: `${baseUrl}/api/payfast/notify`,
      isSandbox: !isProduction,
      environment: isProduction ? "PRODUCTION" : "SANDBOX",
      nodeEnv,
      hasProductionCredentials,
      details: isProduction
        ? "Using production PayFast credentials"
        : hasProductionCredentials
          ? "Production credentials available but NODE_ENV is not 'production'"
          : "Using sandbox credentials - set PAYFAST_MERCHANT_ID and PAYFAST_MERCHANT_KEY for production",
    }

    return NextResponse.json(config)
  } catch (error) {
    console.error("Error fetching PayFast config:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch PayFast configuration",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { merchantId, merchantKey, passphrase } = body

    if (!merchantId || !merchantKey) {
      return NextResponse.json(
        {
          success: false,
          error: "Merchant ID and Merchant Key are required",
        },
        { status: 400 },
      )
    }

    // Basic validation - check if credentials look valid
    const merchantIdValid = /^\d{8}$/.test(merchantId)
    const merchantKeyValid = /^[a-f0-9]{13}$/.test(merchantKey)

    if (!merchantIdValid) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid Merchant ID format (should be 8 digits)",
        },
        { status: 400 },
      )
    }

    if (!merchantKeyValid) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid Merchant Key format (should be 13 hex characters)",
        },
        { status: 400 },
      )
    }

    // Test signature generation
    const testData = {
      merchant_id: merchantId,
      merchant_key: merchantKey,
      amount: "100.00",
      item_name: "Test Item",
    }

    let testSignature = ""
    try {
      const crypto = require("crypto")
      const paramString = Object.keys(testData)
        .sort()
        .map((key) => `${key}=${encodeURIComponent(testData[key as keyof typeof testData])}`)
        .join("&")

      const stringToHash = passphrase ? `${paramString}&passphrase=${encodeURIComponent(passphrase)}` : paramString

      testSignature = crypto.createHash("md5").update(stringToHash).digest("hex")
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to generate test signature",
          message: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "PayFast configuration test successful",
      details: {
        merchantId: `${merchantId.substring(0, 4)}***`,
        merchantKey: `${merchantKey.substring(0, 4)}***`,
        hasPassphrase: !!passphrase,
        testSignature: testSignature.substring(0, 8) + "***",
        environment: process.env.NODE_ENV === "production" ? "PRODUCTION" : "SANDBOX",
      },
    })
  } catch (error) {
    console.error("Error testing PayFast config:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Configuration test failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
