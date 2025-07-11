"use client"

\`\`\`tsx
// components/payfast-payment-form.tsx
import type React from "react"

interface PayFastPaymentFormProps {
  merchantId: string
  merchantKey: string
  amount: number
  itemName: string
  itemDescription: string
  returnUrl: string
  cancelUrl: string
  notifyUrl: string
  nameFirst?: string
  nameLast?: string
  emailAddress?: string
  customStr1?: string
  customStr2?: string
  customInt1?: number
  customInt2?: number
}

const PayFastPaymentForm: React.FC<PayFastPaymentFormProps> = ({
  merchantId,
  merchantKey,
  amount,
  itemName,
  itemDescription,
  returnUrl,
  cancelUrl,
  notifyUrl,
  nameFirst,
  nameLast,
  emailAddress,
  customStr1,
  customStr2,
  customInt1,
  customInt2,
}) => {
  const generatePayFastForm = () => {
    const form = document.createElement("form")
    form.method = "POST"
    form.action = "https://www.payfast.co.za/eng/process"

    const addInput = (name: string, value: string | number | undefined) => {
      if (value !== undefined) {
        const input = document.createElement("input")
        input.type = "hidden"
        input.name = name
        input.value = String(value)
        form.appendChild(input)
      }
    }

    addInput("merchant_id", merchantId)
    addInput("merchant_key", merchantKey)
    addInput("amount", amount.toFixed(2))
    addInput("item_name", itemName)
    addInput("item_description", itemDescription)
    addInput("return_url", returnUrl)
    addInput("cancel_url", cancelUrl)
    addInput("notify_url", notifyUrl)
    addInput("name_first", nameFirst)
    addInput("name_last", nameLast)
    addInput("email_address", emailAddress)
    addInput("custom_str1", customStr1)
    addInput("custom_str2", customStr2)
    addInput("custom_int1", customInt1)
    addInput("custom_int2", customInt2)

    document.body.appendChild(form)
    form.submit()
  }

  return <button onClick={generatePayFastForm}>Pay with PayFast</button>
}

export default PayFastPaymentForm
\`\`\`

\`\`\`tsx
// app/checkout/page.tsx
import PayFastPaymentForm from "@/components/payfast-payment-form"

const CheckoutPage = () => {
  return (
    <div>
      <h1>Checkout</h1>
      <PayFastPaymentForm
        merchantId="10023083"
        merchantKey="i83k9hk3k9hk3"
        amount={20.0}
        itemName="Test Item"
        itemDescription="This is a test item"
        returnUrl="http://localhost:3000/return"
        cancelUrl="http://localhost:3000/cancel"
        notifyUrl="http://localhost:3000/notify"
      />
    </div>
  )
}

export default CheckoutPage
\`\`\`
