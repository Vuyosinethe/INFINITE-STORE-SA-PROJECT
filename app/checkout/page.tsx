import PayFastPaymentForm from "@/components/payfast-payment-form"

export default function CheckoutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Secure Checkout</h1>
        <p className="text-muted-foreground">Complete your purchase with PayFast's secure payment gateway</p>
      </div>

      <PayFastPaymentForm />
    </div>
  )
}
