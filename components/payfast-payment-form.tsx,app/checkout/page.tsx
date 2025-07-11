"use client"
\
**components/payfast-payment-form.tsx**

\`\`\`tsx

interface PayFastPaymentFormProps {
  amount: number
  itemName: string
  itemDescription: string
  nameFirst: string
  nameLast: string
  emailAddress: string
  merchantId: string
  merchantKey: string
  returnUrl: string
  cancelUrl: string
  notifyUrl: string
}

const PayFastPaymentForm: React.FC<PayFastPaymentFormProps> = ({
  amount,
  itemName,
  itemDescription,
  nameFirst,
  nameLast,
  emailAddress,
  merchantId,
  merchantKey,
  returnUrl,
  cancelUrl,
  notifyUrl,
}) => {
  // In a real implementation, you would generate the PayFast form here.
  // This is a simplified example.

  const generatePayFastForm = () => {
    const form = document.createElement("form")
    form.method = "POST"
    form.action = "https://www.payfast.co.za/eng/process" // Use the correct PayFast URL

    const addInput = (name: string, value: string) => {
      const input = document.createElement("input")
      input.type = "hidden"
      input.name = name
      input.value = value
      form.appendChild(input)
    }

    addInput("merchant_id", merchantId)
    addInput("merchant_key", merchantKey)
    addInput("return_url", returnUrl)
    addInput("cancel_url", cancelUrl)
    addInput("notify_url", notifyUrl)
    addInput("amount", amount.toFixed(2))
    addInput("item_name", itemName)
    addInput("item_description", itemDescription)
    addInput("name_first", nameFirst)
    addInput("name_last", nameLast)
    addInput("email_address", emailAddress)

    document.body.appendChild(form)
    form.submit()
  }

  return (
    <div>
      <button onClick={generatePayFastForm}>Pay with PayFast</button>
    </div>
  )
}

export default PayFastPaymentForm
\`\`\`

**app/checkout/page.tsx**

\`\`\`tsx
// This is a placeholder for the checkout page.
// Replace this with your actual implementation.

import type React from "react"
import PayFastPaymentForm from "@/components/payfast-payment-form"

const CheckoutPage = () => {
  // Replace these with your actual data.
  const paymentData = {
    amount: 100.0,
    itemName: "Test Item",
    itemDescription: "This is a test item description.",
    nameFirst: "John",
    nameLast: "Doe",
    emailAddress: "john.doe@example.com",
    merchantId: "10000100", // Replace with your merchant ID
    merchantKey: "46f0cd694581a", // Replace with your merchant key
    returnUrl: "https://example.com/return",
    cancelUrl: "https://example.com/cancel",
    notifyUrl: "https://example.com/notify",
  }

  return (
    <div>
      <h1>Checkout</h1>
      <p>Please confirm your order:</p>
      {/* Display order details here */}
      <PayFastPaymentForm {...paymentData} />
    </div>
  )
}

export default CheckoutPage;
\`\`\`
