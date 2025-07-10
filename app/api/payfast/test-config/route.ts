import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check all required environment variables
    const requiredVars = {
      PAYFAST_MERCHANT_ID: process.env.PAYFAST_MERCHANT_ID,
      PAYFAST_MERCHANT_KEY: process.env.PAYFAST_MERCHANT_KEY,
      PAYFAST_PASSPHRASE: process.env.PAYFAST_PASSPHRASE,
      NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
      NODE_ENV: process.env.NODE_ENV,
    }

    const missing = Object.entries(requiredVars)
      .filter(([key, value]) => !value)
      .map(([key]) => key)

    if (missing.length > 0) {
      return NextResponse.json({
        success: false,
        error: `Missing environment variables: ${missing.join(", ")}`,
        details: `Please configure these variables in your Vercel dashboard`,
      })
    }

    // Mask sensitive information
    const maskedMerchantId = requiredVars.PAYFAST_MERCHANT_ID
      ? requiredVars.PAYFAST_MERCHANT_ID.slice(0, 4) + "***"
      : "Not set"

    return NextResponse.json({
      success: true,
      message: "All environment variables configured",
      details: `Environment: ${requiredVars.NODE_ENV}, Base URL: ${requiredVars.NEXT_PUBLIC_BASE_URL}, Merchant ID: ${maskedMerchantId}`,
      environment: {
        NODE_ENV: requiredVars.NODE_ENV,
        BASE_URL: requiredVars.NEXT_PUBLIC_BASE_URL,
        MERCHANT_ID_MASKED: maskedMerchantId,
        PASSPHRASE_SET: !!requiredVars.PAYFAST_PASSPHRASE,
        MERCHANT_KEY_SET: !!requiredVars.PAYFAST_MERCHANT_KEY,
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to check environment variables",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
